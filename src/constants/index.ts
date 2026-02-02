import type { Language, Settings } from "../types";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
];

export const DEFAULT_SYSTEM_PROMPT = `You are an expert translator. Your goal is to preserve the semantic meaning and contextual nuance of the source text rather than providing a word-for-word literal translation. Consider cultural context, idiomatic expressions, and the intended tone of the original text. Produce a natural, fluent translation that a native speaker would find authentic and easy to understand.`;

export const DEFAULT_SETTINGS: Settings = {
  api_key: "",
  model: "gpt-4.1-mini",
  provider: "openai",
  system_prompt: DEFAULT_SYSTEM_PROMPT,
  default_source_language: "en",
  default_target_language: "es",
};

export const AVAILABLE_MODELS = [
  { id: "gpt-5.2", name: "GPT-5.2" },
  { id: "gpt-4.1", name: "GPT-4.1" },
  { id: "gpt-4.1-mini", name: "GPT-4.1 Mini" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini" },
];
