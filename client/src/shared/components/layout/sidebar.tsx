'use client'
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '@/shared/store/useStore';
import { authApi } from '@/shared/utils/api';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
// import { Project } from '@/shared/types';

export function Sidebar() {
  const user = useStore(state => state.user);
  const projects = useStore(state => state.projects);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get first 5 projects for display
  const displayProjects = filteredProjects.slice(0, 5);
  const hasMoreProjects = filteredProjects.length > 5;

  return (
    <div className="w-64 bg-dark text-white flex flex-col h-full overflow-y-auto">
      {/* Account Dropdown */}
      <div className="p-4">
        <Menu as="div" className="relative z-50">
          <MenuButton className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-dark-100">
            <span>{user?.email}</span>
            <ChevronDownIcon className="h-5 w-5" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute left-0 mt-2 w-56 rounded-md bg-dark-100 shadow-lg">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={async () => {
                        try {
                          await authApi.logout();
                          window.location.href = '/auth/login';
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                      }}
                      className={`${active ? 'bg-gray-700' : ''
                        } w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <Link
          href="/"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          Dashboard
        </Link>

        {/* Projects Section */}
        <div className="mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Projects
          </h3>
          <div className="space-y-1">
            {displayProjects.map((project) => (
              <Link
                key={project.id}
                href={project.ownerId === user?.id ? `/projects/${project.id}` : `/teams`}
                className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100 group"
              >
                <span className="w-2 h-2 rounded-full mr-3 bg-blue-500"></span>
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
            {hasMoreProjects && (
              <Link
                href="/projects"
                className="flex items-center px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-dark-100"
              >
                Show all projects...
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/projects"
            className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-3" />
            All Projects
          </Link>
          <Link
            href="/teams"
            className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
          >
            <UserGroupIcon className="h-5 w-5 mr-3" />
            Teams
          </Link>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 mt-auto">
        <Link
          href="/settings"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <Cog6ToothIcon className="h-5 w-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
}