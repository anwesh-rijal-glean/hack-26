"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { AdminPasswordGate } from "@/components/AdminPasswordGate";
import { AdminTable } from "@/components/AdminTable";
import { TaskLockControls } from "@/components/TaskLockControls";
import { TaskEditor } from "@/components/TaskEditor";
import { TeamDetailDrawer } from "@/components/TeamDetailDrawer";
import { Racetrack } from "@/components/Racetrack";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveAdminAuth, isAdminAuthed, clearAdminAuth } from "@/lib/auth";
import { Task } from "@/lib/types";

function AdminViewContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const lockTask = useStore((state) => state.lockTask);
  const updateTask = useStore((state) => state.updateTask);
  const resetTeam = useStore((state) => state.resetTeam);
  const undoLast = useStore((state) => state.undoLast);
  const initializeStore = useStore((state) => state.initializeStore);

  const { showToast } = useToast();

  useEffect(() => {
    initializeStore();
    // Check sessionStorage for existing auth
    if (isAdminAuthed()) {
      setIsAuthenticated(true);
    }
  }, [initializeStore]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    saveAdminAuth();
  };

  const handleViewDetails = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleUndo = (teamId: string) => {
    undoLast(teamId, { type: "admin", id: "admin" });
    showToast("Last action undone!", "info");
  };

  const handleReset = (teamId: string) => {
    resetTeam(teamId, { type: "admin", id: "admin" });
    showToast("Team reset successfully!", "success");
  };

  const handleToggleLock = (taskId: number, locked: boolean) => {
    lockTask(taskId, locked, { type: "admin", id: "admin" });
    showToast(
      locked ? "Task locked!" : "Task unlocked!",
      locked ? "info" : "success"
    );
  };

  const handleUpdateTask = (taskId: number, updates: Partial<Task>) => {
    updateTask(taskId, updates, { type: "admin", id: "admin" });
    showToast("Task updated successfully!", "success");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    clearAdminAuth();
  };

  if (!isAuthenticated) {
    return <AdminPasswordGate onAuthenticated={handleAuthenticated} />;
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👑 Glean SE Hackathon - 2026 - Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor all teams, manage tasks, and control the competition
          </p>
        </div>

        {/* Racetrack */}
        <div className="mb-6">
          <Racetrack teams={teams} tasks={tasks} />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Teams
            </p>
            <p className="text-4xl font-bold text-blue-600">{teams.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Completed Teams
            </p>
            <p className="text-4xl font-bold text-green-600">
              {teams.filter((t) => t.progress.every((p) => p)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Tasks
            </p>
            <p className="text-4xl font-bold text-purple-600">{tasks.length}</p>
          </div>
        </div>

        {/* Task Management */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Task Lock Controls */}
          <TaskLockControls tasks={tasks} onToggleLock={handleToggleLock} />

          {/* Task Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit Tasks
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Update task titles, descriptions, and due dates. Changes apply to
              all teams.
            </p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {tasks.map((task) => (
                <TaskEditor
                  key={task.id}
                  task={task}
                  onSave={handleUpdateTask}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Teams Overview
          </h2>
          <AdminTable
            teams={teams}
            onViewDetails={handleViewDetails}
            onUndo={handleUndo}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* Team Detail Drawer */}
      {selectedTeam && (
        <TeamDetailDrawer
          team={selectedTeam}
          tasks={tasks}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </div>
  );
}

export default function AdminViewPage() {
  return (
    <ToastProvider>
      <AdminViewContent />
    </ToastProvider>
  );
}

