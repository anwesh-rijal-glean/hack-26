"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { authenticateTeam, AuthenticatedUser } from "@/lib/auth";

interface TeamLoginGateProps {
  onAuthenticated: (user: AuthenticatedUser) => void;
}

export function TeamLoginGate({ onAuthenticated }: TeamLoginGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateTeam(username, password);
    
    if (user) {
      onAuthenticated(user);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-blue-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏇</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Glean SE Hackathon 2027
          </h1>
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Team Login
          </p>
          <p className="text-gray-600">
            Enter your team credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              className={error ? "border-red-500" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={error ? "border-red-500" : ""}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">
              Invalid username or password. Please try again.
            </p>
          )}
          <Button type="submit" className="w-full">
            Login to Team Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}
