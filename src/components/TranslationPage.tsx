import { useState, useEffect } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "../hooks/useTranslation";
import type { Settings } from "../types";

interface TranslationPageProps {
  settings: Settings;
}

export function TranslationPage({ settings }: TranslationPageProps) {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState(settings.default_source_language);
  const [targetLanguage, setTargetLanguage] = useState(settings.default_target_language);
  const { translate, translating, streamingText, error, clearText } = useTranslation();

  useEffect(() => {
    setSourceLanguage(settings.default_source_language);
    setTargetLanguage(settings.default_target_language);
  }, [settings.default_source_language, settings.default_target_language]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    clearText(); // Clear previous translation
    await translate(
      {
        text: sourceText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      },
      settings
    );
  };

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(streamingText);
    clearText();
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {error && (
        <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <LanguageSelector
          value={sourceLanguage}
          onChange={setSourceLanguage}
          label="From"
        />
        <button
          onClick={handleSwap}
          className="mt-5 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800
                     text-zinc-600 dark:text-zinc-400 transition-colors"
          title="Swap languages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </button>
        <LanguageSelector
          value={targetLanguage}
          onChange={setTargetLanguage}
          label="To"
        />
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex-1 flex flex-col">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="flex-1 p-3 rounded-md border border-zinc-300 dark:border-zinc-600
                       bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                       resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <textarea
            value={streamingText}
            readOnly
            placeholder="Translation will appear here..."
            className="flex-1 p-3 rounded-md border border-zinc-300 dark:border-zinc-600
                       bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200
                       resize-none focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={translating || !sourceText.trim()}
        className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors self-center"
      >
        {translating ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}
