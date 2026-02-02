use crate::models::{Settings, TranslationRequest};
use crate::providers::stream_translation;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub async fn translate(
    app: AppHandle,
    request: TranslationRequest,
    settings: Settings,
) -> Result<(), String> {
    println!("[translate] Received request: {:?}", request);
    println!(
        "[translate] Using model: {}, provider: {}",
        settings.model, settings.provider
    );

    if settings.api_key.is_empty() {
        let error = "API key not configured. Please set your API key in Settings.".to_string();
        println!("[translate] ERROR: {}", error);
        let _ = app.emit("translation_error", &error);
        return Err(error);
    }

    println!("[translate] API key present (length: {})", settings.api_key.len());

    // Spawn the streaming task - this returns immediately
    let app_clone = app.clone();
    tauri::async_runtime::spawn(async move {
        println!("[translate] Spawned streaming task");
        if let Err(e) = stream_translation(app_clone.clone(), request, settings).await {
            println!("[translate] Streaming error: {}", e);
            let _ = app_clone.emit("translation_error", e);
        }
    });

    // Return immediately - results come via events
    Ok(())
}
