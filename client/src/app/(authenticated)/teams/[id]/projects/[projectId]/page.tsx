'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectsApi } from '@/shared/utils/api';
import { Project, Task } from '@/shared/types';
import KanbanBoard from '@/modules/projects/components/KanbanBoard';
import { Button } from '@/shared/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateTaskDialog from '@/modules/projects/components/CreateTaskDialog';
import { handleError } from '@/shared/utils/handleError';

export default function TeamProjectDetail() {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await projectsApi.getById(projectId);
        setProject(response.data.data.project);
        setTasks(response.data.data.project.tasks || []);
      } catch (error) {
        handleError(error, router, setError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500">{project.description}</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Task
        </Button>
      </div>

      <KanbanBoard projectId={projectId} tasks={tasks} />

      {isCreateModalOpen && (
        <CreateTaskDialog
          open={isCreateModalOpen}
          projectId={projectId}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={() => { }}
        />
      )}
    </div>
  );
}