'use client';

import { Project } from '@/shared/types';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Props {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-blue-100 text-blue-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold line-clamp-1">{project.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            project.priority
          )}`}
        >
          {project.priority}
        </span>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(project.startDate), 'MMM d')} -{' '}
            {format(new Date(project.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        {project.members && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            <span>{project.members.length} members</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status?.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}