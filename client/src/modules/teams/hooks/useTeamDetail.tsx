'use client';
import { Team } from "@/shared/types";
import { teamsApi } from "@/shared/utils/api";
import { handleError } from "@/shared/utils/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useTeamDetail = (teamId: string, onFetchedTeams?: (team: Team) => void) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true);
        const response = await teamsApi.getById(teamId);
        setTeam(response.data);
        onFetchedTeams?.(response.data);
      } catch (error) {
        handleError(error, router, setError)
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId, onFetchedTeams, router]);

  return { team, isLoading, error };
}