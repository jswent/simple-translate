import { useState, useEffect } from "react";
import type { Settings } from "../types";
import { LANGUAGES, AVAILABLE_MODELS, DEFAULT_SYSTEM_PROMPT } from "../constants";

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => Promise<void>;
}

export function SettingsPage({ settings, onSave }: SettingsPageProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(localSettings);
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage({ type: "error", text: String(e) });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPrompt = () => {
    setLocalSettings({ ...localSettings, system_prompt: DEFAULT_SYSTEM_PROMPT });
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Settings</h2>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* API Key */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={localSettings.api_key}
            onChange={(e) => setLocalSettings({ ...localSettings, api_key: e.target.value })}
            placeholder="sk-..."
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600
                       bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Model Selection */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Model</label>
          <select
            value={localSettings.model}
            onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600
                       bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Default Languages */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Default Source Language
            </label>
            <select
              value={localSettings.default_source_language}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, default_source_language: e.target.value })
              }
              className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600
                         bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Default Target Language
            </label>
            <select
              value={localSettings.default_target_language}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, default_target_language: e.target.value })
              }
              className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600
                         bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* System Prompt */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              System Prompt
            </label>
            <button
              onClick={handleResetPrompt}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset to default
            </button>
          </div>
          <textarea
            value={localSettings.system_prompt}
            onChange={(e) => setLocalSettings({ ...localSettings, system_prompt: e.target.value })}
            rows={5}
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-600
                       bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200
                       resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors self-start mt-4"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
