"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("./task.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validate_middleware_1 = require("../../shared/middleware/validate.middleware");
const cache_middleware_1 = require("../../shared/middleware/cache.middleware");
const task_validation_1 = require("./task.validation");
const router = (0, express_1.Router)({ mergeParams: true }); // Enable access to parent router params
const taskController = new task_controller_1.TaskController();
router.use(auth_middleware_1.authenticate);
router
    .route('/')
    .get((0, cache_middleware_1.cache)({
    keyGenerator: (req) => `GET:project:${req.params.projectId}:tasks`,
    ttl: 300
}), taskController.findAllByProject)
    .post((0, validate_middleware_1.validateRequest)(task_validation_1.createTaskSchema), (0, cache_middleware_1.clearCache)('GET:*/tasks*'), taskController.create);
router
    .route('/:taskId')
    .get((0, cache_middleware_1.cache)({
    keyGenerator: (req) => `GET:task:${req.params.taskId}`,
    ttl: 300
}), taskController.findOne)
    .put((0, validate_middleware_1.validateRequest)(task_validation_1.updateTaskSchema), (0, cache_middleware_1.clearCache)('GET:*/tasks*'), taskController.update)
    .delete((0, cache_middleware_1.clearCache)('GET:*/tasks*'), taskController.delete);
router
    .route('/:taskId/status')
    .patch((0, validate_middleware_1.validateRequest)(task_validation_1.updateTaskStatusSchema), (0, cache_middleware_1.clearCache)('GET:*/tasks*'), taskController.updateStatus);
router
    .route('/:taskId/assign')
    .patch((0, cache_middleware_1.clearCache)('GET:*/tasks*'), taskController.assignTask);
exports.default = router;
