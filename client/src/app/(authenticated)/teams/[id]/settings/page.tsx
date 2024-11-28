'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teamsApi } from '@/shared/utils/api';
import { Button } from '@/shared/components/ui/button';
import { useTeamDetail } from '@/modules/teams/hooks/useTeamDetail';
import { handleError } from '@/shared/utils/handleError';

export default function TeamSettings() {

  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const { team, isLoading } = useTeamDetail(teamId);


  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      await teamsApi.delete(teamId);
      router.push('/teams');
    } catch (error) {
      handleError(error, router, setError);
    }
  };

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Team Settings</h1>

      {/* General Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <input
                type="text"
                className="w-full p-2 bg-dark-200 rounded"
                value={team.name}
                onChange={() => { }}
                placeholder="Team Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 bg-dark-200 rounded"
                value={team.description}
                onChange={() => { }}
                placeholder="Team Description"
                rows={3}
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <div className="space-y-4">
            {team.members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{member.firstName} {member.lastName}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    className="p-2 bg-dark-200 rounded"
                    value={member.role}
                    onChange={() => { }}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Button variant="destructive">Remove</Button>
                </div>
              </div>
            ))}
            <Button>Add Member</Button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6 border-2 border-red-500">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Delete Team</h3>
              <p className="text-sm text-gray-500">
                Once you delete a team, there is no going back. Please be certain.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteTeam} className='bg-red-500'>
              Delete Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}