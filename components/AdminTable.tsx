"use client";

import { Team } from "@/lib/types";
import { Button } from "./ui/button";
import { getTasksCompleted, formatTimestamp } from "@/lib/utils";
import { Eye, RotateCcw, Trash2 } from "lucide-react";

interface AdminTableProps {
  teams: Team[];
  onViewDetails: (teamId: string) => void;
  onUndo: (teamId: string) => void;
  onReset: (teamId: string) => void;
}

export function AdminTable({
  teams,
  onViewDetails,
  onUndo,
  onReset,
}: AdminTableProps) {
  // Sort teams by completed count (desc)
  const sortedTeams = [...teams].sort((a, b) => {
    const aCompleted = getTasksCompleted(a.progress);
    const bCompleted = getTasksCompleted(b.progress);
    return bCompleted - aCompleted;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Updated By
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTeams.map((team, index) => {
              const completed = getTasksCompleted(team.progress);
              return (
                <tr
                  key={team.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-700">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{team.horseIcon}</span>
                      <span className="font-medium text-gray-900">
                        {team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">
                        {completed}/10
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(completed / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {formatTimestamp(team.updatedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {team.lastUpdatedBy || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(team.id)}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUndo(team.id)}
                      >
                        <RotateCcw size={14} className="mr-1" />
                        Undo
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              `Reset ${team.name}? This will clear all progress, notes, and links.`
                            )
                          ) {
                            onReset(team.id);
                          }
                        }}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Reset
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

