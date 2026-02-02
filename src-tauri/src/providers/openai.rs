use crate::models::{Settings, TranslationRequest, TranslationResponse};
use async_openai::{
    config::OpenAIConfig,
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestSystemMessageArgs,
        ChatCompletionRequestUserMessageArgs, CreateChatCompletionRequestArgs,
    },
    Client,
};
use futures::StreamExt;
use tauri::{AppHandle, Emitter};

fn get_client(api_key: &str) -> Client<OpenAIConfig> {
    // Note: We create a new client if the API key changes
    // For production, you might want to cache per API key
    let config = OpenAIConfig::new().with_api_key(api_key);
    Client::with_config(config)
}

pub async fn stream_translation(
    app: AppHandle,
    request: TranslationRequest,
    settings: Settings,
) -> Result<(), String> {
    println!("[openai] Starting streaming translation");
    println!("[openai] Model: {}", settings.model);
    println!(
        "[openai] Source: {}, Target: {}",
        request.source_language, request.target_language
    );
    println!("[openai] Text length: {} chars", request.text.len());

    let start = std::time::Instant::now();

    let client = get_client(&settings.api_key);

    let user_prompt = format!(
        "Translate the following text from {} to {}:\n\n{}",
        request.source_language, request.target_language, request.text
    );

    let messages = vec![
        ChatCompletionRequestMessage::System(
            ChatCompletionRequestSystemMessageArgs::default()
                .content(settings.system_prompt.clone())
                .build()
                .map_err(|e| e.to_string())?,
        ),
        ChatCompletionRequestMessage::User(
            ChatCompletionRequestUserMessageArgs::default()
                .content(user_prompt)
                .build()
                .map_err(|e| e.to_string())?,
        ),
    ];

    let request_args = CreateChatCompletionRequestArgs::default()
        .model(settings.model.clone())
        .messages(messages)
        .build()
        .map_err(|e| e.to_string())?;

    println!("[openai] Sending request...");

    let mut stream = client
        .chat()
        .create_stream(request_args)
        .await
        .map_err(|e| {
            println!("[openai] Error creating stream: {}", e);
            e.to_string()
        })?;

    println!("[openai] Stream created in {:?}", start.elapsed());

    let mut full_text = String::new();
    let mut first_token = true;
    let mut token_count = 0u32;

    while let Some(result) = stream.next().await {
        match result {
            Ok(response) => {
                for choice in response.choices {
                    if let Some(content) = choice.delta.content {
                        if first_token {
                            println!("[openai] First token received in {:?}", start.elapsed());
                            first_token = false;
                        }
                        token_count += 1;
                        full_text.push_str(&content);

                        // Emit token immediately to frontend
                        if let Err(e) = app.emit("translation_token", &content) {
                            println!("[openai] Error emitting token: {}", e);
                        }
                    }
                }
            }
            Err(e) => {
                println!("[openai] Stream error: {}", e);
                let _ = app.emit("translation_error", e.to_string());
                return Err(e.to_string());
            }
        }
    }

    println!("[openai] Stream complete in {:?}", start.elapsed());
    println!("[openai] Total tokens: {}", token_count);
    println!("[openai] Result length: {} chars", full_text.len());

    // Emit the complete response
    let response = TranslationResponse {
        translated_text: full_text,
        source_language: request.source_language,
        target_language: request.target_language,
    };

    if let Err(e) = app.emit("translation_complete", &response) {
        println!("[openai] Error emitting complete: {}", e);
        return Err(e.to_string());
    }

    Ok(())
}
