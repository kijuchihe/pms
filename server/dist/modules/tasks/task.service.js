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
exports.TaskService = void 0;
const task_entity_1 = require("./task.entity");
const base_service_1 = require("../../shared/utils/base.service");
const exceptions_1 = require("../../shared/exceptions");
const project_service_1 = require("../projects/project.service");
class TaskService extends base_service_1.BaseService {
    constructor() {
        super(task_entity_1.Task);
        this.projectService = new project_service_1.ProjectService();
    }
    findByIdWithDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield task_entity_1.Task.findById(id)
                .populate('assigneeId', 'name email')
                .populate('createdBy', 'name email')
                .populate('projectId', 'name');
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            return task;
        });
    }
    findAllByProject(projectId_1) {
        return __awaiter(this, arguments, void 0, function* (projectId, filter = {}, page = 1, limit = 50) {
            const skip = (page - 1) * limit;
            const finalFilter = Object.assign(Object.assign({}, filter), { projectId });
            const [tasks, total] = yield Promise.all([
                task_entity_1.Task.find(finalFilter)
                    .populate('assigneeId', 'name email')
                    .populate('createdBy', 'name email')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                task_entity_1.Task.countDocuments(finalFilter),
            ]);
            return {
                tasks,
                total,
                page,
                pages: Math.ceil(total / limit),
            };
        });
    }
    findByProjectAndStatus(projectId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find({ projectId, status })
                .populate('assigneeId', 'name email')
                .sort({ updatedAt: -1 });
        });
    }
    create(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!taskData.projectId) {
                throw new exceptions_1.BadRequestException('Project ID is required');
            }
            if (!taskData.title) {
                throw new exceptions_1.BadRequestException('Task title is required');
            }
            // Set default status if not provided
            if (!taskData.status) {
                taskData.status = 'TODO';
            }
            return yield task_entity_1.Task.create(taskData);
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.findById(id);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            // Don't allow updating projectId or createdBy
            delete updateData.projectId;
            delete updateData.createdBy;
            const updatedTask = yield task_entity_1.Task.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate('assigneeId', 'name email');
            if (!updatedTask) {
                throw new exceptions_1.NotFoundException('Task not found after update');
            }
            return updatedTask;
        });
    }
    updateStatus(taskId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const task = yield this.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            // Only assignee or creator can update status
            if (((_a = task.assigneeId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId && ((_b = task.createdBy) === null || _b === void 0 ? void 0 : _b.toString()) !== userId) {
                throw new exceptions_1.ForbiddenException('Only assignee or creator can update task status');
            }
            // Validate status transition
            if (!this.isValidStatusTransition(task.status, status)) {
                throw new exceptions_1.BadRequestException(`Invalid status transition from ${task.status} to ${status}`);
            }
            return yield this.update(taskId, { status });
        });
    }
    assignTask(taskId, assigneeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const task = yield this.findById(taskId);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            // Only creator or current assignee can reassign task
            if (((_a = task.createdBy) === null || _a === void 0 ? void 0 : _a.toString()) !== userId && ((_b = task.assigneeId) === null || _b === void 0 ? void 0 : _b.toString()) !== userId) {
                throw new exceptions_1.ForbiddenException('Only task creator or current assignee can reassign tasks');
            }
            return yield this.update(taskId, { assigneeId: assigneeId });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.findById(id);
            if (!task) {
                throw new exceptions_1.NotFoundException('Task not found');
            }
            return yield task_entity_1.Task.findByIdAndDelete(id);
        });
    }
    updatePriority(taskId, priority, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.findById(taskId);
            if (!task)
                return null;
            // Check if user has access to the project
            const hasAccess = yield this.projectService.isUserMember(task.projectId.toString(), userId);
            if (!hasAccess)
                return null;
            return this.update(taskId, { priority });
        });
    }
    isValidStatusTransition(currentStatus, newStatus) {
        var _a;
        const validTransitions = {
            'TODO': ['IN_PROGRESS', 'CANCELLED'],
            'IN_PROGRESS': ['DONE', 'BLOCKED', 'TODO'],
            'BLOCKED': ['IN_PROGRESS', 'CANCELLED'],
            'DONE': ['IN_PROGRESS'],
            'CANCELLED': ['TODO']
        };
        return ((_a = validTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus)) || false;
    }
}
exports.TaskService = TaskService;
