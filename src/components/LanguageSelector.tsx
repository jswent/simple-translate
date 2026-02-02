import { LANGUAGES } from "../constants";
import { Dropdown } from "./Dropdown";

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

export function LanguageSelector({ value, onChange, label }: LanguageSelectorProps) {
  const options = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <Dropdown value={value} options={options} onChange={onChange} />
    </div>
  );
}
