'use client';

import { Sidebar } from './sidebar';
import { useProjects } from '@/modules/projects/hooks/useProjects';
import { useStore } from '@/shared/store/useStore';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { projects } = useProjects();
  const setProjects = useStore(state => state.setProjects);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (projects.length > 0) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  return (
    <div className="flex">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-dark text-white p-2 rounded-lg"
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar for Desktop and Mobile */}
      <div className={`
        fixed md:static top-0 left-0 h-screen w-64 transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        bg-dark text-white
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className={`
        p-4 h-screen w-full overflow-auto transition-all duration-300
        ${isSidebarOpen ? 'blur-sm md:blur-none' : ''}
        ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}
      `}>
        {children}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </div>
  )
}
