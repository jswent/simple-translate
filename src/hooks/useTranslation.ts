import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { TranslationRequest, TranslationResponse, Settings } from "../types";

export function useTranslation() {
  const [translating, setTranslating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unlistenToken: UnlistenFn | null = null;
    let unlistenComplete: UnlistenFn | null = null;
    let unlistenError: UnlistenFn | null = null;

    const setupListeners = async () => {
      // Listen for streaming tokens
      unlistenToken = await listen<string>("translation_token", (event) => {
        setStreamingText((prev) => prev + event.payload);
      });

      // Listen for completion
      unlistenComplete = await listen<TranslationResponse>(
        "translation_complete",
        (event) => {
          console.log("[useTranslation] Complete:", event.payload);
          setTranslating(false);
        }
      );

      // Listen for errors
      unlistenError = await listen<string>("translation_error", (event) => {
        console.error("[useTranslation] Error:", event.payload);
        setError(event.payload);
        setTranslating(false);
      });
    };

    setupListeners();

    return () => {
      unlistenToken?.();
      unlistenComplete?.();
      unlistenError?.();
    };
  }, []);

  const translate = useCallback(
    async (request: TranslationRequest, settings: Settings): Promise<void> => {
      try {
        setTranslating(true);
        setStreamingText("");
        setError(null);

        // This returns immediately, results come via events
        await invoke("translate", { request, settings });
      } catch (e) {
        const errorMessage = String(e);
        setError(errorMessage);
        setTranslating(false);
      }
    },
    []
  );

  return {
    translate,
    translating,
    streamingText,
    error,
    clearError: () => setError(null),
    clearText: () => setStreamingText(""),
  };
}
