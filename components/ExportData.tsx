"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function ExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleExport = async () => {
    if (!password) {
      setShowPasswordPrompt(true);
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to export data");
        setPassword("");
        setShowPasswordPrompt(false);
        return;
      }

      const data = await response.json();

      // Create a blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hackathon-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Data exported successfully!");
      setPassword("");
      setShowPasswordPrompt(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="border border-blue-600 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export All Data
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter admin password to export all current data as JSON
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExport()}
            placeholder="Admin password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting || !password}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? "Exporting..." : "Export"}
            </button>
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setPassword("");
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-blue-600 rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Export Data
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Download all current data as a JSON file for backup
      </p>
      <button
        onClick={() => setShowPasswordPrompt(true)}
        disabled={isExporting}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export All Data
      </button>
    </div>
  );
}
