"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { authenticateAdmin } from "@/lib/auth";

interface ResetDatabaseProps {
  onReset: () => void;
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
    onReset();

    // Wait a moment then reload the page to reinitialize
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (showModal) {
    return (
      <div className="border border-red-600 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RefreshCcw className="w-5 h-5" />
          Reset Database
        </h3>
        <p className="text-sm text-red-600 mb-4 font-semibold">
          ⚠️ This will delete ALL current data!
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && password && handleReset()}
            placeholder="Admin password"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            autoFocus
            disabled={isResetting}
          />
          {error && (
            <p className="text-sm text-red-600">
              ❌ Incorrect password
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={isResetting || !password}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? "Resetting..." : "Confirm Reset"}
            </button>
            <button
              onClick={handleCloseModal}
              disabled={isResetting}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-red-600 rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <RefreshCcw className="w-5 h-5" />
        Reset Database
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Clear all data and reinitialize with fresh seed values
      </p>
      <button
        onClick={handleOpenModal}
        disabled={isResetting}
        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <RefreshCcw className="w-4 h-4" />
        Reset All Data
      </button>
    </div>
  );
}
