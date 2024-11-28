"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProjectSchema = exports.updateMemberRoleSchema = exports.addMemberSchema = exports.updateTeamSchema = exports.createTeamSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const team_member_entity_1 = require("./team-member.entity");
const isValidObjectId = (value) => mongoose_1.Types.ObjectId.isValid(value);
exports.createTeamSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(3, 'Team name must be at least 3 characters long')
            .max(50, 'Team name must not exceed 50 characters'),
        description: zod_1.z.string()
            .min(10, 'Description must be at least 10 characters long')
            .max(500, 'Description must not exceed 500 characters')
            .optional(),
        members: zod_1.z.array(zod_1.z.string().refine(isValidObjectId, 'Invalid member ID')).optional(),
        projects: zod_1.z.array(zod_1.z.string().refine(isValidObjectId, 'Invalid project ID')).optional()
    })
});
exports.updateTeamSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(3, 'Team name must be at least 3 characters long')
            .max(50, 'Team name must not exceed 50 characters')
            .optional(),
        description: zod_1.z.string()
            .min(10, 'Description must be at least 10 characters long')
            .max(500, 'Description must not exceed 500 characters')
            .optional(),
        leaderId: zod_1.z.string().refine(isValidObjectId, 'Invalid leader ID').optional()
    }),
    params: zod_1.z.object({
        teamId: zod_1.z.string().refine(isValidObjectId, 'Invalid team ID')
    })
});
exports.addMemberSchema = zod_1.z.object({
    params: zod_1.z.object({
        teamId: zod_1.z.string().refine(isValidObjectId, 'Invalid team ID'),
    }),
    body: zod_1.z.object({
        userId: zod_1.z.string().refine(isValidObjectId, 'Invalid user ID'),
        role: zod_1.z.enum([team_member_entity_1.TeamRole.ADMIN, team_member_entity_1.TeamRole.MEMBER, team_member_entity_1.TeamRole.VIEWER])
            .optional()
            .default(team_member_entity_1.TeamRole.MEMBER)
    })
});
exports.updateMemberRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        teamId: zod_1.z.string().refine(isValidObjectId, 'Invalid team ID'),
        userId: zod_1.z.string().refine(isValidObjectId, 'Invalid user ID')
    }),
    body: zod_1.z.object({
        role: zod_1.z.enum([team_member_entity_1.TeamRole.ADMIN, team_member_entity_1.TeamRole.MEMBER, team_member_entity_1.TeamRole.VIEWER])
    })
});
exports.addProjectSchema = zod_1.z.object({
    params: zod_1.z.object({
        teamId: zod_1.z.string().refine(isValidObjectId, 'Invalid team ID'),
    }),
    body: zod_1.z.object({
        projectId: zod_1.z.string().refine(isValidObjectId, 'Invalid project ID'),
    })
});
