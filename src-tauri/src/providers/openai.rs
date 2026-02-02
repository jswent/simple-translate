use crate::models::{Settings, TranslationRequest, TranslationResponse};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<Message>,
    stream: bool,
}

#[derive(Serialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Deserialize, Debug)]
struct ChatChunk {
    choices: Vec<ChunkChoice>,
}

#[derive(Deserialize, Debug)]
struct ChunkChoice {
    delta: Delta,
}

#[derive(Deserialize, Debug)]
struct Delta {
    content: Option<String>,
}

pub async fn stream_translation(
    app: AppHandle,
    request: TranslationRequest,
    settings: Settings,
) -> Result<(), String> {
    let client = reqwest::Client::builder()
        .tcp_nodelay(true)
        .build()
        .map_err(|e| e.to_string())?;

    let user_prompt = format!(
        "Translate the following text from {} to {}:\n\n{}",
        request.source_language, request.target_language, request.text
    );

    let chat_request = ChatRequest {
        model: settings.model.clone(),
        messages: vec![
            Message {
                role: "system".to_string(),
                content: settings.system_prompt.clone(),
            },
            Message {
                role: "user".to_string(),
                content: user_prompt,
            },
        ],
        stream: true,
    };

    let response = client
        .post("https://api.openai.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", settings.api_key))
        .header("Content-Type", "application/json")
        .json(&chat_request)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let body = response.text().await.unwrap_or_default();
        return Err(format!("API error: {}", body));
    }

    let mut stream = response.bytes_stream();
    let mut buffer = String::new();
    let mut full_text = String::new();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| e.to_string())?;
        let chunk_str = String::from_utf8_lossy(&chunk);
        buffer.push_str(&chunk_str);

        while let Some(event_end) = buffer.find("\n\n") {
            let event = buffer[..event_end].to_string();
            buffer = buffer[event_end + 2..].to_string();

            for line in event.lines() {
                if let Some(data) = line.strip_prefix("data: ") {
                    if data == "[DONE]" {
                        continue;
                    }

                    if let Ok(parsed) = serde_json::from_str::<ChatChunk>(data) {
                        for choice in parsed.choices {
                            if let Some(content) = choice.delta.content {
                                full_text.push_str(&content);
                                let _ = app.emit("translation_token", &content);
                            }
                        }
                    }
                }
            }
        }
    }

    let response = TranslationResponse {
        translated_text: full_text,
        source_language: request.source_language,
        target_language: request.target_language,
    };

    let _ = app.emit("translation_complete", &response);
    Ok(())
}
