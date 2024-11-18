'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ProjectTask } from '../types';
import SortableTaskCard from './SortableTaskCard';

interface Props {
  id: string;
  title: string;
  tasks: ProjectTask[];
}

export default function KanbanColumn({ id, title, tasks }: Props) {
  const { setNodeRef } = useDroppable({
    id: `${id}-column`,
  });

  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-gray-600 bg-white rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
