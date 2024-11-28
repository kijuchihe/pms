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
exports.TaskController = void 0;
const task_service_1 = require("./task.service");
const project_service_1 = require("../projects/project.service");
const catch_async_1 = require("../../shared/utils/catch-async");
const exceptions_1 = require("../../shared/exceptions");
class TaskController {
    constructor() {
        this.create = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!projectId || !userId) {
                throw new exceptions_1.BadRequestException('Project ID and user ID are required');
            }
            // Check if user has access to the project
            const project = yield this.projectService.findById(projectId);
            if (!project) {
                throw new exceptions_1.NotFoundException('Project not found');
            }
            if (!(yield this.projectService.isUserMember(projectId, userId))) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const task = yield this.taskService.create(Object.assign(Object.assign({}, req.body), { createdBy: userId }));
            res.status(201).json({
                status: 'success',
                data: { task },
                message: 'Task created successfully',
            });
        }));
        this.findAllByProject = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId } = req.params;
            const { page = 1, limit = 50, status } = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!projectId || !userId) {
                throw new exceptions_1.BadRequestException('Project ID and user ID are required');
            }
            // Check if user has access to the project
            if (!(yield this.projectService.isUserMember(projectId, userId))) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const filter = status ? { status } : {};
            const tasks = yield this.taskService.findAllByProject(projectId, filter, Number(page), Number(limit));
            res.json({
                status: 'success',
                data: { tasks },
            });
        }));
        this.findOne = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId, taskId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!projectId || !taskId || !userId) {
                throw new exceptions_1.BadRequestException('Project ID, task ID, and user ID are required');
            }
            // Check if user has access to the project
            if (!(yield this.projectService.isUserMember(projectId, userId))) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const task = yield this.taskService.findByIdWithDetails(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            if (task.projectId.toString() !== projectId) {
                throw new exceptions_1.BadRequestException('Task does not belong to this project');
            }
            res.json({
                status: 'success',
                data: { task },
            });
        }));
        this.update = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { taskId } = req.params;
            const { projectId } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!projectId || !taskId || !userId) {
                throw new exceptions_1.BadRequestException('Project ID, task ID, and user ID are required');
            }
            // Check if user has access to the project
            if (!(yield this.projectService.isUserMember(projectId, userId))) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const task = yield this.taskService.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            if (task.projectId.toString() !== projectId) {
                throw new exceptions_1.BadRequestException('Task does not belong to this project');
            }
            const updatedTask = yield this.taskService.update(taskId, req.body);
            res.json({
                status: 'success',
                data: { task: updatedTask },
            });
        }));
        this.delete = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId, taskId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!projectId || !taskId || !userId) {
                throw new exceptions_1.BadRequestException('Project ID, task ID, and user ID are required');
            }
            // Check if user has access to the project
            if (!(yield this.projectService.isUserMember(projectId, userId))) {
                throw new exceptions_1.ForbiddenException('You do not have access to this project');
            }
            const task = yield this.taskService.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            if (task.projectId.toString() !== projectId) {
                throw new exceptions_1.BadRequestException('Task does not belong to this project');
            }
            yield this.taskService.delete(taskId);
            res.status(204).send();
        }));
        this.updateStatus = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { taskId } = req.params;
            const { status } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!taskId || !userId || !status) {
                throw new exceptions_1.BadRequestException('Task ID, user ID, and status are required');
            }
            const task = yield this.taskService.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            const updatedTask = yield this.taskService.updateStatus(taskId, status, userId);
            res.json({
                status: 'success',
                data: { task: updatedTask },
            });
        }));
        this.assignTask = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { taskId } = req.params;
            const { assigneeId } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!taskId || !userId || !assigneeId) {
                throw new exceptions_1.BadRequestException('Task ID, user ID, and assignee ID are required');
            }
            const task = yield this.taskService.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            const updatedTask = yield this.taskService.assignTask(taskId, assigneeId, userId);
            res.json({
                status: 'success',
                data: { task: updatedTask },
            });
        }));
        this.taskService = new task_service_1.TaskService();
        this.projectService = new project_service_1.ProjectService();
    }
}
exports.TaskController = TaskController;
