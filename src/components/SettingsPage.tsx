import { useState, useEffect } from "react";
import type { Settings } from "../types";
import { LANGUAGES, AVAILABLE_MODELS, DEFAULT_SYSTEM_PROMPT } from "../constants";
import { Dropdown } from "./Dropdown";

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

  // Check if API key or system prompt has unsaved changes
  const hasUnsavedChanges =
    localSettings.api_key !== settings.api_key ||
    localSettings.system_prompt !== settings.system_prompt;

  // Auto-save dropdown changes
  const handleDropdownChange = async (newSettings: Settings) => {
    setLocalSettings(newSettings);
    try {
      await onSave(newSettings);
    } catch (e) {
      setMessage({ type: "error", text: String(e) });
    }
  };

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
            className="px-3 py-2 rounded-md bg-white text-sm text-zinc-800 ring-1 ring-inset ring-zinc-300
                       placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Model Selection */}
        <Dropdown
          label="Model"
          value={localSettings.model}
          options={AVAILABLE_MODELS.map((m) => ({ value: m.id, label: m.name }))}
          onChange={(value) => handleDropdownChange({ ...localSettings, model: value })}
        />

        {/* Default Languages */}
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Default Source Language"
            value={localSettings.default_source_language}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
            onChange={(value) =>
              handleDropdownChange({ ...localSettings, default_source_language: value })
            }
          />
          <Dropdown
            label="Default Target Language"
            value={localSettings.default_target_language}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
            onChange={(value) =>
              handleDropdownChange({ ...localSettings, default_target_language: value })
            }
          />
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
            className="px-3 py-2 rounded-md bg-white text-sm text-zinc-800 ring-1 ring-inset ring-zinc-300
                       resize-none focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600"
          />
        </div>
      </div>

      {hasUnsavedChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors self-start mt-4"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      )}
    </div>
  );
}
