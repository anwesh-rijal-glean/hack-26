"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Edit2, Check, X } from "lucide-react";

interface TaskEditorProps {
  task: Task;
  onSave: (taskId: number, updates: Partial<Task>) => void;
}

export function TaskEditor({ task, onSave }: TaskEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
  );

  const handleSave = () => {
    if (title.trim()) {
      onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
    );
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              Task {task.id}: {task.title}
            </span>
            {task.locked && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                🔒 Locked
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mb-1">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleString()}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-blue-600"
        >
          <Edit2 size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className="w-full"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (Optional)
          </label>
          <Input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-gray-600"
          >
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check size={16} className="mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
