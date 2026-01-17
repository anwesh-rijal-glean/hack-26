"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function checkDatabase() {
      try {
        const response = await fetch("/api/teams");
        if (response.ok) {
          setStatus("connected");
        } else {
          const error = await response.text();
          setStatus("error");
          setErrorMessage(error || "Failed to connect to database");
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    checkDatabase();
  }, []);

  if (status === "checking") {
    return null; // Don't show anything while checking
  }

  if (status === "connected") {
    return null; // Don't show anything when connected
  }

  // Show error banner
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-start gap-3">
          <XCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">
              ⚠️ Database Not Configured
            </h3>
            <p className="mb-3">
              The app cannot function without a database connection. Supabase
              PostgreSQL setup required.
            </p>
            <div className="bg-red-700 rounded-lg p-4 mb-3">
              <p className="text-sm font-mono">{errorMessage}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">📋 Quick Setup Steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Create free account at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Create new project and run database schema</li>
                <li>Get your API keys from Settings → API</li>
                <li>
                  Create <code className="bg-red-800 px-1 py-0.5 rounded">.env.local</code> file with:
                  <div className="bg-red-800 mt-1 p-2 rounded font-mono text-xs">
                    NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
                    <br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
                  </div>
                </li>
                <li>
                  Restart dev server: <code className="bg-red-800 px-1 py-0.5 rounded">npm run dev</code>
                </li>
              </ol>
            </div>
            <p className="mt-3 text-sm">
              📖 See{" "}
              <strong>
                <code className="bg-red-700 px-1 py-0.5 rounded">
                  SUPABASE_SETUP.md
                </code>
              </strong>{" "}
              or{" "}
              <strong>
                <code className="bg-red-700 px-1 py-0.5 rounded">
                  QUICK_START.md
                </code>
              </strong>{" "}
              for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
