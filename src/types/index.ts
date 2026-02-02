export interface Settings {
  api_key: string;
  model: string;
  provider: string;
  system_prompt: string;
  default_source_language: string;
  default_target_language: string;
}

export interface TranslationRequest {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslationResponse {
  translated_text: string;
  source_language: string;
  target_language: string;
}

export interface Language {
  code: string;
  name: string;
}
