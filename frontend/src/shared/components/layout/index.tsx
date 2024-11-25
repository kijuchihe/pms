'use client';

import { useStore } from '../../store/useStore'
import { Sidebar } from './sidebar';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tasks', href: '/tasks' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user)

  return (
    <>
      <Sidebar />
      <main className="ml-64 p-4 h-full">
        {children}
      </main>
    </>
  )
}
