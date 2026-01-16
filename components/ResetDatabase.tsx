"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RefreshCcw, AlertTriangle, X } from "lucide-react";
import { authenticateAdmin } from "@/lib/auth";

interface ResetDatabaseProps {
  onReset: (password: string) => void;
}

export function ResetDatabase({ onReset }: ResetDatabaseProps) {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setPassword("");
    setError(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword("");
    setError(false);
  };

  const handleReset = () => {
    // Validate admin password
    const auth = authenticateAdmin(password);
    
    if (!auth) {
      setError(true);
      return;
    }

    // Password is correct, proceed with reset
    setIsResetting(true);
    setError(false);

    // Clear localStorage
    localStorage.clear();
    
    // Call the reset callback
    onReset(password);

    // Wait a moment then reload the page to reinitialize
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-red-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🔄 Reset Database
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Clear all current data and reinitialize with fresh seed data. This will reset all teams, tasks, progress, scorecards, and audit logs to their default state.
            </p>
            <div className="bg-red-100 rounded-lg p-3 border border-red-300 mb-4">
              <p className="text-xs text-red-800 font-semibold">
                ⚠️ WARNING: This action cannot be undone. All current progress and data will be permanently lost.
              </p>
            </div>
            <Button
              onClick={handleOpenModal}
              variant="outline"
              className="bg-white hover:bg-red-50 text-red-600 border-red-400 hover:border-red-600 font-semibold"
            >
              <RefreshCcw size={16} className="mr-2" />
              Reset All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-400">
            <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 border-b-2 border-red-300 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={28} className="text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Confirm Reset
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseModal}
                  disabled={isResetting}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  You are about to reset the entire database. This will:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4 ml-2">
                  <li>Clear all team progress and customizations</li>
                  <li>Reset all tasks to initial state</li>
                  <li>Delete all scorecards and judging data</li>
                  <li>Clear all audit logs and history</li>
                  <li>Reset finalist selections</li>
                  <li>Reload with fresh seed data</li>
                </ul>
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                  <p className="text-sm font-bold text-red-800 text-center">
                    ⚠️ THIS ACTION CANNOT BE UNDONE ⚠️
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Admin Password to Confirm:
                </label>
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password) {
                      handleReset();
                    }
                  }}
                  className={error ? "border-red-500 border-2" : ""}
                  disabled={isResetting}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 mt-2 font-semibold">
                    ❌ Incorrect password. Please try again.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={!password || isResetting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isResetting ? (
                    <>
                      <RefreshCcw size={16} className="mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="mr-2" />
                      Confirm Reset
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
