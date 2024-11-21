'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import { Project } from '@/shared/types';
import { useProject } from '@/modules/projects/hooks/useProjects';
import KanbanBoard from '@/modules/projects/components/KanbanBoard';
import CreateTaskDialog from '@/modules/projects/components/CreateTaskDialog';

export default function ProjectPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProject(id as string);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
const project = data?.data;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Error: {error.message}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{project.description}</p>
        </div>
        <button
          onClick={() => setIsCreateTaskOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Task
        </button>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <KanbanBoard projectId={project.id} tasks={project.tasks} />
      </div>

      <CreateTaskDialog
        projectId={project.id}
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onTaskCreated={(newTask) => {
          // Update project tasks
        }}
      />
    </div>
  );
}
