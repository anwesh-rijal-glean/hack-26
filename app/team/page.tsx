"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { TeamLoginGate } from "@/components/TeamLoginGate";
import { TeamNameEditor } from "@/components/TeamNameEditor";
import { TeamIconPicker } from "@/components/TeamIconPicker";
import { TaskChecklist } from "@/components/TaskChecklist";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { getTasksCompleted } from "@/lib/utils";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  AuthenticatedUser,
  saveTeamAuth,
  getTeamAuth,
  clearTeamAuth,
} from "@/lib/auth";

function TeamViewContent() {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(null);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const isLoading = useStore((state) => state.isLoading);
  const toggleTask = useStore((state) => state.toggleTask);
  const setTeamNameStore = useStore((state) => state.setTeamName);
  const setTeamIconStore = useStore((state) => state.setTeamIcon);
  const fetchAllData = useStore((state) => state.fetchAllData);

  const { showToast } = useToast();

  // Always fetch fresh data on mount to ensure team names are current
  useEffect(() => {
    console.log('🔄 Team page mounted - fetching fresh data from database...');
    
    // Force fresh data fetch from database
    fetchAllData().catch((error) => {
      console.error('❌ Failed to fetch initial data:', error);
      showToast("⚠️ Failed to load data. Please refresh the page.", "error");
    });
    
    // Check for existing auth
    const existingAuth = getTeamAuth();
    if (existingAuth) {
      setAuthenticatedUser(existingAuth);
    }
  }, [fetchAllData, showToast]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Team page state:', {
      teams: teams.length,
      tasks: tasks.length,
      isLoading,
      tasksList: tasks.map(t => t.title),
      teamsData: teams.map(t => ({ id: t.id, name: t.name, icon: t.horseIcon })),
    });
  }, [teams, tasks, isLoading]);

  const selectedTeam = authenticatedUser
    ? teams.find((t) => t.id === authenticatedUser.teamId)
    : null;

  // Debug logging for selected team
  useEffect(() => {
    if (authenticatedUser && selectedTeam) {
      console.log('✅ Selected team loaded:', {
        teamId: selectedTeam.id,
        name: selectedTeam.name,
        icon: selectedTeam.horseIcon,
        lastUpdatedBy: selectedTeam.lastUpdatedBy,
        updatedAt: selectedTeam.updatedAt,
      });
    } else if (authenticatedUser && !selectedTeam) {
      console.warn('⚠️ Authenticated but no team found:', {
        authTeamId: authenticatedUser.teamId,
        availableTeams: teams.map(t => t.id),
      });
    }
  }, [authenticatedUser, selectedTeam, teams]);

  const handleAuthenticated = (user: AuthenticatedUser) => {
    setAuthenticatedUser(user);
    saveTeamAuth(user);
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    clearTeamAuth();
    showToast("Logged out successfully!", "info");
  };

  // Initialize confetti state when team is selected
  useEffect(() => {
    if (selectedTeam) {
      const completed = getTasksCompleted(selectedTeam.progress);
      setHasShownConfetti(completed === 10);
    }
  }, [selectedTeam]);

  // Show confetti when all tasks completed
  useEffect(() => {
    if (selectedTeam) {
      const completed = getTasksCompleted(selectedTeam.progress);
      if (completed === 10 && !hasShownConfetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast("🎉 Congratulations! All tasks completed!", "success");
        setHasShownConfetti(true);
      } else if (completed < 10) {
        setHasShownConfetti(false);
      }
    }
  }, [selectedTeam, hasShownConfetti, showToast]);

  const handleToggleTask = async (taskIndex: number) => {
    if (!authenticatedUser || !selectedTeam) return;
    
    try {
      await toggleTask(authenticatedUser.teamId, taskIndex, {
        type: "team",
        id: authenticatedUser.teamId,
      });
      showToast("Task updated!", "success");
    } catch (error) {
      console.error('Failed to toggle task:', error);
      showToast(
        "❌ Failed to update task. Please check if database is configured.",
        "error"
      );
    }
  };

  const handleSaveTeamName = async (newName: string) => {
    if (!authenticatedUser || !selectedTeam) return;
    
    try {
      await setTeamNameStore(authenticatedUser.teamId, newName, {
        type: "team",
        id: authenticatedUser.teamId,
      });
      showToast("Team name updated!", "success");
    } catch (error) {
      console.error('Failed to save team name:', error);
      showToast(
        "❌ Failed to save team name. Please check if database is configured.",
        "error"
      );
    }
  };

  const handleSaveTeamIcon = async (newIcon: string) => {
    if (!authenticatedUser || !selectedTeam) return;
    
    try {
      await setTeamIconStore(authenticatedUser.teamId, newIcon, {
        type: "team",
        id: authenticatedUser.teamId,
      });
      showToast("Team icon updated!", "success");
    } catch (error) {
      console.error('Failed to save team icon:', error);
      showToast(
        "❌ Failed to save team icon. Please check if database is configured.",
        "error"
      );
    }
  };

  if (!authenticatedUser) {
    return <TeamLoginGate onAuthenticated={handleAuthenticated} />;
  }

  // Calculate team's current rank
  const rankedTeams = [...teams].sort((a, b) => {
    const aCompleted = getTasksCompleted(a.progress);
    const bCompleted = getTasksCompleted(b.progress);
    if (aCompleted !== bCompleted) {
      return bCompleted - aCompleted;
    }
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });
  const currentRank = rankedTeams.findIndex((t) => t.id === selectedTeam?.id) + 1;
  const totalTeams = teams.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Live Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">
                  {authenticatedUser.username}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏇 Glean SE Hackathon 2026 - Team Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and share your work via Drive and Slack
          </p>
        </div>

        {selectedTeam ? (
          <>
            {/* Team Status Overview Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Team Identity & Progress */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <TeamIconPicker
                      currentIcon={selectedTeam.horseIcon}
                      onSave={handleSaveTeamIcon}
                    />
                    <TeamNameEditor
                      currentName={selectedTeam.name}
                      onSave={handleSaveTeamName}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Progress</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {getTasksCompleted(selectedTeam.progress)}/10
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (getTasksCompleted(selectedTeam.progress) / 10) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Rankings & Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Current Ranking
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-600">
                        {currentRank === 1 ? "🥇" : currentRank === 2 ? "🥈" : currentRank === 3 ? "🥉" : `#${currentRank}`}
                      </span>
                      <span className="text-lg text-gray-600">
                        out of {totalTeams} teams
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Last updated</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(selectedTeam.updatedAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {selectedTeam.lastUpdatedBy || "—"}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Tip:</strong> Visit the{" "}
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="underline font-semibold hover:text-blue-900 cursor-pointer"
                      >
                        Live Dashboard
                      </button>{" "}
                      to see all teams racing!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Tasks Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">

              {/* Task Checklist */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Milestones Checklist
                </h3>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading tasks...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No tasks found</p>
                    <p className="text-sm text-gray-400">
                      Check console for debug info
                    </p>
                  </div>
                ) : (
                  <TaskChecklist
                    tasks={tasks}
                    progress={selectedTeam.progress}
                    onToggle={handleToggleTask}
                  />
                )}
              </div>

              {/* Submission Instructions */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📤 Submit Your Work
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      📁 Upload Files to Shared Folder
                    </p>
                    <a
                      href="https://drive.google.com/drive/folders/1NUEZn-Psh5vtgJSdgXtPr6IIabaTlF6i"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm break-all font-medium"
                    >
                      https://drive.google.com/drive/folders/1NUEZn-Psh5vtgJSdgXtPr6IIabaTlF6i
                    </a>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      💬 Share Updates on Slack
                    </p>
                    <p className="text-blue-600 font-mono text-sm font-medium">
                      #gko-fy2027-se-hackathon
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
                    <p className="text-xs text-yellow-800">
                      <strong>💡 Reminder:</strong> Please upload all project files, demos, and documentation to the shared Drive folder and post your status updates to the Slack channel to keep everyone in the loop!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-gray-200">
            <p className="text-xl text-gray-500">
              Unable to load team data. Please try logging out and back in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamViewPage() {
  return (
    <ToastProvider>
      <TeamViewContent />
    </ToastProvider>
  );
}

