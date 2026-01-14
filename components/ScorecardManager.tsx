"use client";

import { useState } from "react";
import { Scorecard, RubricCriterion, Team } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Pencil, Check, X } from "lucide-react";

interface ScorecardManagerProps {
  scorecards: Scorecard[];
  teams: Team[];
  rubric: RubricCriterion[];
  onUpdateRubric: (rubric: RubricCriterion[]) => void;
}

export function ScorecardManager({
  scorecards,
  teams,
  rubric,
  onUpdateRubric,
}: ScorecardManagerProps) {
  const [editingRubric, setEditingRubric] = useState(false);
  const [editedRubric, setEditedRubric] = useState<RubricCriterion[]>(rubric);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleSaveRubric = () => {
    onUpdateRubric(editedRubric);
    setEditingRubric(false);
  };

  const handleCancelEdit = () => {
    setEditedRubric(rubric);
    setEditingRubric(false);
  };

  const updateCriterion = (
    id: string,
    field: keyof RubricCriterion,
    value: string | number
  ) => {
    setEditedRubric((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Calculate team aggregates
  const getTeamScores = (teamId: string) => {
    const teamScorecards = scorecards.filter((s) => s.teamId === teamId && s.submittedAt);
    if (teamScorecards.length === 0) return null;

    const totalScore = teamScorecards.reduce((sum, s) => sum + s.totalScore, 0);
    const avgScore = totalScore / teamScorecards.length;
    const judgeCount = teamScorecards.length;

    return { avgScore, judgeCount, totalScore };
  };

  const teamsWithScores = teams
    .filter((team) => {
      const scores = getTeamScores(team.id);
      return scores !== null;
    })
    .map((team) => ({
      team,
      scores: getTeamScores(team.id)!,
    }))
    .sort((a, b) => b.scores.avgScore - a.scores.avgScore);

  const maxTotalScore = rubric.reduce((sum, c) => sum + c.maxPoints, 0);

  return (
    <div className="space-y-6">
      {/* Rubric Management */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Judging Rubric</h3>
          {!editingRubric ? (
            <Button
              variant="outline"
              onClick={() => setEditingRubric(true)}
              className="flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Rubric
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
              <Button
                onClick={handleSaveRubric}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Check size={16} />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {(editingRubric ? editedRubric : rubric).map((criterion) => (
            <div
              key={criterion.id}
              className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200"
            >
              {editingRubric ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Criterion Title
                    </label>
                    <Input
                      value={criterion.title}
                      onChange={(e) =>
                        updateCriterion(criterion.id, "title", e.target.value)
                      }
                      className="font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={criterion.description}
                      onChange={(e) =>
                        updateCriterion(criterion.id, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Points
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={criterion.maxPoints}
                      onChange={(e) =>
                        updateCriterion(criterion.id, "maxPoints", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {criterion.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {criterion.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-2xl font-bold text-purple-600">
                      {criterion.maxPoints}
                    </span>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total Possible Score
              </span>
              <span className="text-3xl font-bold text-gray-900">
                {editingRubric
                  ? editedRubric.reduce((sum, c) => sum + c.maxPoints, 0)
                  : maxTotalScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecards Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Final Scores</h3>
        
        {teamsWithScores.length === 0 ? (
          <p className="text-gray-600 italic">No submitted scorecards yet.</p>
        ) : (
          <div className="space-y-3">
            {teamsWithScores.map(({ team, scores }, index) => (
              <div
                key={team.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  index === 0
                    ? "bg-yellow-100 border-yellow-400"
                    : index === 1
                    ? "bg-gray-100 border-gray-400"
                    : index === 2
                    ? "bg-amber-100 border-amber-400"
                    : "bg-white border-gray-200 hover:border-blue-300"
                } ${selectedTeamId === team.id ? "ring-4 ring-blue-400" : ""}`}
                onClick={() =>
                  setSelectedTeamId(selectedTeamId === team.id ? null : team.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-600 min-w-[40px]">
                      {index + 1}.
                    </span>
                    <span className="text-3xl">{team.horseIcon}</span>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{team.name}</p>
                      <p className="text-sm text-gray-600">
                        {scores.judgeCount} judge{scores.judgeCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-600">
                      {scores.avgScore.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      avg / {maxTotalScore}
                    </p>
                  </div>
                </div>

                {/* Detailed breakdown when selected */}
                {selectedTeamId === team.id && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-300">
                    <h5 className="font-semibold text-gray-800 mb-3">
                      Individual Judge Scores:
                    </h5>
                    <div className="space-y-2">
                      {scorecards
                        .filter((s) => s.teamId === team.id && s.submittedAt)
                        .map((scorecard) => (
                          <div
                            key={scorecard.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-700">
                              {scorecard.judgeName}
                            </span>
                            <span className="font-bold text-gray-900">
                              {scorecard.totalScore} / {maxTotalScore}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
