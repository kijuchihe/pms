'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teamsApi, projectsApi } from '@/shared/utils/api';
import { Project } from '@/shared/types';
import ProjectCard from '@/modules/projects/components/ProjectCard';
import { Button } from '@/shared/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTeamDetail } from '@/modules/teams/hooks/useTeamDetail';

export default function TeamProjects() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const { team } = useTeamDetail(teamId, (team) => setProjects(team.projects || []));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await teamsApi.getById(teamId);
        setProjects(response.data.projects || []);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch team projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [teamId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Projects</h1>
        <Button
          onClick={() => router.push(`/teams/${teamId}/projects/new`)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => router.push(`/teams/${teamId}/projects/${project.id}`)}
          />
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No projects found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}