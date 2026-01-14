"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const initializeStore = useStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🏁 Hackathon Race Track
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your team's progress in real-time as you compete with 20 teams
            to complete 10 milestones and reach the finish line!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Team View Card */}
          <Link href="/team">
            <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-4 border-blue-100 hover:border-blue-300 cursor-pointer transform hover:-translate-y-2">
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                🏇
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
                Team View
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Update your team's progress, add notes, and submit evidence
                links as you complete milestones.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">Features:</p>
                <ul className="space-y-1">
                  <li>✓ Track task completion</li>
                  <li>✓ Add team notes</li>
                  <li>✓ Submit evidence links</li>
                  <li>✓ View your position</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Admin View Card */}
          <Link href="/admin">
            <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-4 border-purple-100 hover:border-purple-300 cursor-pointer transform hover:-translate-y-2">
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                👑
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
                Admin View
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Monitor all teams, manage tasks, review audit logs, and control
                the competition flow.
              </p>
              <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">Features:</p>
                <ul className="space-y-1">
                  <li>✓ Monitor all teams</li>
                  <li>✓ Lock/unlock tasks</li>
                  <li>✓ Undo changes</li>
                  <li>✓ View audit history</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              LIVE COMPETITION STATUS
            </p>
            <p className="text-3xl font-bold text-blue-600">
              20 Teams · 10 Milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

