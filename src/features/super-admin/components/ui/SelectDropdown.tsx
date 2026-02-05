"use client";

import React, { useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  label,
  disabled,
  icon,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  return (
    <div ref={dropdownRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon size={16} className="text-gray-500" />}
            {icon && !SelectedIcon && icon}
            {selectedOption?.label || value}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                    value === option.value
                      ? "bg-teal-50 font-medium text-teal-700"
                      : "text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-500" />}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check size={16} className="text-teal-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
