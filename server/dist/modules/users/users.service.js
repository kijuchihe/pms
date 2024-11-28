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
exports.UserService = void 0;
;
const team_service_1 = require("../teams/team.service");
const project_service_1 = require("../projects/project.service");
const base_service_1 = require("../../shared/utils/base.service");
const auth_entity_1 = require("../auth/auth.entity");
class UserService extends base_service_1.BaseService {
    constructor() {
        super(auth_entity_1.User);
        this.teamService = new team_service_1.TeamService();
        this.projectService = new project_service_1.ProjectService();
    }
    getUserTeams(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield this.teamService.getUserTeams(userId);
            return teams;
        });
    }
    getUserProjects(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { owner: userId };
            if ((query === null || query === void 0 ? void 0 : query.status) && query.status !== 'all') {
                filter.status = query.status;
            }
            const projects = yield this.projectService.findUserProjects(userId);
            return projects;
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
}
exports.UserService = UserService;
