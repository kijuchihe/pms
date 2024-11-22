'use client';

import { useEffect, useState } from 'react';
import { useProjects } from '@/modules/projects/hooks/useProjects';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/shared/store/useStore';
import { projectsApi, userApi } from '@/shared/utils/api';
import { useQuery } from '@tanstack/react-query';

export default function ProjectsPage() {
  const { user } = useStore((state) => state);
  const [projects, setProjects] = useState<any[]>([]);  // const { data } = useQuery({
  //   queryKey: ['projects'],
  //   queryFn: async () => {
  //     if (!user) return { message: "User not found", projects: [] }
  //     return userApi.getUserProjects(user?.id as string);
  //   },
  // },);
  // const projects = data?.projects


  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const response = await userApi.getUserProjects(user?.id as string);
      setProjects(response.data.projects)
    };
    fetchProjects();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.length > 0 ? (<>{projects?.map((project: any) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block"
          >
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600">{project.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {project.tasks?.length || 0} tasks
                </span>
                <span className="text-sm text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}</>) : (<p>No projects found</p>)}
      </div>
    </div>
  );
}
