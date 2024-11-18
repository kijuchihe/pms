import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/shared/utils/api';
import { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  ProjectResponse,
  
} from '../types';

import { PaginationParams, ItemApiResponse, PaginatedResponse } from '@/shared/types';

export const useProjects = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const { data } = await projectsApi.getAll(params);
      return data as PaginatedResponse<Project>;
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await projectsApi.getById(id);
      return data as ItemApiResponse<Project>;
    },
    enabled: !!id, // Only run query if id exists
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: CreateProjectRequest) => {
      const { data } = await projectsApi.create(newProject);
      return data as ItemApiResponse<ProjectResponse>;
    },
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateProjectRequest & { id: string }) => {
      const { data } = await projectsApi.update(id, updates);
      return data as ItemApiResponse<ProjectResponse>;
    },
    onSuccess: (data) => {
      // Update both the list and the individual project
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data?.data.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await projectsApi.delete(id);
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache and refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', id] });
    },
  });
};
