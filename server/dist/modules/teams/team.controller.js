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
exports.TeamController = void 0;
const team_service_1 = require("./team.service");
const catch_async_1 = require("../../shared/utils/catch-async");
const team_member_entity_1 = require("./team-member.entity");
class TeamController {
    constructor() {
        this.findAll = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const teams = yield this.teamService.findAll();
            res.json(teams);
        }));
        this.findOne = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId } = req.params;
            const team = yield this.teamService.findByIdWithDetails(teamId);
            res.json(team);
        }));
        this.create = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const team = yield this.teamService.create(req.body, userId);
            res.status(201).json(team);
        }));
        this.update = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId } = req.params;
            const userId = req.user.id;
            const team = yield this.teamService.update(teamId, req.body, userId);
            res.json(team);
        }));
        this.delete = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId } = req.params;
            const userId = req.user.id;
            yield this.teamService.delete(teamId);
            res.status(204).end();
        }));
        this.addMember = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId } = req.params;
            const { role = team_member_entity_1.TeamRole.MEMBER, userId } = req.body;
            const currentUserId = req.user.id;
            const team = yield this.teamService.addMember(teamId, userId, currentUserId, role);
            res.json(team);
        }));
        this.updateMemberRole = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId, userId } = req.params;
            const { role } = req.body;
            const currentUserId = req.user.id;
            const team = yield this.teamService.updateMemberRole(teamId, userId, role, currentUserId);
            res.json(team);
        }));
        this.removeMember = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId, userId } = req.params;
            const currentUserId = req.user.id;
            const team = yield this.teamService.removeMember(teamId, userId, currentUserId);
            res.json(team);
        }));
        this.addProject = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId } = req.params;
            const projectId = req.body.projectId;
            const userId = req.user.id;
            const team = yield this.teamService.addProject(teamId, projectId, userId);
            res.json({ message: 'Project added successfully', data: team, status: 'success' });
        }));
        this.removeProject = (0, catch_async_1.catchAsync)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { teamId, projectId } = req.params;
            const userId = req.user.id;
            const team = yield this.teamService.removeProject(teamId, projectId, userId);
            res.json({ message: 'Project removed successfully', data: team, status: 'success' });
        }));
        this.teamService = new team_service_1.TeamService();
    }
}
exports.TeamController = TeamController;
