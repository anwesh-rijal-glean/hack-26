"use client";

import { Team, Task } from "@/lib/types";
import { getTasksCompleted } from "@/lib/utils";

interface RacetrackProps {
  teams: Team[];
  tasks: Task[];
}

export function Racetrack({ teams, tasks }: RacetrackProps) {
  // Sort teams by progress (descending), then by updatedAt (ascending for earlier = better)
  // Removed useMemo to ensure fresh sorting on every render
  console.log('🏁 Racetrack: Computing ranked teams with', teams.length, 'teams');
  console.log('🏁 Sample team progress:', teams.slice(0, 3).map(t => ({
    name: t.name,
    completed: getTasksCompleted(t.progress),
    updatedAt: t.updatedAt
  })));
  
  const rankedTeams = [...teams].sort((a, b) => {
    const aCompleted = getTasksCompleted(a.progress);
    const bCompleted = getTasksCompleted(b.progress);
    if (aCompleted !== bCompleted) {
      return bCompleted - aCompleted;
    }
    // Earlier updatedAt is better (reached this milestone first)
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });

  return (
    <div className="bg-gradient-to-b from-green-800 via-green-700 to-green-800 rounded-xl shadow-xl p-6 border-4 border-green-900">
      <div className="mb-6 bg-white/95 backdrop-blur-sm rounded-lg p-4 border-2 border-gray-300 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">
          🏁 Live Race Track
        </h2>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Track Lanes */}
        <div className="space-y-3 overflow-y-auto max-h-[720px] pr-2">
          {rankedTeams.map((team, index) => {
            const completed = getTasksCompleted(team.progress);
            const position = completed; // 0 to 10
            const progressPercent = (position / 10) * 100;

            return (
              <div
                key={team.id}
                className="relative rounded-lg p-4 bg-gradient-to-r from-green-700 via-green-600 to-green-700 border-2 border-green-800"
              >
                {/* Lane background with checkpoints */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-[200px] bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-3xl">{team.horseIcon}</span>
                    <div>
                      <p className="font-semibold text-base text-gray-900">
                        {team.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {completed}/10 tasks
                      </p>
                    </div>
                  </div>
                  
                  {/* Track with position markers */}
                  <div className="flex-1 relative h-14">
                    {/* Natural clay track surface */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-700 via-orange-800 to-amber-800 rounded-lg border-2 border-amber-900 shadow-inner">
                      {/* Clay texture overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(222,165,116,0.3),transparent_50%)] opacity-40"></div>
                      
                      {/* White lane separator line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-white opacity-40 -translate-y-1/2"></div>
                      
                      {/* Top and bottom track edges */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900 to-transparent opacity-60"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900 to-transparent opacity-60"></div>
                      
                      {/* Checkpoint markers */}
                      <div className="absolute inset-0 flex justify-between items-center px-1">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-12 rounded ${
                              i === 0
                                ? "bg-green-500 border-2 border-white shadow-lg"
                                : i === 10
                                ? "bg-red-500 border-2 border-white shadow-lg animate-pulse"
                                : "bg-yellow-400 border border-yellow-600"
                            }`}
                            title={i === 0 ? "START" : i === 10 ? "FINISH" : `Milestone ${i}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Horse position */}
                    <div
                      className="absolute top-0 bottom-0 flex items-center horse-transition z-10"
                      style={{
                        left: `${progressPercent}%`,
                        transform: "translateX(-50%) scaleX(-1)",
                      }}
                    >
                      <div
                        className="text-5xl filter drop-shadow-[0_4px_8px_rgba(255,255,255,0.8)]"
                      >
                        {team.horseIcon}
                      </div>
                    </div>
                  </div>

                  {/* Rank badge */}
                  <div
                    className={`min-w-[48px] h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
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
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 border-2 border-gray-300 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 border-b-2 border-yellow-400 pb-2">
            <span>🏆</span> Leaderboard
          </h3>
          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {rankedTeams.map((team, index) => {
              const completed = getTasksCompleted(team.progress);
              return (
                <div
                  key={team.id}
                  className={`p-4 rounded-lg ${
                    index === 0
                      ? "bg-yellow-100 border-2 border-yellow-400"
                      : index === 1
                      ? "bg-gray-100 border-2 border-gray-400"
                      : index === 2
                      ? "bg-amber-100 border-2 border-amber-400"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-gray-600 min-w-[28px]">
                      {index + 1}.
                    </span>
                    <span className="text-2xl">{team.horseIcon}</span>
                    <span className="font-semibold text-sm text-gray-900 flex-1 truncate">
                      {team.name}
                    </span>
                  </div>
                  <div className="ml-10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-blue-600">
                        {completed}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
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

