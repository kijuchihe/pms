import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate.middleware';
import { cache, clearCache } from '../../shared/middleware/cache.middleware';
import { createProjectSchema, updateProjectSchema } from './project.validation';

const router = Router();
const projectController = new ProjectController();

// Apply authentication to all routes
router.use(authenticate);

router
  .route('/')
  .get(cache({ ttl: 300 }), projectController.findAll)
  .post(
    validateRequest(createProjectSchema),
    clearCache('GET:*/projects*'),
    projectController.create
  );

router
  .route('/:projectId')
  .get(
    // cache({
    //   keyGenerator: (req) => `GET:project:${req.params.projectId}`,
    //   ttl: 300
    // }),
    projectController.findOne
  )
  .put(
    validateRequest(updateProjectSchema),
    clearCache('GET:*/projects*'),
    projectController.update
  )
  .delete(
    clearCache('GET:*/projects*'),
    projectController.delete
  );

router
  .route('/:projectId/members')
  .post(projectController.addMember);

router
  .route('/:projectId/members/:userId')
  .delete(projectController.removeMember);

export default router;
