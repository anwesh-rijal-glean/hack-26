"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit2, Check, X } from "lucide-react";

interface TeamNameEditorProps {
  currentName: string;
  onSave: (newName: string) => void;
  disabled?: boolean;
}

export function TeamNameEditor({
  currentName,
  onSave,
  disabled = false,
}: TeamNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName);

  const handleSave = () => {
    if (name.trim() && name.trim() !== currentName) {
      onSave(name.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentName);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">{currentName}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className="text-gray-500 hover:text-blue-600"
        >
          <Edit2 size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-xl font-bold max-w-xs"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
        disabled={disabled}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={disabled || !name.trim()}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        disabled={disabled}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X size={18} />
      </Button>
    </div>
  );
}
