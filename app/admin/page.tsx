"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { AdminPasswordGate } from "@/components/AdminPasswordGate";
import { AdminTable } from "@/components/AdminTable";
import { TaskLockControls } from "@/components/TaskLockControls";
import { TaskEditor } from "@/components/TaskEditor";
import { TeamDetailDrawer } from "@/components/TeamDetailDrawer";
import { Racetrack } from "@/components/Racetrack";
import { ScorecardManager } from "@/components/ScorecardManager";
import { FinalistSelector } from "@/components/FinalistSelector";
import { ResetDatabase } from "@/components/ResetDatabase";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveAdminAuth, isAdminAuthed, clearAdminAuth } from "@/lib/auth";
import { Task, RubricCriterion } from "@/lib/types";

function AdminViewContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const teams = useStore((state) => state.teams);
  const tasks = useStore((state) => state.tasks);
  const rubric = useStore((state) => state.rubric);
  const scorecards = useStore((state) => state.scorecards);
  const finalistTeamIds = useStore((state) => state.finalistTeamIds);
  const lockTask = useStore((state) => state.lockTask);
  const updateTask = useStore((state) => state.updateTask);
  const resetTeam = useStore((state) => state.resetTeam);
  const undoLast = useStore((state) => state.undoLast);
  const updateRubric = useStore((state) => state.updateRubric);
  const toggleFinalist = useStore((state) => state.toggleFinalist);
  const resetAllData = useStore((state) => state.resetAllData);
  const fetchAllData = useStore((state) => state.fetchAllData);

  const { showToast } = useToast();

  useEffect(() => {
    // Force fresh data fetch from database
    console.log('🔄 Admin page mounted - fetching fresh data from database...');
    fetchAllData().catch((error) => {
      console.error('❌ Failed to fetch initial data:', error);
      showToast("⚠️ Failed to load data. Please refresh the page.", "error");
    });
    
    // Check sessionStorage for existing auth
    if (isAdminAuthed()) {
      setIsAuthenticated(true);
    }
  }, [fetchAllData, showToast]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    saveAdminAuth();
  };

  const handleViewDetails = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleUndo = async (teamId: string) => {
    try {
      await undoLast(teamId, { type: "admin", id: "admin" });
      showToast("Last action undone!", "info");
    } catch (error) {
      console.error('Failed to undo:', error);
      showToast("❌ Failed to undo. Please check if database is configured.", "error");
    }
  };

  const handleReset = async (teamId: string) => {
    try {
      await resetTeam(teamId, { type: "admin", id: "admin" });
      showToast("Team reset successfully!", "success");
    } catch (error) {
      console.error('Failed to reset team:', error);
      showToast("❌ Failed to reset. Please check if database is configured.", "error");
    }
  };

  const handleToggleLock = async (taskId: number, locked: boolean) => {
    try {
      await lockTask(taskId, locked, { type: "admin", id: "admin" });
      showToast(
        locked ? "Task locked!" : "Task unlocked!",
        locked ? "info" : "success"
      );
    } catch (error) {
      console.error('Failed to lock/unlock task:', error);
      showToast("❌ Failed to update task lock. Please check if database is configured.", "error");
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates, { type: "admin", id: "admin" });
      showToast("Task updated successfully!", "success");
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast("❌ Failed to update task. Please check if database is configured.", "error");
    }
  };

  const handleUpdateRubric = async (newRubric: RubricCriterion[]) => {
    try {
      await updateRubric(newRubric);
      showToast("Rubric updated successfully!", "success");
    } catch (error) {
      console.error('Failed to update rubric:', error);
      showToast("❌ Failed to update rubric. Please check if database is configured.", "error");
    }
  };

  const handleToggleFinalist = async (teamId: string) => {
    const isFinalist = finalistTeamIds.includes(teamId);
    
    try {
      await toggleFinalist(teamId);
      showToast(
        isFinalist
          ? "Team removed from finalists"
          : "Team added to finalists",
        "success"
      );
    } catch (error) {
      console.error('Failed to toggle finalist:', error);
      showToast(
        "❌ Failed to update finalists. Please check if database is configured.",
        "error"
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    clearAdminAuth();
  };

  const handleResetDatabase = async (password: string) => {
    try {
      await resetAllData(password);
      showToast("✅ Database reset successfully! Page will reload...", "success");
    } catch (error) {
      console.error('Failed to reset database:', error);
      showToast("❌ Failed to reset database. Check console for details.", "error");
    }
  };

  if (!isAuthenticated) {
    return <AdminPasswordGate onAuthenticated={handleAuthenticated} />;
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F3EB' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👑 Glean SE Hackathon 2027 - Admin Dashboard
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

        {/* Finalist Selection */}
        <div className="mb-6">
          <FinalistSelector
            teams={teams}
            finalistTeamIds={finalistTeamIds}
            onToggleFinalist={handleToggleFinalist}
          />
        </div>

        {/* Scorecard Management */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Judging & Scorecards
          </h2>
          <ScorecardManager
            scorecards={scorecards}
            teams={teams}
            rubric={rubric}
            onUpdateRubric={handleUpdateRubric}
          />
        </div>

        {/* Database Reset */}
        <div className="mb-6">
          <ResetDatabase onReset={handleResetDatabase} />
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

