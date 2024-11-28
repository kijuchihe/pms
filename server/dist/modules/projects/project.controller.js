"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const project_service_1 = require("./project.service");
const catch_async_1 = require("../../shared/utils/catch-async");
const exceptions_1 = require("../../shared/exceptions");
class ProjectController {
    constructor() {
        this.create = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new exceptions_1.BadRequestException('User ID is required');
            }
            const project = yield this.projectService.create(Object.assign(Object.assign({}, req.body), { ownerId: userId }));
            res.status(201).json({
                status: 'success',
                data: { project },
            });
        }));
        this.findAll = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page = 1, limit = 10 } = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const filter = {
                $or: [{ ownerId: userId }, { members: userId }],
            };
            const projects = yield this.projectService.findAllWithPagination(filter, Number(page), Number(limit));
            res.json({
                status: 'success',
                data: { projects },
            });
        }));
        this.findOne = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { projectId } = req.params;
            const project = yield this.projectService.findByIdWithDetails(projectId);
            if (!project) {
                throw new exceptions_1.BadRequestException('Project not found');
            }
            console.log('userId', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!this.hasAccess(project, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            res.json({
                status: 'success',
                data: { project },
            });
        }));
        this.update = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const project = yield this.projectService.findById(id);
            if (!project) {
                throw new exceptions_1.BadRequestException('Project not found');
            }
            if (!this.hasAccess(project, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const updatedProject = yield this.projectService.update(id, req.body);
            res.json({
                status: 'success',
                data: { project: updatedProject },
            });
        }));
        this.delete = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const project = yield this.projectService.findById(id);
            if (!project) {
                throw new exceptions_1.BadRequestException('Project not found');
            }
            if (!this.isOwner(project, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new exceptions_1.ForbiddenException('Only the project owner can delete the project');
            }
            yield this.projectService.delete(id);
            res.status(204).send();
        }));
        this.addMember = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            const { userId } = req.body;
            if (!userId) {
                throw new exceptions_1.BadRequestException('User ID is required');
            }
            const project = yield this.projectService.findById(id);
            if (!project) {
                throw new exceptions_1.BadRequestException('Project not found');
            }
            if (!this.isOwner(project, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new exceptions_1.ForbiddenException('Only the project owner can add members');
            }
            const updatedProject = yield this.projectService.addMember(id, userId);
            res.json({
                status: 'success',
                data: { project: updatedProject },
            });
        }));
        this.removeMember = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id, userId } = req.params;
            const project = yield this.projectService.findById(id);
            if (!project) {
                throw new exceptions_1.BadRequestException('Project not found');
            }
            if (!this.isOwner(project, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new exceptions_1.ForbiddenException('Only the project owner can remove members');
            }
            const updatedProject = yield this.projectService.removeMember(id, userId);
            res.json({
                status: 'success',
                data: { project: updatedProject },
            });
        }));
        this.projectService = new project_service_1.ProjectService();
    }
    hasAccess(project, userId) {
        if (!project || !userId)
            return false;
        console.log('project', project, 'userId', userId);
        return (project.ownerId.toString() === userId.toString()) || project.memberIds.some((memberId) => memberId.toString() === userId);
    }
    isOwner(project, userId) {
        if (!project || !userId)
            return false;
        return project.ownerId.toString() === userId;
    }
}
exports.ProjectController = ProjectController;
