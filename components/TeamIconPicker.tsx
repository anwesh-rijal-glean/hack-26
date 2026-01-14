"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface TeamIconPickerProps {
  currentIcon: string;
  onSave: (newIcon: string) => void;
  disabled?: boolean;
}

const AVAILABLE_ICONS = [
  // Horses and racing
  "🐎", "🏇", "🦄", "🐴", "🎠",
  // Animals
  "🦁", "🐯", "🐻", "🐼", "🐨",
  "🦊", "🐺", "🦝", "🐱", "🐶",
  "🐹", "🐰", "🦔", "🐸", "🐵",
  // Birds
  "🦅", "🦉", "🦆", "🐧", "🦜",
  // Mythical & Fun
  "🐉", "🦖", "🦕", "👾", "🤖",
  "👽", "🎃", "💀", "🦇", "🕷️",
  // Objects
  "🚀", "⚡", "🔥", "💎", "⭐",
  "🎯", "🎮", "💻", "🎪", "🎨",
  // Food (fun)
  "🍕", "🍔", "🌮", "🍩", "🧁",
  "🍿", "🥑", "🌶️", "🥨", "🥯",
];

export function TeamIconPicker({
  currentIcon,
  onSave,
  disabled = false,
}: TeamIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  const handleSelect = (icon: string) => {
    setSelectedIcon(icon);
    onSave(icon);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="text-4xl hover:scale-110 transition-transform cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        title="Click to change icon"
      >
        {currentIcon}
      </button>

      {/* Icon Picker Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker Panel */}
          <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Choose Your Icon</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleSelect(icon)}
                  className={`text-2xl p-2 rounded-lg hover:bg-blue-100 transition-colors ${
                    selectedIcon === icon
                      ? "bg-blue-200 ring-2 ring-blue-500"
                      : "bg-gray-50"
                  }`}
                  title={icon}
                >
                  {icon}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Click any icon to select it
            </p>
          </div>
        </>
      )}
    </div>
  );
}
