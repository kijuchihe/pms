'use client';

// import { ProjectTask } from '../types';
import { format } from 'date-fns';
import { CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { Task } from '@/shared/types';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-purple-100 text-purple-800',
};

interface Props {
  task: Task;
  overlay?: boolean;
}

export default function TaskCard({ task, overlay }: Props) {
  console.log(task)
  return (
    <div
      className={clsx(
        'bg-dark rounded-lg shadow p-4',
        overlay && 'cursor-grabbing',
        !overlay && 'cursor-grab'
      )}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-light">{task?.title}</h4>
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
            priorityColors[task?.priority.toLowerCase() as keyof typeof priorityColors]
          )}
        >
          {task?.priority}
        </span>
      </div>

      <p className="mt-1 text-sm text-light-100 line-clamp-2">
        {task?.description ? task?.description : 'No description provided'}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        {task?.assigneeId ? (
          <div className="flex items-center">
            <UserCircleIcon className="h-5 w-5 mr-1" />
            <span>Assignee</span>
          </div>
        ) : (<p>No one assigned yet!</p>)}
        {task?.dueDate && (
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-1" />
            <span>{format(new Date(task?.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
