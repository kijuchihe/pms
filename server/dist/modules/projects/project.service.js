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
exports.ProjectService = void 0;
const base_service_1 = require("../../shared/utils/base.service");
const project_entity_1 = require("./project.entity");
const exceptions_1 = require("../../shared/exceptions");
class ProjectService extends base_service_1.BaseService {
    constructor() {
        super(project_entity_1.Project);
    }
    findByIdWithDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield project_entity_1.Project
                .findById(id)
                .populate('owner', 'name email')
                .populate('members', 'name email')
                .populate('tasks', 'name description status assigneeId priority dueDate');
            if (!project) {
                throw new exceptions_1.NotFoundException('Project not found');
            }
            return project;
        });
    }
    findAllWithPagination() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [projects, total] = yield Promise.all([
                this.model
                    .find(filter)
                    .populate('ownerId', 'name email')
                    .populate('members.userId', 'name email')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                this.model.countDocuments(filter),
            ]);
            return {
                projects,
                total,
                page,
                pages: Math.ceil(total / limit),
            };
        });
    }
    findUserProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find({ $or: [{ ownerId: userId }, { memberIds: userId }] })
                .populate('owner', 'name email')
                .populate('members', 'name email')
                .populate('tasks', 'title description status priority dueDate assigneeId');
        });
    }
    addMember(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.findByIdWithDetails(projectId);
            if (!project) {
                throw new exceptions_1.NotFoundException('Project not found');
            }
            // Check if user is already a member
            if (project.memberIds.some(member => member.toString() === userId)) {
                throw new exceptions_1.BadRequestException('User is already a member of this project');
            }
            project.memberIds.push(userId);
            return yield project.save();
        });
    }
    removeMember(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.findByIdWithDetails(projectId);
            if (!project) {
                throw new exceptions_1.NotFoundException('Project not found');
            }
            project.memberIds = project.memberIds.filter(memberId => memberId.toString() !== userId);
            return yield project.save();
        });
    }
    isUserMember(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.findByIdWithDetails(projectId);
            if (!project)
                return false;
            return (project.ownerId.toString() === userId.toString() ||
                project.memberIds.some(memberId => memberId.toString() === userId.toString()));
        });
    }
}
exports.ProjectService = ProjectService;
