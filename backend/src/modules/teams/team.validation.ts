import { z } from 'zod';
import { Types } from 'mongoose';

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Team name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    members: z.array(z.string().refine(isValidObjectId, 'Invalid member ID')).optional(),
    projects: z.array(z.string().refine(isValidObjectId, 'Invalid project ID')).optional()
  })
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Team name must be at least 3 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    leaderId: z.string().refine(isValidObjectId, 'Invalid leader ID').optional()
  }),
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID')
  })
});

export const addMemberSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID'),
    userId: z.string().refine(isValidObjectId, 'Invalid user ID')
  })
});

export const addProjectSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID'),
    projectId: z.string().refine(isValidObjectId, 'Invalid project ID')
  })
});
