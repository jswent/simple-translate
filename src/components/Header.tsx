interface HeaderProps {
  currentPage: "translate" | "settings";
  onNavigate: (page: "translate" | "settings") => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        Simple Translate
      </h1>
      <nav className="flex gap-2">
        <button
          onClick={() => onNavigate("translate")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentPage === "translate"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Translate
        </button>
        <button
          onClick={() => onNavigate("settings")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentPage === "settings"
              ? "bg-blue-600 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Settings
        </button>
      </nav>
    </header>
  );
}
