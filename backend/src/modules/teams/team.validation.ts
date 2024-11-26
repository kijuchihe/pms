import { z } from 'zod';
import { Types } from 'mongoose';
import { TeamRole } from './team-member.entity';

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Team name must be at least 3 characters long')
      .max(50, 'Team name must not exceed 50 characters'),
    description: z.string()
      .min(10, 'Description must be at least 10 characters long')
      .max(500, 'Description must not exceed 500 characters')
      .optional(),
    members: z.array(z.string().refine(isValidObjectId, 'Invalid member ID')).optional(),
    projects: z.array(z.string().refine(isValidObjectId, 'Invalid project ID')).optional()
  })
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Team name must be at least 3 characters long')
      .max(50, 'Team name must not exceed 50 characters')
      .optional(),
    description: z.string()
      .min(10, 'Description must be at least 10 characters long')
      .max(500, 'Description must not exceed 500 characters')
      .optional(),
    leaderId: z.string().refine(isValidObjectId, 'Invalid leader ID').optional()
  }),
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID')
  })
});

export const addMemberSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID'),
  }),
  body: z.object({
    userId: z.string().refine(isValidObjectId, 'Invalid user ID'),
    role: z.enum([TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER])
      .optional()
      .default(TeamRole.MEMBER)
  })
});

export const updateMemberRoleSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID'),
    userId: z.string().refine(isValidObjectId, 'Invalid user ID')
  }),
  body: z.object({
    role: z.enum([TeamRole.ADMIN, TeamRole.MEMBER, TeamRole.VIEWER])
  })
});

export const addProjectSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidObjectId, 'Invalid team ID'),
  }),
  body: z.object({
    projectId: z.string().refine(isValidObjectId, 'Invalid project ID'),
  })
});
