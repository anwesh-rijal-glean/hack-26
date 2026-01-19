"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Racetrack } from "@/components/Racetrack";
import { getTasksCompleted } from "@/lib/utils";

export default function HomePage() {
  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch fresh data from database on mount and visibility changes
  // NO auto-refresh polling to avoid hammering the database
  useEffect(() => {
    let isActive = true;

    const performFetch = async () => {
      if (!isActive) return;
      
      try {
        await fetchAllData();
        if (isActive) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    // Fetch on mount
    performFetch();

    // Also fetch when tab becomes visible (user switches back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performFetch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log('🛑 Auto-refresh stopped');
    };
  }, [fetchAllData]);

  // Calculate stats
  const teamsCompleted = teams.filter((t) => getTasksCompleted(t.progress) === 10).length;
  const totalProgress = teams.reduce((sum, t) => sum + getTasksCompleted(t.progress), 0);
  const averageProgress = teams.length > 0 ? Math.round((totalProgress / (teams.length * 10)) * 100) : 0;

  // Show loading state while initializing
  if (!isInitialized && teams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading hackathon data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching teams from database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Login Buttons */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏁 Glean SE Hackathon 2026 - Live Results
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Live competition dashboard · Refresh page to see latest updates
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/team">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                  🏇 Team Login
                </button>
              </Link>
              <Link href="/judge">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                  ⚖️ Judge Portal
                </button>
              </Link>
              <Link href="/admin">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
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
            <Racetrack key={teamsKey} teams={teams} tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
