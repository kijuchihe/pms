'use client';

import { Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Task, TaskPriority } from '@/shared/types';
import { tasksApi } from '@/shared/utils/api';

interface Props {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
}

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

export default function CreateTaskDialog({ projectId, open, onClose, onTaskCreated }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await tasksApi.create({
        ...data,
        projectId,
      });

      onTaskCreated?.(response.data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-dark px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-light-100">
                      Title
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-dark-100 p-4"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-light-100">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-light-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm  bg-dark-100"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-light-100">
                      Priority
                    </label>
                    <select
                      {...register('priority', { required: 'Priority is required' })}
                      className="mt-1 block w-full rounded-md border-light-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-dark-100 p-4"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-light-100">
                      Due Date
                    </label>
                    <input
                      type="date"
                      {...register('dueDate')}
                      className="mt-1 block w-full rounded-md border-light-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-dark-100 p-4"
                    />
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2 disabled:bg-gray-300"
                    >
                      {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-dark px-3 py-2 text-sm font-semibold text-light-100 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-dark-100 sm:col-start-1 sm:mt-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
