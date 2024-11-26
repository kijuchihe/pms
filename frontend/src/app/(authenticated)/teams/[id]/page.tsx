'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teamsApi } from '@/shared/utils/api';
import { Team, Project, User } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import {
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCookie } from '@/shared/utils/delete-cookie';
import { AxiosError } from 'axios';

interface TeamStats {
  totalProjects: number;
  totalMembers: number;
  completedProjects: number;
  activeProjects: number;
}

export default function TeamDashboard() {
  const [team, setTeam] = useState<Team | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMembers, setRecentMembers] = useState<User[]>([]);
  const [stats, setStats] = useState<TeamStats>({
    totalProjects: 0,
    totalMembers: 0,
    completedProjects: 0,
    activeProjects: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        const response = await teamsApi.getById(teamId);

        const teamData = response.data;
        setTeam(teamData);

        // Set stats
        const projects = teamData.projects || [];
        setStats({
          totalProjects: projects.length,
          totalMembers: (teamData.members || []).length,
          completedProjects: projects.filter((p: Project) => p.status === 'COMPLETED').length,
          activeProjects: projects.filter((p: Project) => p.status === 'IN_PROGRESS').length,
        });

        // Set recent projects and members
        setRecentProjects(projects.slice(0, 3));
        setRecentMembers((teamData.members || []).slice(0, 5));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch team details');
        if (error instanceof AxiosError) {
          if (error.status === 401) {
            deleteCookie('token')
            router.replace('/auth/login?from=/teams')
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
          <p className="text-gray-500">{team.description}</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push(`/teams/${teamId}/projects/new`)}>
            New Project
          </Button>
          <Link href={`/teams/${teamId}/settings`}>
            <Button variant="outline">
              <Cog6ToothIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <FolderIcon className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <UsersIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-500">Team Members</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <ChartBarIcon className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <ChartBarIcon className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-500">Completed Projects</p>
              <p className="text-2xl font-bold">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Projects</h2>
          <Link
            href={`/teams/${teamId}/projects`}
            className="text-blue-500 hover:text-blue-600"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/teams/${teamId}/projects/${project.id}`)}
            >
              <h3 className="font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
                  }`}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Team Members</h2>
          <Link
            href={`/teams/${teamId}/settings#members`}
            className="text-blue-500 hover:text-blue-600"
          >
            Manage Members
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {recentMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {member.firstName?.[0]}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {member.role || 'Member'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}