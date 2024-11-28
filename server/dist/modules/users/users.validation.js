"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.getUserProjectsSchema = exports.getUserTeamsSchema = void 0;
const zod_1 = require("zod");
exports.getUserTeamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
    }),
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sort: zod_1.z.string().optional(),
    }).optional(),
});
exports.getUserProjectsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
    }),
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sort: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'archived', 'all']).optional(),
    }).optional(),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
    }),
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters').optional(),
        lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    }),
});
