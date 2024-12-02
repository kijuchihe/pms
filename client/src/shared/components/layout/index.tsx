'use client';

import { Sidebar } from './sidebar';
import { useProjects } from '@/modules/projects/hooks/useProjects';
import { useStore } from '@/shared/store/useStore';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { projects } = useProjects();
  const setProjects = useStore(state => state.setProjects);

  useEffect(() => {
    if (projects.length > 0) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-4 h-full">
        {children}
      </main>
    </>
  )
}
