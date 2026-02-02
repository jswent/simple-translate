use serde::{Deserialize, Serialize};

pub const DEFAULT_SYSTEM_PROMPT: &str = r#"You are an expert translator. Your goal is to preserve the semantic meaning and contextual nuance of the source text rather than providing a word-for-word literal translation. Consider cultural context, idiomatic expressions, and the intended tone of the original text. Produce a natural, fluent translation that a native speaker would find authentic and easy to understand."#;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub api_key: String,
    pub model: String,
    pub provider: String,
    pub system_prompt: String,
    pub default_source_language: String,
    pub default_target_language: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model: "gpt-5-mini-2025-08-07".to_string(),
            provider: "openai".to_string(),
            system_prompt: DEFAULT_SYSTEM_PROMPT.to_string(),
            default_source_language: "en".to_string(),
            default_target_language: "es".to_string(),
        }
    }
}
