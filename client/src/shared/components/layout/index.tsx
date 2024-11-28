'use client';

import { Sidebar } from './sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="ml-64 p-4 h-full">
        {children}
      </main>
    </>
  )
}
