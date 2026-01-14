"use client";

import { Task } from "@/lib/types";
import { Button } from "./ui/button";
import { Lock, Unlock } from "lucide-react";

interface TaskLockControlsProps {
  tasks: Task[];
  onToggleLock: (taskId: number, locked: boolean) => void;
}

export function TaskLockControls({ tasks, onToggleLock }: TaskLockControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Task Lock Controls
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Lock tasks to prevent teams from editing them. Admin can always edit
        locked tasks.
      </p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <p className="font-medium text-gray-900">{task.title}</p>
              <p className="text-xs text-gray-500">Task #{task.id}</p>
            </div>
            <Button
              variant={task.locked ? "destructive" : "outline"}
              size="sm"
              onClick={() => onToggleLock(task.id, !task.locked)}
            >
              {task.locked ? (
                <>
                  <Lock size={14} className="mr-1" />
                  Locked
                </>
              ) : (
                <>
                  <Unlock size={14} className="mr-1" />
                  Unlocked
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

