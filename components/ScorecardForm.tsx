"use client";

import { useState, useEffect } from "react";
import { Team, RubricCriterion, TeamScore, Scorecard } from "@/lib/types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { generateId } from "@/lib/utils";

interface ScorecardFormProps {
  team: Team;
  rubric: RubricCriterion[];
  judgeId: string;
  judgeName: string;
  existingScorecard?: Scorecard;
  onSave: (scorecard: Scorecard, isDraft: boolean) => void;
}

export function ScorecardForm({
  team,
  rubric,
  judgeId,
  judgeName,
  existingScorecard,
  onSave,
}: ScorecardFormProps) {
  const [scores, setScores] = useState<TeamScore[]>(() => {
    if (existingScorecard) {
      return existingScorecard.scores;
    }
    return rubric.map((criterion) => ({
      criterionId: criterion.id,
      score: 0,
      comments: "",
    }));
  });

  const [isSubmitted, setIsSubmitted] = useState(!!existingScorecard?.submittedAt);

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const maxTotalScore = rubric.reduce((sum, c) => sum + c.maxPoints, 0);

  const handleScoreChange = (criterionId: string, newScore: number) => {
    const criterion = rubric.find((c) => c.id === criterionId);
    if (!criterion) return;

    // Clamp score between 0 and maxPoints
    const clampedScore = Math.max(0, Math.min(newScore, criterion.maxPoints));

    setScores((prev) =>
      prev.map((s) =>
        s.criterionId === criterionId ? { ...s, score: clampedScore } : s
      )
    );
  };

  const handleCommentsChange = (criterionId: string, comments: string) => {
    setScores((prev) =>
      prev.map((s) =>
        s.criterionId === criterionId ? { ...s, comments } : s
      )
    );
  };

  const handleSave = (submit: boolean) => {
    const scorecard: Scorecard = {
      id: existingScorecard?.id || generateId(),
      judgeId,
      judgeName,
      teamId: team.id,
      scores,
      totalScore,
      submittedAt: submit ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(scorecard, !submit);
    if (submit) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{team.horseIcon}</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-600">Team ID: {team.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Score</p>
            <p className="text-4xl font-bold text-purple-600">
              {totalScore}<span className="text-2xl text-gray-500">/{maxTotalScore}</span>
            </p>
          </div>
        </div>
        {isSubmitted && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
            <p className="text-sm font-semibold text-green-800">
              ✅ Scorecard submitted successfully!
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {rubric.map((criterion) => {
          const teamScore = scores.find((s) => s.criterionId === criterion.id);
          if (!teamScore) return null;

          return (
            <div
              key={criterion.id}
              className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {criterion.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {criterion.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-xs text-gray-500 mb-1">Points</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={criterion.maxPoints}
                      value={teamScore.score}
                      onChange={(e) =>
                        handleScoreChange(criterion.id, Number(e.target.value))
                      }
                      className="w-20 text-center text-lg font-bold"
                      disabled={isSubmitted}
                    />
                    <span className="text-lg font-semibold text-gray-600">
                      / {criterion.maxPoints}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments (Optional)
                </label>
                <Textarea
                  value={teamScore.comments || ""}
                  onChange={(e) =>
                    handleCommentsChange(criterion.id, e.target.value)
                  }
                  placeholder="Add your feedback here..."
                  rows={2}
                  className="text-sm"
                  disabled={isSubmitted}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4 justify-end border-t-2 border-gray-200 pt-6">
        {!isSubmitted && (
          <>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              className="px-6"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              className="px-6 bg-purple-600 hover:bg-purple-700"
            >
              Submit Final Scorecard
            </Button>
          </>
        )}
        {isSubmitted && (
          <p className="text-sm text-gray-600 italic">
            This scorecard has been submitted and cannot be edited.
          </p>
        )}
      </div>
    </div>
  );
}
