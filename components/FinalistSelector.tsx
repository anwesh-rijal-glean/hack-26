"use client";

import { Team } from "@/lib/types";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface FinalistSelectorProps {
  teams: Team[];
  finalistTeamIds: string[];
  onToggleFinalist: (teamId: string) => void;
}

export function FinalistSelector({
  teams,
  finalistTeamIds,
  onToggleFinalist,
}: FinalistSelectorProps) {
  const finalistCount = finalistTeamIds.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🏆 Select Finalist Teams
        </h3>
        <p className="text-gray-600">
          Choose which teams will advance to the judging round. Currently{" "}
          <span className="font-semibold text-orange-600">{finalistCount}</span>{" "}
          {finalistCount === 1 ? "team" : "teams"} selected.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {teams.map((team) => {
          const isFinalist = finalistTeamIds.includes(team.id);

          return (
            <button
              key={team.id}
              onClick={() => onToggleFinalist(team.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                isFinalist
                  ? "bg-gradient-to-br from-orange-100 to-yellow-100 border-orange-400 shadow-lg"
                  : "bg-gray-50 border-gray-300 hover:border-orange-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{team.horseIcon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {team.name}
                    </h4>
                    <p className="text-xs text-gray-600">{team.id}</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isFinalist
                      ? "bg-orange-500 border-orange-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isFinalist && <Check size={14} className="text-white" />}
                </div>
              </div>
              {isFinalist && (
                <div className="mt-2 pt-2 border-t border-orange-300">
                  <span className="text-xs font-semibold text-orange-700">
                    ✓ Finalist
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {finalistCount === 0 && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800">
            ⚠️ No finalists selected. Judges won&apos;t have any teams to score.
          </p>
        </div>
      )}
    </div>
  );
}
