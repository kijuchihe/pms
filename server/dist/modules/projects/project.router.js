"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validate_middleware_1 = require("../../shared/middleware/validate.middleware");
const cache_middleware_1 = require("../../shared/middleware/cache.middleware");
const project_validation_1 = require("./project.validation");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
// Apply authentication to all routes
router.use(auth_middleware_1.authenticate);
router
    .route('/')
    .get((0, cache_middleware_1.cache)({ ttl: 300 }), projectController.findAll)
    .post((0, validate_middleware_1.validateRequest)(project_validation_1.createProjectSchema), (0, cache_middleware_1.clearCache)('GET:*/projects*'), projectController.create);
router
    .route('/:projectId')
    .get(
// cache({
//   keyGenerator: (req) => `GET:project:${req.params.projectId}`,
//   ttl: 300
// }),
projectController.findOne)
    .put((0, validate_middleware_1.validateRequest)(project_validation_1.updateProjectSchema), (0, cache_middleware_1.clearCache)('GET:*/projects*'), projectController.update)
    .delete((0, cache_middleware_1.clearCache)('GET:*/projects*'), projectController.delete);
router
    .route('/:projectId/members')
    .post(projectController.addMember);
router
    .route('/:projectId/members/:userId')
    .delete(projectController.removeMember);
exports.default = router;
