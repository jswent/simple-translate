import { useEffect } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "../hooks/useTranslation";
import { useTranslationContext } from "../context/TranslationContext";
import type { Settings } from "../types";

interface TranslationPageProps {
  settings: Settings;
}

export function TranslationPage({ settings }: TranslationPageProps) {
  const {
    sourceText,
    setSourceText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    translatedText,
    setTranslatedText,
  } = useTranslationContext();
  const { translate, translating, streamingText, error, clearText } = useTranslation();

  // Sync streaming text to context when it changes
  useEffect(() => {
    if (streamingText) {
      setTranslatedText(streamingText);
    }
  }, [streamingText, setTranslatedText]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    clearText();
    setTranslatedText("");
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
    const prevTarget = targetLanguage;
    const prevSource = sourceLanguage;
    const prevTranslated = translatedText;
    setSourceLanguage(prevTarget);
    setTargetLanguage(prevSource);
    setSourceText(prevTranslated);
    setTranslatedText("");
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
        <div className="flex-1 flex justify-end">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="From"
          />
        </div>
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
        <div className="flex-1 flex justify-start">
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="To"
          />
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex-1 flex flex-col">
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="flex-1 p-3 rounded-md bg-white text-sm text-zinc-800 ring-1 ring-inset ring-zinc-300
                       placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600 dark:placeholder:text-zinc-500"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <textarea
            value={translating ? streamingText : translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="flex-1 p-3 rounded-md bg-zinc-50 text-sm text-zinc-800 ring-1 ring-inset ring-zinc-300
                       placeholder:text-zinc-400 resize-none focus:outline-none
                       dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-600 dark:placeholder:text-zinc-500"
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
