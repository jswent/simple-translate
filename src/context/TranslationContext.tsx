import { createContext, useContext, useState, ReactNode } from "react";

interface TranslationState {
  sourceText: string;
  setSourceText: (text: string) => void;
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  translatedText: string;
  setTranslatedText: (text: string) => void;
}

const TranslationContext = createContext<TranslationState | null>(null);

interface TranslationProviderProps {
  children: ReactNode;
  defaultSourceLanguage: string;
  defaultTargetLanguage: string;
}

export function TranslationProvider({
  children,
  defaultSourceLanguage,
  defaultTargetLanguage,
}: TranslationProviderProps) {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage);
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage);
  const [translatedText, setTranslatedText] = useState("");

  return (
    <TranslationContext.Provider
      value={{
        sourceText,
        setSourceText,
        sourceLanguage,
        setSourceLanguage,
        targetLanguage,
        setTargetLanguage,
        translatedText,
        setTranslatedText,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  return context;
}
