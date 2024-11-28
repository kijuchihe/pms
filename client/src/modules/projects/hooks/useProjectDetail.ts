import { useEffect, useState } from "react";
// import { Project } from "../types";
import { projectsApi } from "@/shared/utils/api";
import { Project } from "@/shared/types";

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const response = await projectsApi.getById(projectId)
        setProject(response.data.data.project)
      } catch (error) {
        setError('Failed to fetch project')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [projectId])

  return { project, isLoading, error }
}