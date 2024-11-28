import { useStore } from "@/shared/store/useStore";
import { Team } from "@/shared/types";
import { userApi } from "@/shared/utils/api";
import { handleError } from "@/shared/utils/handleError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useStore(state => state)



  useEffect(() => {
    if (!user) return;
    const fetchTeams = async () => {
      try {
        setIsLoading(true)
        const response = await userApi.getUserTeams(user?.id as string);
        setTeams(response.data.data.teams)
      } catch (error) {
        handleError(error, router);
      } finally {
        setIsLoading(false)
      }
    };
    fetchTeams();
  }, [user, router]);

  return { teams, isLoading }
}