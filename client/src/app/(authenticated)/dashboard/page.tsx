'use client'

import { useStore } from '@/shared/store/useStore'
import Link from 'next/link'

export default function Home() {
  const projects = useStore(state => state.projects)
  const threeProjects = projects?.slice(0, 3);
  const stats = [
    { name: 'Total Projects', stat: projects?.length || 0 },
    { name: 'Active Tasks', stat: '24 (Dummy data)' },
    { name: 'Team Members', stat: '3 (Dummy data)' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold leading-6 text-light-100">Last 30 days</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-dark-100 px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-light-100">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-light">{item.stat}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-light">Recent Projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {threeProjects?.map((project) => (
            <li key={project.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white dark:bg-dark-100 shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-light">Project {project.name}</h3>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-light-100">12 tasks</p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <Link
                      href={`/projects/${project.id}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-light"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
