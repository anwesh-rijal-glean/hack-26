"use client";

import { Team, Task } from "@/lib/types";
import { getTasksCompleted, getNextMilestone } from "@/lib/utils";
import { useMemo } from "react";

interface RacetrackProps {
  teams: Team[];
  tasks: Task[];
}

export function Racetrack({ teams, tasks }: RacetrackProps) {
  // Sort teams by progress (descending), then by updatedAt (ascending for earlier = better)
  const rankedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const aCompleted = getTasksCompleted(a.progress);
      const bCompleted = getTasksCompleted(b.progress);
      if (aCompleted !== bCompleted) {
        return bCompleted - aCompleted;
      }
      // Earlier updatedAt is better (reached this milestone first)
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }, [teams]);

  const nextMilestone = useMemo(() => {
    // Get the most common next milestone across all teams
    const nextTasks = teams.map((team) => {
      for (let i = 0; i < team.progress.length; i++) {
        if (!team.progress[i]) {
          return tasks[i]?.title || `Task ${i + 1}`;
        }
      }
      return "Finished!";
    });
    
    // Return most common or first one
    return nextTasks[0] || "All tasks completed! 🎉";
  }, [teams, tasks]);

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏁 Live Race Track
        </h2>
        <p className="text-sm text-gray-600">
          Next Milestone: <span className="font-semibold">{nextMilestone}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Track Lanes */}
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
          {rankedTeams.map((team, index) => {
            const completed = getTasksCompleted(team.progress);
            const position = completed; // 0 to 10
            const progressPercent = (position / 10) * 100;

            return (
              <div
                key={team.id}
                className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-2 border-gray-200 hover:border-blue-300 transition-colors"
              >
                {/* Lane background with checkpoints */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-[180px]">
                    <span className="text-2xl">{team.horseIcon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {team.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {completed}/10 tasks
                      </p>
                    </div>
                  </div>
                  
                  {/* Track with position markers */}
                  <div className="flex-1 relative h-12">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-200 rounded-full border-2 border-gray-300">
                      {/* Checkpoint markers */}
                      <div className="absolute inset-0 flex justify-between items-center px-1">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-8 rounded-full ${
                              i === 0
                                ? "bg-green-500"
                                : i === 10
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Horse position */}
                    <div
                      className="absolute top-0 bottom-0 flex items-center horse-transition"
                      style={{
                        left: `${progressPercent}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div
                        className="text-3xl filter drop-shadow-lg"
                        style={{
                          color: team.color,
                        }}
                      >
                        {team.horseIcon}
                      </div>
                    </div>
                  </div>

                  {/* Rank badge */}
                  <div
                    className={`min-w-[40px] h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-amber-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking Sidebar */}
        <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏆</span> Leaderboard
          </h3>
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {rankedTeams.slice(0, 10).map((team, index) => {
              const completed = getTasksCompleted(team.progress);
              return (
                <div
                  key={team.id}
                  className={`p-3 rounded-lg ${
                    index === 0
                      ? "bg-yellow-100 border-2 border-yellow-400"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-gray-600 min-w-[24px]">
                      {index + 1}.
                    </span>
                    <span className="text-xl">{team.horseIcon}</span>
                    <span className="font-semibold text-sm text-gray-900 flex-1 truncate">
                      {team.name}
                    </span>
                  </div>
                  <div className="ml-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-blue-600">
                        {completed}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(completed / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

