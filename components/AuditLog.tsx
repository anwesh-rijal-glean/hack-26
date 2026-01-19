"use client";

import { AuditEvent } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

interface AuditLogProps {
  events: AuditEvent[];
}

const actionLabels: Record<AuditEvent["action"], string> = {
  TOGGLE_TASK: "Task toggled",
  ADMIN_OVERRIDE: "Admin override",
  RESET_TEAM: "Team reset",
  LOCK_TASK: "Task locked",
  UNLOCK_TASK: "Task unlocked",
  UNDO: "Action undone",
};

const actionColors: Record<AuditEvent["action"], string> = {
  TOGGLE_TASK: "bg-blue-100 text-blue-800",
  ADMIN_OVERRIDE: "bg-red-100 text-red-800",
  RESET_TEAM: "bg-red-200 text-red-900",
  LOCK_TASK: "bg-yellow-100 text-yellow-800",
  UNLOCK_TASK: "bg-green-100 text-green-800",
  UNDO: "bg-gray-100 text-gray-800",
};

export function AuditLog({ events }: AuditLogProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Audit History
      </h3>
      {events.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No activity yet</p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        actionColors[event.action]
                      }`}
                    >
                      {actionLabels[event.action]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(event.ts)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">
                      {event.actor.type === "admin" ? "Admin" : "Team"}
                    </span>
                    {event.payload && (
                      <span className="text-gray-600">
                        {event.action === "TOGGLE_TASK" &&
                          ` - Task #${event.payload.taskIndex + 1}: ${
                            event.payload.to ? "completed" : "uncompleted"
                          }`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

