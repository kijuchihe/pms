'use client'
import { Fragment } from 'react';
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

export function Sidebar() {
  const user = useStore(state => state.user)

  return (
    <div className="w-64 bg-dark text-white flex flex-col fixed top-0 left-0 h-screen">
      {/* Account Dropdown */}
      <div className="p-4">
        <Menu as="div" className="relative z-50">
          <MenuButton className="w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-dark-100">
            <span>Current Account</span>
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
                {/* Teams Section */}
                <div className="px-4 py-2 text-xs text-gray-400">Your teams</div>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? 'bg-gray-700' : ''
                        } block px-4 py-2 text-sm`}
                    >
                      Team 1
                    </a>
                  )}
                </MenuItem>
                {/* Personal Account */}
                <div className="px-4 py-2 text-xs text-gray-400">Personal account</div>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`${active ? 'bg-gray-700' : ''
                        } block px-4 py-2 text-sm`}
                    >
                      Your Account
                    </a>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-dark-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link
          href="/teams"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          My Teams
        </Link>

        {/* Projects Section */}
        <div className="py-4">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Projects
          </h3>
          <div className="mt-2 space-y-1">
            {/* Project list will be mapped here */}
            <Link
              href="/projects/1"
              className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
            >
              Project 1
            </Link>
            <Link
              href="/projects"
              className="flex items-center px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-dark-100"
            >
              Show more...
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-dark-100">
        <Link
          href="/settings"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <Cog6ToothIcon className="h-5 w-5 mr-3" />
          Settings
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
          onClick={() => authApi.logout()}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </Link>
        <Link
          href="/invite"
          className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-dark-100"
        >
          <UserGroupIcon className="h-5 w-5 mr-3" />
          Invite Members
        </Link>
      </div>
    </div>
  );
}