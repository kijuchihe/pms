'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from '@/modules/projects/components/KanbanBoard';
import CreateTaskDialog from '@/modules/projects/components/CreateTaskDialog';
import { useProjectDetail } from '@/modules/projects/hooks/useProjectDetail';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { project, isLoading, error } = useProjectDetail(id as string);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

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
        <div className="text-lg text-gray-500">Error: {error}</div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-light">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-light-100">{project.description}</p>
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

      />
    </div>
  );
}
