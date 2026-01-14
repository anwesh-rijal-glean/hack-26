"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Racetrack } from "@/components/Racetrack";
import { getTasksCompleted } from "@/lib/utils";

export default function HomePage() {
  const initializeStore = useStore((state) => state.initializeStore);
  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);

  useEffect(() => {
    initializeStore();

    // Auto-refresh every 5 seconds to show live updates
    const interval = setInterval(() => {
      // Force re-render by touching the store (no-op but triggers subscribers)
      initializeStore();
    }, 5000);

    return () => clearInterval(interval);
  }, [initializeStore]);

  // Calculate stats
  const teamsCompleted = teams.filter((t) => getTasksCompleted(t.progress) === 10).length;
  const totalProgress = teams.reduce((sum, t) => sum + getTasksCompleted(t.progress), 0);
  const averageProgress = teams.length > 0 ? Math.round((totalProgress / (teams.length * 10)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Login Buttons */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏁 Glean SE Hackathon - 2026 - Live Results
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time competition dashboard · Updates every 5 seconds
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/team">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                  🏇 Team Login
                </button>
              </Link>
              <Link href="/judge">
                <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                  ⚖️ Judge Portal
                </button>
              </Link>
              <Link href="/admin">
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                  👑 Admin Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen Race Track */}
      <div className="container mx-auto px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Teams
            </p>
            <p className="text-3xl font-bold text-blue-600">{teams.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Teams Finished
            </p>
            <p className="text-3xl font-bold text-green-600">{teamsCompleted}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Average Progress
            </p>
            <p className="text-3xl font-bold text-orange-600">{averageProgress}%</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Milestones
            </p>
            <p className="text-3xl font-bold text-purple-600">{tasks.length}</p>
          </div>
        </div>

        {/* Race Track - Optimized for 1920x1080 */}
        <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200">
          <Racetrack teams={teams} tasks={tasks} />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Display Tip:</strong> Press F11 for fullscreen mode · Perfect for venue displays
          </p>
        </div>
      </div>
    </div>
  );
}

