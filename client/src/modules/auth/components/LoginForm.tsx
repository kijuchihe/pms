'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/utils/api';
import { useStore } from '@/shared/store/useStore';
import { FacebookIcon, GithubIcon, GoogleIcon } from '@/shared/components/icons';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

const AuthFormInput = ({ register, errors, name, label, placeholder }: { register: any; errors: any; name: any; label: any; placeholder: any }) => {
  return <div>
    <label htmlFor="email" className="text-dark dark:text-light">
      {label}
    </label>
    <input
      {...register(name, {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      })}
      type="email"
      className="outline-none rounded-lg relative block w-full px-3 p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder={placeholder}
    />
    {errors.email && (
      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
    )}
  </div>



}

export default function LoginForm() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      const response = await authApi.login(data.email, data.password);
      setUser(response.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="rounded-md shadow-sm space-y-2">
        <div>
          <label htmlFor="email" className="text-dark dark:text-light">
            Email address
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="outline-none rounded-lg relative block w-full px-3 p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            className="outline-none rounded-lg relative block w-full p-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <button
          type="button"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          <FacebookIcon />
          Sign in with Facebook
        </button>
        <button
          type="button"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dark hover:bg-dark-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-600"
        >
          <GithubIcon />
          Sign in with GitHub
        </button>
      </div>
    </form>
  );
}
