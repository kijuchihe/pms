import { Router } from 'express';
import { TeamController } from './team.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate.middleware';
import { cache, clearCache } from '../../shared/middleware/cache.middleware';
import {
  createTeamSchema,
  updateTeamSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  addProjectSchema
} from './team.validation';

const router = Router();
const teamController = new TeamController();

// Apply authentication to all routes
router.use(authenticate);

router
  .route('/')
  .get(
    cache({ ttl: 300 }),
    teamController.findAll
  )
  .post(
    validateRequest(createTeamSchema),
    clearCache('GET:*/teams*'),
    teamController.create
  );

router
  .route('/:teamId')
  .get(
    // cache({
    //   keyGenerator: (req) => `GET:team:${req.params.teamId}`,
    //   ttl: 300
    // }),
    teamController.findOne
  )
  .put(
    validateRequest(updateTeamSchema),
    clearCache('GET:*/teams*'),
    teamController.update
  )
  .delete(
    clearCache('GET:*/teams*'),
    teamController.delete
  );

router.route('/:teamId/members')
  .post(
    validateRequest(addMemberSchema),
    clearCache('GET:*/teams*'),
    teamController.addMember
  );

router
  .route('/:teamId/members/:userId')
  .put(
    validateRequest(updateMemberRoleSchema),
    clearCache('GET:*/teams*'),
    teamController.updateMemberRole
  )
  .delete(
    clearCache('GET:*/teams*'),
    teamController.removeMember
  );


router.route('/:teamId/projects')
  .post(
    validateRequest(addProjectSchema),
    clearCache('GET:*/teams*'),
    teamController.addProject
  );

router
  .route('/:teamId/projects/:projectId')
  .delete(
    clearCache('GET:*/teams*'),
    teamController.removeProject
  );

export default router;
