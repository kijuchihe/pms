'use client';
import { useEffect, useState } from "react";
import { Project } from "../../../shared/types";
import { projectsApi, userApi } from "../../../shared/utils/api";
import { useStore } from "../../../shared/store/useStore";
import { AxiosError } from "axios";
import { deleteCookie } from "../../../shared/utils/delete-cookie";
import { useRouter } from "next/navigation";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useStore(state => state);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await userApi.getUserProjects(user?.id as string);
        setProjects(response.data.projects)
      } catch (error) {
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
    fetchProjects();
  }, [user]);
  return { projects, isLoading }
}

