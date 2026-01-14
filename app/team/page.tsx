"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { TeamLoginGate } from "@/components/TeamLoginGate";
import { TeamNameEditor } from "@/components/TeamNameEditor";
import { TeamIconPicker } from "@/components/TeamIconPicker";
import { TaskChecklist } from "@/components/TaskChecklist";
import { LinksManager } from "@/components/LinksManager";
import { Racetrack } from "@/components/Racetrack";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Link as LinkType } from "@/lib/types";
import { getTasksCompleted } from "@/lib/utils";
import { ArrowLeft, Save, LogOut } from "lucide-react";
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
  const [notes, setNotes] = useState("");
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const toggleTask = useStore((state) => state.toggleTask);
  const setNotesStore = useStore((state) => state.setNotes);
  const setTeamNameStore = useStore((state) => state.setTeamName);
  const setTeamIconStore = useStore((state) => state.setTeamIcon);
  const addLink = useStore((state) => state.addLink);
  const removeLink = useStore((state) => state.removeLink);
  const initializeStore = useStore((state) => state.initializeStore);

  const { showToast } = useToast();

  useEffect(() => {
    initializeStore();
    // Check for existing auth
    const existingAuth = getTeamAuth();
    if (existingAuth) {
      setAuthenticatedUser(existingAuth);
    }
  }, [initializeStore]);

  const selectedTeam = authenticatedUser
    ? teams.find((t) => t.id === authenticatedUser.teamId)
    : null;

  const handleAuthenticated = (user: AuthenticatedUser) => {
    setAuthenticatedUser(user);
    saveTeamAuth(user);
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    clearTeamAuth();
    showToast("Logged out successfully!", "info");
  };

  // Load notes when team is selected
  useEffect(() => {
    if (selectedTeam) {
      setNotes(selectedTeam.notes);
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

  const handleToggleTask = (taskIndex: number) => {
    if (!authenticatedUser || !selectedTeam) return;
    toggleTask(authenticatedUser.teamId, taskIndex, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Task updated!", "success");
  };

  const handleSaveNotes = () => {
    if (!authenticatedUser || !selectedTeam) return;
    setNotesStore(authenticatedUser.teamId, notes, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Notes saved!", "success");
  };

  const handleSaveTeamName = (newName: string) => {
    if (!authenticatedUser || !selectedTeam) return;
    setTeamNameStore(authenticatedUser.teamId, newName, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Team name updated!", "success");
  };

  const handleSaveTeamIcon = (newIcon: string) => {
    if (!authenticatedUser || !selectedTeam) return;
    setTeamIconStore(authenticatedUser.teamId, newIcon, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Team icon updated!", "success");
  };

  const handleAddLink = (link: LinkType) => {
    if (!authenticatedUser || !selectedTeam) return;
    addLink(authenticatedUser.teamId, link, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Link added!", "success");
  };

  const handleRemoveLink = (linkId: string) => {
    if (!authenticatedUser || !selectedTeam) return;
    removeLink(authenticatedUser.teamId, linkId, {
      type: "team",
      id: authenticatedUser.teamId,
    });
    showToast("Link removed!", "info");
  };

  if (!authenticatedUser) {
    return <TeamLoginGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Button>
            </Link>
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
            🏇 Team Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and submit evidence for completed milestones
          </p>
        </div>

        {/* Racetrack */}
        <div className="mb-6">
          <Racetrack teams={teams} tasks={tasks} />
        </div>

        {selectedTeam ? (
          <>

            {/* Team Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <TeamIconPicker
                      currentIcon={selectedTeam.horseIcon}
                      onSave={handleSaveTeamIcon}
                    />
                    <TeamNameEditor
                      currentName={selectedTeam.name}
                      onSave={handleSaveTeamName}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Progress: {getTasksCompleted(selectedTeam.progress)}/10
                    tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last updated</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(selectedTeam.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    by {selectedTeam.lastUpdatedBy || "—"}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (getTasksCompleted(selectedTeam.progress) / 10) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Task Checklist */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Milestones Checklist
                </h3>
                <TaskChecklist
                  tasks={tasks}
                  progress={selectedTeam.progress}
                  onToggle={handleToggleTask}
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Team Notes
                </h3>
                <Textarea
                  placeholder="Add notes about your progress, challenges, or achievements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] mb-2"
                />
                <Button onClick={handleSaveNotes} className="w-full">
                  <Save size={16} className="mr-2" />
                  Save Notes
                </Button>
              </div>

              {/* Links Manager */}
              <LinksManager
                links={selectedTeam.links}
                onAdd={handleAddLink}
                onRemove={handleRemoveLink}
              />
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

