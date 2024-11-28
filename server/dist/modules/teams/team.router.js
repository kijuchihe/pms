"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("./team.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validate_middleware_1 = require("../../shared/middleware/validate.middleware");
const cache_middleware_1 = require("../../shared/middleware/cache.middleware");
const team_validation_1 = require("./team.validation");
const router = (0, express_1.Router)();
const teamController = new team_controller_1.TeamController();
// Apply authentication to all routes
router.use(auth_middleware_1.authenticate);
router
    .route('/')
    .get((0, cache_middleware_1.cache)({ ttl: 300 }), teamController.findAll)
    .post((0, validate_middleware_1.validateRequest)(team_validation_1.createTeamSchema), (0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.create);
router
    .route('/:teamId')
    .get(
// cache({
//   keyGenerator: (req) => `GET:team:${req.params.teamId}`,
//   ttl: 300
// }),
teamController.findOne)
    .put((0, validate_middleware_1.validateRequest)(team_validation_1.updateTeamSchema), (0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.update)
    .delete((0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.delete);
router.route('/:teamId/members')
    .post((0, validate_middleware_1.validateRequest)(team_validation_1.addMemberSchema), (0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.addMember);
router
    .route('/:teamId/members/:userId')
    .put((0, validate_middleware_1.validateRequest)(team_validation_1.updateMemberRoleSchema), (0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.updateMemberRole)
    .delete((0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.removeMember);
router.route('/:teamId/projects')
    .post((0, validate_middleware_1.validateRequest)(team_validation_1.addProjectSchema), (0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.addProject);
router
    .route('/:teamId/projects/:projectId')
    .delete((0, cache_middleware_1.clearCache)('GET:*/teams*'), teamController.removeProject);
exports.default = router;
