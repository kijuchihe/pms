'use client';

import { Fragment } from 'react'
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useStore } from '../../store/useStore'
import { useThemeStore } from '../../store/useThemeStore'
import Link from 'next/link'
import { clsx } from 'clsx'
import { authApi } from '../../utils/api';
import { Sidebar } from './sidebar';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tasks', href: '/tasks' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user)
  const { theme, toggleTheme } = useThemeStore()
  console.log(user)

  return (
    <>
      <Sidebar />
      <main className="ml-64 px-4 bg-light dark:bg-dark h-full">
        {children}
      </main>
    </>
  )
}
