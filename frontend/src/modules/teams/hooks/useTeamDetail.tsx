'use client';
import { Team } from "@/shared/types";
import { teamsApi } from "@/shared/utils/api";
import { deleteCookie } from "@/shared/utils/delete-cookie";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useTeamDetail = (teamId: string, onFetchedTeams?: (team: Team) => any) => {
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
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch team details');
        if (error instanceof AxiosError) {
          if (error.status === 401) {
            deleteCookie('token')
            router.replace('/auth/login?from=/teams')
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  return { team, isLoading, error };
}