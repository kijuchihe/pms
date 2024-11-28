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
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/shared/types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { tasksApi } from '@/shared/utils/api';
import { AxiosError } from 'axios';
import { deleteCookie } from '@/shared/utils/delete-cookie';
import { useRouter } from 'next/navigation';

const columns = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'DONE', title: 'Done' },
];

interface Props {
  projectId: string;
  tasks: Task[];
}

export default function KanbanBoard({ projectId, tasks: initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    const activeTask = tasks?.find((task) => task.id === active.id);
    const newStatus = String(over.id).split('-')[0]; // column id format: "todo-column"

    if (activeTask && activeTask.status !== newStatus && newStatus) {
      try {
        await tasksApi.update(activeTask.id, {
          status: newStatus as TaskStatus,
          projectId
        });

        setTasks((tasks) =>
          tasks?.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: newStatus as TaskStatus }
              : task
          )
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 401) {
            deleteCookie('token')
            router.replace('/auth/login?from=/teams')
          }
          console.error('Failed to update task status:', error?.response?.data)
        }

      }
    }

    setActiveId(null);
  };

  const getColumnTasks = (columnId: string) => {
    return tasks?.filter((task) => task.status === columnId);
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
