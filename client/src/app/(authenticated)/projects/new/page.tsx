'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCreateProject } from '@/modules/projects/hooks/useCreateProject';
import { ProjectPriority } from '@/shared/types';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, isLoading, error } = useCreateProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'MEDIUM' as ProjectPriority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)

    await createProject({
      ...formData,
      startDate: new Date(formData.startDate).toISOString().split('T')[0],
      endDate: new Date(formData.endDate).toISOString().split('T')[0]
    });

  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter project description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 h-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </div>
  );
}
