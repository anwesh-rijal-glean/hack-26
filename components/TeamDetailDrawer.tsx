"use client";

import { Team, Task } from "@/lib/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { TaskChecklist } from "./TaskChecklist";
import { LinksManager } from "./LinksManager";
import { AuditLog } from "./AuditLog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Link as LinkType } from "@/lib/types";

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
  const [notes, setNotes] = useState(team.notes);

  const toggleTask = useStore((state) => state.toggleTask);
  const setNotesStore = useStore((state) => state.setNotes);
  const addLink = useStore((state) => state.addLink);
  const removeLink = useStore((state) => state.removeLink);
  const auditLog = useStore((state) => state.auditLog);

  useEffect(() => {
    setNotes(team.notes);
  }, [team.notes]);

  const teamAuditLog = auditLog.filter((event) => event.teamId === team.id);

  const handleToggleTask = (taskIndex: number) => {
    toggleTask(team.id, taskIndex, { type: "admin", id: "admin" });
  };

  const handleSaveNotes = () => {
    setNotesStore(team.id, notes, { type: "admin", id: "admin" });
  };

  const handleAddLink = (link: LinkType) => {
    addLink(team.id, link, { type: "admin", id: "admin" });
  };

  const handleRemoveLink = (linkId: string) => {
    removeLink(team.id, linkId, { type: "admin", id: "admin" });
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

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Team Notes
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </div>

          {/* Links */}
          <LinksManager
            links={team.links}
            onAdd={handleAddLink}
            onRemove={handleRemoveLink}
          />

          {/* Audit Log */}
          <AuditLog events={teamAuditLog} />
        </div>
      </div>
    </div>
  );
}

