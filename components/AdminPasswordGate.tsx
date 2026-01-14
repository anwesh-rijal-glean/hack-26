"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { authenticateAdmin } from "@/lib/auth";

interface AdminPasswordGateProps {
  onAuthenticated: () => void;
}

export function AdminPasswordGate({ onAuthenticated }: AdminPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = authenticateAdmin(password);
    if (admin) {
      onAuthenticated();
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-purple-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600">
            Enter the admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Access Admin Dashboard
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Dev Note:</strong> Password is "hackathon2026"
            <br />
            TODO: Replace with real authentication
          </p>
        </div>
      </div>
    </div>
  );
}

