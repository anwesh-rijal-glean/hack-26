"use client";

import { Task } from "@/lib/types";
import { Checkbox } from "./ui/checkbox";
import { formatTimestamp } from "@/lib/utils";
import { Lock } from "lucide-react";

interface TaskChecklistProps {
  tasks: Task[];
  progress: boolean[];
  onToggle: (taskIndex: number) => void;
  disabled?: boolean;
}

export function TaskChecklist({
  tasks,
  progress,
  onToggle,
  disabled = false,
}: TaskChecklistProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const isCompleted = progress[index];
        const isLocked = task.locked;
        const isDisabled = disabled || isLocked;

        return (
          <div
            key={task.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              isCompleted
                ? "bg-green-50 border-green-300"
                : "bg-white border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isCompleted}
                onChange={() => !isDisabled && onToggle(index)}
                disabled={isDisabled}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold ${
                      isCompleted
                        ? "text-green-700 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h4>
                  {isLocked && (
                    <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      <Lock size={12} />
                      <span>Locked</span>
                    </div>
                  )}
                  {isCompleted && (
                    <span className="text-green-600 text-xl">✓</span>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(task.dueDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

