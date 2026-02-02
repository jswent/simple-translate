import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { TranslationRequest, TranslationResponse, Settings } from "../types";

export function useTranslation() {
  const [translating, setTranslating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const listenersRef = useRef<UnlistenFn[]>([]);

  useEffect(() => {
    let mounted = true;

    const setupListeners = async () => {
      const unlistenToken = await listen<string>("translation_token", (event) => {
        if (mounted) {
          setStreamingText((prev) => prev + event.payload);
        }
      });

      const unlistenComplete = await listen<TranslationResponse>(
        "translation_complete",
        (event) => {
          if (mounted) {
            setTranslating(false);
          }
        }
      );

      const unlistenError = await listen<string>("translation_error", (event) => {
        if (mounted) {
          setError(event.payload);
          setTranslating(false);
        }
      });

      if (mounted) {
        listenersRef.current = [unlistenToken, unlistenComplete, unlistenError];
      } else {
        // Component unmounted before setup completed, cleanup immediately
        unlistenToken();
        unlistenComplete();
        unlistenError();
      }
    };

    setupListeners();

    return () => {
      mounted = false;
      listenersRef.current.forEach((unlisten) => unlisten());
      listenersRef.current = [];
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
