'use client';
import { useStore } from "@/shared/store/useStore";
import { projectsApi } from "@/shared/utils/api";
import { deleteCookie } from "@/shared/utils/delete-cookie";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export function useCreateProject() {
  const { user } = useStore(state => state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createProject = useCallback(async (projectData: CreateProjectData) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await projectsApi.create({
        ...projectData,
        ownerId: user.id
      });
      router.push('/projects'); // Redirect to projects list after creation
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          deleteCookie('token');
          router.replace('/auth/login?from=/projects');
        }
        setError(error.response?.data?.message || 'Failed to create project');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, router]);

  return {
    createProject,
    isLoading,
    error
  };
}