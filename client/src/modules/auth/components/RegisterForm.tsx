'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { authApi } from '@/shared/utils/api';
import { useStore } from '@/shared/store/useStore';
import { Disclosure, DisclosureButton, Transition } from '@headlessui/react';
import { GoogleIcon, FacebookIcon, GithubIcon } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui/button';
import { clsx } from 'clsx';
import { handleError } from '@/shared/utils/handleError';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const response = await authApi.register({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName });
      document.cookie = `token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
      setUser(response.data.user);
      router.push('/');
    } catch (err) {
      handleError(err, undefined, setError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First name
          </label>
          <input
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            })}
            type="text"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName?.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="sr-only">
            Last name
          </label>
          <input
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            })}
            type="text"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName?.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
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
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
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
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            type="password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password?.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm password
          </label>
          <input
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
            type="password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword?.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Register
        </Button>
      </div>
      <Disclosure as="div" className="mt-6">
        {({ open }) => (
          <>
            <DisclosureButton className={clsx(
              'flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white',
              open ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            )}>
              <span className="mr-2">Or register with</span>
              <GoogleIcon />
              <FacebookIcon />
              <GithubIcon />
            </DisclosureButton>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Disclosure.Panel className="mt-3 space-y-2">
                <Button type="button" className="w-full" onClick={() => { }}>
                  Login with Google
                </Button>
                <Button type="button" className="w-full" onClick={() => { }}>
                  Login with Facebook
                </Button>
                <Button type="button" className="w-full" onClick={() => { }}>
                  Login with GitHub
                </Button>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </form>)
}
