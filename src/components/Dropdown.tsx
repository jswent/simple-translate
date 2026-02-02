import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function Dropdown({ value, options, onChange, label, className = "" }: DropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {label}
        </label>
      )}
      <Menu as="div" className="relative inline-block w-full">
        <MenuButton className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600 dark:hover:bg-zinc-700">
          {selectedOption?.label || "Select..."}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-zinc-400" />
        </MenuButton>

        <MenuItems
          transition
          className="absolute left-0 z-10 mt-1 max-h-60 min-w-full w-max overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-800 dark:ring-zinc-600"
        >
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option.value}>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`block w-full px-4 py-2 text-left text-sm whitespace-nowrap data-[focus]:bg-zinc-100 data-[focus]:outline-none dark:data-[focus]:bg-zinc-700 ${
                    option.value === value
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {option.label}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}
