"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const users_validation_1 = require("./users.validation");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validate_middleware_1 = require("../../shared/middleware/validate.middleware");
const usersRouter = (0, express_1.Router)();
const userController = new users_controller_1.UserController();
usersRouter.use(auth_middleware_1.authenticate); // Protect all routes
// Get user teams
usersRouter.get('/:userId/teams', (0, validate_middleware_1.validateRequest)(users_validation_1.getUserTeamsSchema), 
// authorize(['ADMIN', 'OWNER']), // Only admin or the user themselves can access
userController.getUserTeams);
// Get user projects
usersRouter.get('/:userId/projects', (0, validate_middleware_1.validateRequest)(users_validation_1.getUserProjectsSchema), 
// authorize(['ADMIN', 'OWNER']),
userController.getUserProjects);
usersRouter.get('/search', userController.searchUsers);
// Update user profile
usersRouter.patch('/:userId', (0, validate_middleware_1.validateRequest)(users_validation_1.updateUserSchema), 
// authorize(['ADMIN', 'OWNER']),
userController.updateUser);
exports.default = usersRouter;
