import { Router } from 'express';
import { UserController } from './users.controller';
// import { validateRequest } from '@/middleware/validate-request';
import { getUserTeamsSchema, getUserProjectsSchema, updateUserSchema } from './users.validation';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate.middleware';
// import { authenticate } from '@/middleware/authenticate';
// import { authorize } from '@/middleware/authorize';

const usersRouter = Router();
const userController = new UserController();

usersRouter.use(authenticate); // Protect all routes

// Get user teams
usersRouter.get(
  '/:userId/teams',
  validateRequest(getUserTeamsSchema),
  // authorize(['ADMIN', 'OWNER']), // Only admin or the user themselves can access
  userController.getUserTeams
);

// Get user projects
usersRouter.get(
  '/:userId/projects',
  validateRequest(getUserProjectsSchema),
  // authorize(['ADMIN', 'OWNER']),
  userController.getUserProjects
);

usersRouter.get(
  '/search',
  userController.searchUsers
)

// Update user profile
usersRouter.patch(
  '/:userId',
  validateRequest(updateUserSchema),
  // authorize(['ADMIN', 'OWNER']),
  userController.updateUser
);

export default usersRouter;