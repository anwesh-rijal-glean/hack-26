"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Racetrack } from "@/components/Racetrack";
import { getTasksCompleted } from "@/lib/utils";

export default function HomePage() {
  const fetchAllData = useStore((state) => state.fetchAllData);
  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const lastFetchRef = useRef<number>(0);
  
  // Force re-render when teams data changes by creating a unique key
  const teamsKey = teams.map(t => `${t.id}-${t.progress.filter(Boolean).length}-${t.updatedAt}`).join('|');
  
  // Debug logging for component re-renders
  useEffect(() => {
    console.log('🎨 HomePage re-rendered with teams:', {
      count: teams.length,
      teamsKey: teamsKey.substring(0, 100) + '...',
      sampleTeam: teams[0] ? {
        name: teams[0].name,
        completed: teams[0].progress.filter(Boolean).length,
        updatedAt: teams[0].updatedAt
      } : null
    });
  }, [teams, teamsKey]);

  // Auto-refresh every 30 seconds for live dashboard
  useEffect(() => {
    // Fetch immediately on mount
    const now = Date.now();
    console.log('🔄 Home page mounted - fetching fresh data from database...');
    
    fetchAllData().catch((error) => {
      console.error('❌ Failed to fetch initial data:', error);
    });
    lastFetchRef.current = now;

    // Set up auto-refresh interval (30 seconds for live dashboard)
    const REFRESH_INTERVAL = 30000; // 30 seconds
    console.log('⏱️ Auto-refresh enabled: updates every 30 seconds');
    
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Auto-refresh - fetching latest data...', { 
          currentTeamsCount: teams.length,
          timestamp: new Date().toISOString() 
        });
        fetchAllData()
          .then(() => {
            console.log('✅ Auto-refresh complete - data fetched from database');
          })
          .catch((error) => {
            console.error('❌ Auto-refresh failed:', error);
          });
        lastFetchRef.current = Date.now();
      }
    }, REFRESH_INTERVAL);

    // Also refresh when window gains focus (handles tab switching and navigation)
    const handleFocus = () => {
      const timeSinceLastFetch = Date.now() - lastFetchRef.current;
      // Only fetch if it's been more than 1 second since last fetch (avoid duplicate fetches)
      if (timeSinceLastFetch > 1000) {
        console.log('🔄 Window focused - refreshing data...');
        fetchAllData().catch((error) => {
          console.error('❌ Failed to refresh data:', error);
        });
        lastFetchRef.current = Date.now();
      }
    };

    // Refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastFetch = Date.now() - lastFetchRef.current;
        if (timeSinceLastFetch > 1000) {
          console.log('🔄 Page became visible - refreshing data...');
          fetchAllData().catch((error) => {
            console.error('❌ Failed to refresh data:', error);
          });
          lastFetchRef.current = Date.now();
        }
      }
    };

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log('🛑 Auto-refresh stopped');
    };
  }, [fetchAllData]);

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
                🏁 Glean SE Hackathon 2026 - Live Results
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time competition dashboard • Press{" "}
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                  Shift + F5
                </kbd>{" "}
                to refresh data
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
    );
  }

