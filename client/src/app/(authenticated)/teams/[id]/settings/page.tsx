'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teamsApi } from '@/shared/utils/api';
import { Button } from '@/shared/components/ui/button';
import { useTeamDetail } from '@/modules/teams/hooks/useTeamDetail';
import { handleError } from '@/shared/utils/handleError';
// import { useTeamDetail } from '@/modules/teams/hooks/useTeamDetail';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { userApi } from '@/shared/utils/api';
import { User } from '@/shared/types';
import { toast } from 'react-hot-toast';

export default function TeamSettings() {

  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const { team, isLoading } = useTeamDetail(teamId);
  // const { team: t } = useTeamDetail(id as string);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleUserSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await userApi.searchUsers(query);
      // Filter out users who are already members
      const filteredUsers = response.data.data.users.filter(
        (user: User) => !team?.members.some((member: Partial<User>) => member.id === user.id && member.id !== team.leaderId)
      );

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const addMember = async (userId: string) => {
    try {
      await teamsApi.addMember(team?.id as string, userId);
      toast.success('Member added successfully');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  };

  const removeMember = async (userId: string) => {
    try {
      await teamsApi.removeMember(team?.id as string, userId);
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

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
      <section className="mb-8" id='members'>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <Button onClick={() => setIsOpen(true)}>Add Member</Button>
        </div>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <div className="space-y-4">
            {team.members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {member.firstName?.[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{member.firstName} {member.lastName}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
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
                  <Button variant="destructive" onClick={() => removeMember(member.id as string)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Member Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white dark:bg-dark-100 p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">Add Team Member</Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-dark-200"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleUserSearch(e.target.value);
                }}
              />
            </div>

            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="text-center py-4 text-gray-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.firstName?.[0]}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addMember(user.id)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-4 text-gray-500">No users found</div>
              ) : null}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Danger Zone */}
      <section id='danger-zone'>
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