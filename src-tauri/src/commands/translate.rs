use crate::models::{Settings, TranslationRequest};
use crate::providers::stream_translation;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub async fn translate(
    app: AppHandle,
    request: TranslationRequest,
    settings: Settings,
) -> Result<(), String> {
    if settings.api_key.is_empty() {
        let error = "API key not configured. Please set your API key in Settings.".to_string();
        let _ = app.emit("translation_error", &error);
        return Err(error);
    }

    // Spawn the streaming task - returns immediately, results via events
    let app_clone = app.clone();
    tauri::async_runtime::spawn(async move {
        if let Err(e) = stream_translation(app_clone.clone(), request, settings).await {
            let _ = app_clone.emit("translation_error", e);
        }
    });

    Ok(())
}
