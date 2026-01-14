"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { JudgeLoginGate } from "@/components/JudgeLoginGate";
import { ScorecardForm } from "@/components/ScorecardForm";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { AuthenticatedUser, getJudgeAuth, saveJudgeAuth, clearJudgeAuth } from "@/lib/auth";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { Scorecard } from "@/lib/types";

function JudgePortalContent() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const teams = useStore((state) => state.teams);
  const rubric = useStore((state) => state.rubric);
  const scorecards = useStore((state) => state.scorecards);
  const finalistTeamIds = useStore((state) => state.finalistTeamIds);
  const saveScorecard = useStore((state) => state.saveScorecard);
  const submitScorecard = useStore((state) => state.submitScorecard);
  const initializeStore = useStore((state) => state.initializeStore);

  const { showToast } = useToast();

  useEffect(() => {
    initializeStore();
    const user = getJudgeAuth();
    if (user && user.type === "judge") {
      setAuthenticatedUser(user);
    }
  }, [initializeStore]);

  const handleAuthenticated = (user: AuthenticatedUser) => {
    setAuthenticatedUser(user);
    saveJudgeAuth(user);
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    clearJudgeAuth();
    setSelectedTeamId(null);
    showToast("Logged out successfully", "info");
  };

  const handleSaveScorecard = (scorecard: Scorecard, isDraft: boolean) => {
    saveScorecard(scorecard);
    if (!isDraft) {
      submitScorecard(scorecard.id);
      showToast("Scorecard submitted successfully!", "success");
    } else {
      showToast("Draft saved!", "success");
    }
  };

  if (!authenticatedUser) {
    return <JudgeLoginGate onAuthenticated={handleAuthenticated} />;
  }

  const finalistTeams = teams.filter((team) => finalistTeamIds.includes(team.id));
  const selectedTeam = finalistTeams.find((t) => t.id === selectedTeamId);

  // Get judge's scorecards
  const myScorecards = scorecards.filter((s) => s.judgeId === authenticatedUser.judgeId);
  const submittedCount = myScorecards.filter((s) => s.submittedAt).length;
  const draftCount = myScorecards.filter((s) => !s.submittedAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-900">
                  {authenticatedUser.judgeName}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚖️ Glean SE Hackathon 2027 - Judge Portal
          </h1>
          <p className="text-gray-600">
            Score the finalist presentations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Finalists
            </p>
            <p className="text-4xl font-bold text-purple-600">{finalistTeams.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Submitted
            </p>
            <p className="text-4xl font-bold text-green-600">{submittedCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Drafts
            </p>
            <p className="text-4xl font-bold text-orange-600">{draftCount}</p>
          </div>
        </div>

        {!selectedTeam ? (
          /* Team Selection Grid */
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select a Team to Score
            </h2>
            
            {finalistTeams.length === 0 ? (
              <div className="p-8 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-center">
                <p className="text-xl font-semibold text-yellow-800 mb-2">
                  ⚠️ No Finalist Teams Selected
                </p>
                <p className="text-gray-700">
                  The admin hasn't selected any finalist teams yet. Please check back later or contact the admin.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalistTeams.map((team) => {
                const scorecard = myScorecards.find((s) => s.teamId === team.id);
                const isSubmitted = !!scorecard?.submittedAt;
                const isDraft = scorecard && !scorecard.submittedAt;

                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                      isSubmitted
                        ? "bg-green-50 border-green-400"
                        : isDraft
                        ? "bg-orange-50 border-orange-400"
                        : "bg-gray-50 border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{team.horseIcon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{team.name}</h3>
                        <p className="text-xs text-gray-600">{team.id}</p>
                      </div>
                    </div>
                    {isSubmitted && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm font-semibold text-green-700">
                          ✅ Submitted
                        </span>
                        <span className="text-sm text-gray-600">
                          {scorecard.totalScore} pts
                        </span>
                      </div>
                    )}
                    {isDraft && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm font-semibold text-orange-700">
                          📝 Draft
                        </span>
                        <span className="text-sm text-gray-600">
                          {scorecard.totalScore} pts
                        </span>
                      </div>
                    )}
                    {!scorecard && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">
                          Not started
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
              </div>
            )}
          </div>
        ) : (
          /* Scorecard Form */
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedTeamId(null)}
              className="mb-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Team List
            </Button>
            <ScorecardForm
              team={selectedTeam}
              rubric={rubric}
              judgeId={authenticatedUser.judgeId!}
              judgeName={authenticatedUser.judgeName!}
              existingScorecard={myScorecards.find((s) => s.teamId === selectedTeam.id)}
              onSave={handleSaveScorecard}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function JudgePage() {
  return (
    <ToastProvider>
      <JudgePortalContent />
    </ToastProvider>
  );
}
