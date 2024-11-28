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
exports.TeamService = void 0;
const team_entity_1 = require("./team.entity");
const team_member_entity_1 = require("./team-member.entity");
const base_service_1 = require("../../shared/utils/base.service");
const exceptions_1 = require("../../shared/exceptions");
class TeamService extends base_service_1.BaseService {
    constructor() {
        super(team_entity_1.Team);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return team_entity_1.Team.find()
                .populate('leader', 'name email')
                .populate('projects', 'name description status');
        });
    }
    findByIdWithDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield team_entity_1.Team.findById(id)
                .populate({
                path: 'members',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
                .populate('leader', 'name email')
                .populate('projects', 'name description status members leaderId createdAt updatedAt startDate endDate');
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            return team;
        });
    }
    create(teamData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTeam = yield team_entity_1.Team.findOne({ name: teamData.name });
            if (existingTeam) {
                throw new exceptions_1.ConflictException('Team name already exists');
            }
            // Set the creator as the leader
            teamData.leaderId = userId;
            const team = yield team_entity_1.Team.create(teamData);
            // Create TeamMember entry for the leader
            yield team_member_entity_1.TeamMember.create({
                teamId: team.id,
                userId,
                role: team_member_entity_1.TeamRole.LEADER,
                invitedBy: userId
            });
            return team;
        });
    }
    update(id, updateData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findById(id);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            const teamMember = yield team_member_entity_1.TeamMember.findOne({ teamId: id, userId });
            if (!teamMember || ![team_member_entity_1.TeamRole.LEADER, team_member_entity_1.TeamRole.ADMIN].includes(teamMember.role)) {
                throw new exceptions_1.ForbiddenException('Only team leader or admin can update team details');
            }
            if (updateData.name && updateData.name !== team.name) {
                const existingTeam = yield team_entity_1.Team.findOne({ name: updateData.name });
                if (existingTeam) {
                    throw new exceptions_1.ConflictException('Team name already exists');
                }
            }
            return yield team_entity_1.Team.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate('leader', 'name email');
        });
    }
    addMember(teamId_1, userId_1, currentUserId_1) {
        return __awaiter(this, arguments, void 0, function* (teamId, userId, currentUserId, role = team_member_entity_1.TeamRole.MEMBER) {
            const team = yield this.findById(teamId);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            // Check if the current user has permission to add members
            const currentMember = yield team_member_entity_1.TeamMember.findOne({ teamId, userId: currentUserId });
            if (!currentMember || ![team_member_entity_1.TeamRole.LEADER, team_member_entity_1.TeamRole.ADMIN].includes(currentMember.role)) {
                throw new exceptions_1.ForbiddenException('Only team leader or admin can add members');
            }
            // Check if user is already a member
            const existingMember = yield team_member_entity_1.TeamMember.findOne({ teamId, userId });
            if (existingMember) {
                throw new exceptions_1.ConflictException('User is already a team member');
            }
            // Don't allow adding a member with LEADER role
            if (role === team_member_entity_1.TeamRole.LEADER) {
                throw new exceptions_1.ForbiddenException('Cannot add member with LEADER role');
            }
            // Create new team member
            yield team_member_entity_1.TeamMember.create({
                teamId,
                userId,
                role,
                invitedBy: currentUserId
            });
            return yield this.findByIdWithDetails(teamId);
        });
    }
    updateMemberRole(teamId, userId, newRole, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findById(teamId);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            // Check if the current user has permission
            const currentMember = yield team_member_entity_1.TeamMember.findOne({ teamId, userId: currentUserId });
            if (!currentMember || currentMember.role !== team_member_entity_1.TeamRole.LEADER) {
                throw new exceptions_1.ForbiddenException('Only team leader can update member roles');
            }
            // Don't allow changing to LEADER role
            if (newRole === team_member_entity_1.TeamRole.LEADER) {
                throw new exceptions_1.ForbiddenException('Cannot change member role to LEADER');
            }
            const memberToUpdate = yield team_member_entity_1.TeamMember.findOne({ teamId, userId });
            if (!memberToUpdate) {
                throw new exceptions_1.NotFoundException('Team member not found');
            }
            // Update the role
            yield team_member_entity_1.TeamMember.updateOne({ teamId, userId }, { $set: { role: newRole } });
            return yield this.findByIdWithDetails(teamId);
        });
    }
    removeMember(teamId, userId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findById(teamId);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            // Check if the current user has permission
            const currentMember = yield team_member_entity_1.TeamMember.findOne({ teamId, userId: currentUserId });
            if (!currentMember || ![team_member_entity_1.TeamRole.LEADER, team_member_entity_1.TeamRole.ADMIN].includes(currentMember.role)) {
                throw new exceptions_1.ForbiddenException('Only team leader or admin can remove members');
            }
            const memberToRemove = yield team_member_entity_1.TeamMember.findOne({ teamId, userId });
            if (!memberToRemove) {
                throw new exceptions_1.NotFoundException('Team member not found');
            }
            // Cannot remove the team leader
            if (memberToRemove.role === team_member_entity_1.TeamRole.LEADER) {
                throw new exceptions_1.ForbiddenException('Cannot remove team leader from the team');
            }
            yield team_member_entity_1.TeamMember.deleteOne({ teamId, userId });
            return yield this.findByIdWithDetails(teamId);
        });
    }
    addProject(teamId, projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findById(teamId);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            // Check if the user has permission
            const member = yield team_member_entity_1.TeamMember.findOne({ teamId, userId });
            if (!member || ![team_member_entity_1.TeamRole.LEADER, team_member_entity_1.TeamRole.ADMIN].includes(member.role)) {
                throw new exceptions_1.ForbiddenException('Only team leader or admin can add projects');
            }
            // Check if project is already added
            if (team.projects.includes(projectId)) {
                throw new exceptions_1.ConflictException('Project is already added to the team');
            }
            return yield team_entity_1.Team.findByIdAndUpdate(teamId, { $push: { projects: projectId } }, { new: true }).populate('projects', 'name description status');
        });
    }
    removeProject(teamId, projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield this.findById(teamId);
            if (!team) {
                throw new exceptions_1.NotFoundException('Team not found');
            }
            // Check if the user has permission
            const member = yield team_member_entity_1.TeamMember.findOne({ teamId, userId });
            if (!member || ![team_member_entity_1.TeamRole.LEADER, team_member_entity_1.TeamRole.ADMIN].includes(member.role)) {
                throw new exceptions_1.ForbiddenException('Only team leader or admin can remove projects');
            }
            return yield team_entity_1.Team.findByIdAndUpdate(teamId, { $pull: { projects: projectId } }, { new: true }).populate('projects', 'name description status');
        });
    }
    getUserTeams(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield team_entity_1.Team.find({ $or: [{ leaderId: userId }, { members: userId }] })
                .populate('leader', 'name email')
                .populate('projects', 'name description status');
        });
    }
}
exports.TeamService = TeamService;
