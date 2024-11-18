import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    memberIds: z.array(z.string()).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: z
      .enum(['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
      .optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    memberIds: z.array(z.string()).optional(),
  }),
});
