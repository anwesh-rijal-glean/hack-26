"use client";

import { Team, Task } from "@/lib/types";
import { Button } from "./ui/button";
import { TaskChecklist } from "./TaskChecklist";
import { AuditLog } from "./AuditLog";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

interface TeamDetailDrawerProps {
  team: Team;
  tasks: Task[];
  onClose: () => void;
}

export function TeamDetailDrawer({
  team,
  tasks,
  onClose,
}: TeamDetailDrawerProps) {
  const toggleTask = useStore((state) => state.toggleTask);
  const auditLog = useStore((state) => state.auditLog);

  const teamAuditLog = auditLog.filter((event) => event.teamId === team.id);

  const handleToggleTask = (taskIndex: number) => {
    toggleTask(team.id, taskIndex, { type: "admin", id: "admin" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{team.horseIcon}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
              <p className="text-sm text-gray-600">Team ID: {team.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Task Checklist */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Task Progress (Admin Override)
            </h3>
            <TaskChecklist
              tasks={tasks}
              progress={team.progress}
              onToggle={handleToggleTask}
              disabled={false}
            />
          </div>

          {/* Audit Log */}
          <AuditLog events={teamAuditLog} />
        </div>
      </div>
    </div>
  );
}

