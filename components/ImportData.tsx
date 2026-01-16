"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export function ImportData({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [isImporting, setIsImporting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".json")) {
        alert("Please select a JSON file");
        return;
      }
      setSelectedFile(file);
      setShowPasswordPrompt(true);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !password) {
      return;
    }

    setIsImporting(true);
    try {
      // Read file content
      const fileContent = await selectedFile.text();
      const importData = JSON.parse(fileContent);

      // Send to API
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data: importData }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to import data");
        setPassword("");
        setShowPasswordPrompt(false);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const result = await response.json();
      alert(
        `Data imported successfully!\n\n` +
        `Teams: ${result.stats.teams}\n` +
        `Tasks: ${result.stats.tasks}\n` +
        `Scorecards: ${result.stats.scorecards}\n` +
        `Audit Log: ${result.stats.auditLog} entries`
      );
      
      setPassword("");
      setShowPasswordPrompt(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Notify parent to refresh data
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import data. Please check the file format.");
    } finally {
      setIsImporting(false);
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="border border-green-600 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Data
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          File: <span className="font-mono text-sm">{selectedFile?.name}</span>
        </p>
        <p className="text-sm text-red-600 mb-4 font-semibold">
          ⚠️ This will replace ALL current data!
        </p>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleImport()}
            placeholder="Admin password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={isImporting || !password}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? "Importing..." : "Confirm Import"}
            </button>
            <button
              onClick={() => {
                setShowPasswordPrompt(false);
                setPassword("");
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="border border-green-600 rounded-lg p-6 bg-white">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Import Data
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Restore data from a previously exported JSON file
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        id="import-file-input"
      />
      <label
        htmlFor="import-file-input"
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer flex items-center justify-center gap-2 inline-block text-center"
      >
        <Upload className="w-4 h-4" />
        Choose File to Import
      </label>
    </div>
  );
}
