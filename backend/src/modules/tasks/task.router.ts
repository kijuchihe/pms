import { Router } from 'express';
import { TaskController } from './task.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate.middleware';
import { cache, clearCache } from '../../shared/middleware/cache.middleware';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from './task.validation';

const router = Router({ mergeParams: true }); // Enable access to parent router params
const taskController = new TaskController();

router.use(authenticate);

router
  .route('/')
  .get(
    cache({
      key: (req) => `GET:project:${req.params.projectId}:tasks`,
      ttl: 300
    }),
    taskController.findAllByProject
  )
  .post(
    validateRequest(createTaskSchema),
    clearCache('GET:*/tasks*'),
    taskController.create
  );

router
  .route('/:taskId')
  .get(
    cache({
      key: (req) => `GET:task:${req.params.taskId}`,
      ttl: 300
    }),
    taskController.findOne
  )
  .put(
    validateRequest(updateTaskSchema),
    clearCache('GET:*/tasks*'),
    taskController.update
  )
  .delete(
    clearCache('GET:*/tasks*'),
    taskController.delete
  );

router
  .route('/:taskId/status')
  .patch(
    validateRequest(updateTaskStatusSchema),
    clearCache('GET:*/tasks*'),
    taskController.updateStatus
  );

router
  .route('/:taskId/assign')
  .patch(
    clearCache('GET:*/tasks*'),
    taskController.assignTask
  );

export default router;
