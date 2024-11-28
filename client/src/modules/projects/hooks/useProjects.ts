'use client';
import { useEffect, useState } from "react";
import { Project } from "../../../shared/types";
import { userApi } from "../../../shared/utils/api";
import { useStore } from "../../../shared/store/useStore";
import { useRouter } from "next/navigation";
import { handleError } from "@/shared/utils/handleError";

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
        handleError(error, router);
      } finally {
        setIsLoading(false)
      }
    };
    fetchProjects();
  }, [user, router]);
  return { projects, isLoading }
}

