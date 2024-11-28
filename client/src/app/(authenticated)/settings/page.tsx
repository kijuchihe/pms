'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useStore } from '@/shared/store/useStore';
import { userApi, authApi } from '@/shared/utils/api';
import {
  Cog6ToothIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import { handleError } from '@/shared/utils/handleError';

export default function SettingsPage() {
  const { user, setUser } = useStore(state => ({ user: state.user, setUser: state.setUser }));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const response = await userApi.updateUser(user?.id as string, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });

      setUser(response.data.data.user);
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await userApi.deleteUser(user?.id as string);
      await authApi.logout();
      router.push('/auth/login');
    } catch (error) {
      handleError(error, router);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Profile Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserCircleIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Cog6ToothIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">
                  Toggle between light and dark themes
                </p>
              </div>
              <Button variant="outline">
                Toggle Theme
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive email notifications for important updates
                </p>
              </div>
              <Button variant="outline">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheckIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              Update Password
            </Button>
          </form>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h2>
        <div className="bg-white dark:bg-dark-100 rounded-lg p-6 border-2 border-red-500">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-red-500"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}