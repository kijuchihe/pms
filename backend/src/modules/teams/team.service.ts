import { Team, ITeam } from './team.entity';
import { TeamMember, TeamRole } from './team-member.entity';
import { BaseService } from '../../shared/utils/base.service';
import { 
  NotFoundException, 
  ConflictException,
  ForbiddenException 
} from '../../shared/exceptions';

export class TeamService extends BaseService<ITeam> {
  constructor() {
    super(Team);
  }

  async findByIdWithDetails(id: string): Promise<ITeam> {
    const team = await Team.findById(id)
      .populate({
        path: 'members',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('leader', 'name email')
      .populate('projects', 'name description status');

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async create(teamData: Partial<ITeam>, userId: string): Promise<ITeam> {
    const existingTeam = await Team.findOne({ name: teamData.name });
    if (existingTeam) {
      throw new ConflictException('Team name already exists');
    }

    // Set the creator as the leader
    teamData.leaderId = userId;

    const team = await Team.create(teamData);

    // Create TeamMember entry for the leader
    await TeamMember.create({
      teamId: team.id,
      userId,
      role: TeamRole.LEADER,
      invitedBy: userId
    });

    return team;
  }

  async update(id: string, updateData: Partial<ITeam>, userId: string): Promise<ITeam> {
    const team = await this.findById(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const teamMember = await TeamMember.findOne({ teamId: id, userId });
    if (!teamMember || ![TeamRole.LEADER, TeamRole.ADMIN].includes(teamMember.role)) {
      throw new ForbiddenException('Only team leader or admin can update team details');
    }

    if (updateData.name && updateData.name !== team.name) {
      const existingTeam = await Team.findOne({ name: updateData.name });
      if (existingTeam) {
        throw new ConflictException('Team name already exists');
      }
    }

    return await Team.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('leader', 'name email');
  }

  async addMember(teamId: string, userId: string, currentUserId: string, role: TeamRole = TeamRole.MEMBER): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if the current user has permission to add members
    const currentMember = await TeamMember.findOne({ teamId, userId: currentUserId });
    if (!currentMember || ![TeamRole.LEADER, TeamRole.ADMIN].includes(currentMember.role)) {
      throw new ForbiddenException('Only team leader or admin can add members');
    }

    // Check if user is already a member
    const existingMember = await TeamMember.findOne({ teamId, userId });
    if (existingMember) {
      throw new ConflictException('User is already a team member');
    }

    // Don't allow adding a member with LEADER role
    if (role === TeamRole.LEADER) {
      throw new ForbiddenException('Cannot add member with LEADER role');
    }

    // Create new team member
    await TeamMember.create({
      teamId,
      userId,
      role,
      invitedBy: currentUserId
    });

    return await this.findByIdWithDetails(teamId);
  }

  async updateMemberRole(teamId: string, userId: string, newRole: TeamRole, currentUserId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if the current user has permission
    const currentMember = await TeamMember.findOne({ teamId, userId: currentUserId });
    if (!currentMember || currentMember.role !== TeamRole.LEADER) {
      throw new ForbiddenException('Only team leader can update member roles');
    }

    // Don't allow changing to LEADER role
    if (newRole === TeamRole.LEADER) {
      throw new ForbiddenException('Cannot change member role to LEADER');
    }

    const memberToUpdate = await TeamMember.findOne({ teamId, userId });
    if (!memberToUpdate) {
      throw new NotFoundException('Team member not found');
    }

    // Update the role
    await TeamMember.updateOne(
      { teamId, userId },
      { $set: { role: newRole } }
    );

    return await this.findByIdWithDetails(teamId);
  }

  async removeMember(teamId: string, userId: string, currentUserId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if the current user has permission
    const currentMember = await TeamMember.findOne({ teamId, userId: currentUserId });
    if (!currentMember || ![TeamRole.LEADER, TeamRole.ADMIN].includes(currentMember.role)) {
      throw new ForbiddenException('Only team leader or admin can remove members');
    }

    const memberToRemove = await TeamMember.findOne({ teamId, userId });
    if (!memberToRemove) {
      throw new NotFoundException('Team member not found');
    }

    // Cannot remove the team leader
    if (memberToRemove.role === TeamRole.LEADER) {
      throw new ForbiddenException('Cannot remove team leader from the team');
    }

    await TeamMember.deleteOne({ teamId, userId });

    return await this.findByIdWithDetails(teamId);
  }

  async addProject(teamId: string, projectId: string, userId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if the user has permission
    const member = await TeamMember.findOne({ teamId, userId });
    if (!member || ![TeamRole.LEADER, TeamRole.ADMIN].includes(member.role)) {
      throw new ForbiddenException('Only team leader or admin can add projects');
    }

    // Check if project is already added
    if (team.projects.includes(projectId)) {
      throw new ConflictException('Project is already added to the team');
    }

    return await Team.findByIdAndUpdate(
      teamId,
      { $push: { projects: projectId } },
      { new: true }
    ).populate('projects', 'name description status');
  }

  async removeProject(teamId: string, projectId: string, userId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if the user has permission
    const member = await TeamMember.findOne({ teamId, userId });
    if (!member || ![TeamRole.LEADER, TeamRole.ADMIN].includes(member.role)) {
      throw new ForbiddenException('Only team leader or admin can remove projects');
    }

    return await Team.findByIdAndUpdate(
      teamId,
      { $pull: { projects: projectId } },
      { new: true }
    ).populate('projects', 'name description status');
  }
}
