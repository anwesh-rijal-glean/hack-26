"use client";

import { Team } from "@/lib/types";
import { Select } from "./ui/select";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamSelector({
  teams,
  selectedTeamId,
  onSelectTeam,
}: TeamSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Your Team
      </label>
      <Select
        value={selectedTeamId || ""}
        onChange={(e) => onSelectTeam(e.target.value)}
        className="text-lg"
      >
        <option value="">Choose your team...</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.horseIcon} {team.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

