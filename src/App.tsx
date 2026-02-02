import { useState } from "react";
import { Header } from "./components/Header";
import { TranslationPage } from "./components/TranslationPage";
import { SettingsPage } from "./components/SettingsPage";
import { useSettings } from "./hooks/useSettings";
import "./App.css";

type Page = "translate" | "settings";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("translate");
  const { settings, loading, saveSettings } = useSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-hidden">
        {currentPage === "translate" ? (
          <TranslationPage settings={settings} />
        ) : (
          <SettingsPage settings={settings} onSave={saveSettings} />
        )}
      </main>
    </div>
  );
}

export default App;
