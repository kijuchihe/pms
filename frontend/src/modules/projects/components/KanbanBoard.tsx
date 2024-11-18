'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '@/shared/types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { useStore } from '@/shared/store/useStore';
import { tasksApi } from '@/shared/utils/api';
import { ProjectTask } from '../types';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

interface Props {
  projectId: string;
  tasks: ProjectTask[];
}

export default function KanbanBoard({ projectId, tasks: initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const newStatus = over.id.split('-')[0]; // column id format: "todo-column"

    if (activeTask && activeTask.status !== newStatus) {
      try {
        await tasksApi.update(projectId, activeTask.id, {
          status: newStatus as 'todo' | 'in-progress' | 'done',
        });

        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: newStatus }
              : task
          )
        );
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }

    setActiveId(null);
  };

  const getColumnTasks = (columnId: string) => {
    return tasks.filter((task) => task.status === columnId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={getColumnTasks(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <TaskCard
            task={tasks.find((task) => task.id === activeId)!}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
