import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    dueDate: z.string().date().optional(),
    assigneeId: z.string().optional(),
    projectId: z.string().min(1, 'Project ID is required'),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().optional(),
  }),
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
  }),
});
