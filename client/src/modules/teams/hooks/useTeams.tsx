import { useStore } from "@/shared/store/useStore";
import { userApi } from "@/shared/utils/api";
import { deleteCookie } from "@/shared/utils/delete-cookie";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { NextRouter } from "next/router";
import { useEffect, useState } from "react"

export const useTeams = () => {
  const [teams, setTeams] = useState<any[]>([]);
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
      } catch (error: any) {

        if (error instanceof AxiosError) {
          if (error.status === 401) {
            deleteCookie('token')
            router.replace('/auth/login?from=/teams')
          }
        }
      } finally {
        setIsLoading(false)
      }
    };
    fetchTeams();
  }, [user])

  return { teams, isLoading }
}