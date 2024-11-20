import { Team, ITeam } from './team.entity';
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
      .populate('leader', 'name email')
      .populate('members', 'name email')
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
    // Add the leader to members if not already included
    teamData.members = teamData.members || [];
    if (!teamData.members.includes(userId)) {
      teamData.members.push(userId);
    }

    return await Team.create(teamData);
  }

  async update(id: string, updateData: Partial<ITeam>, userId: string): Promise<ITeam> {
    const team = await this.findById(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only team leader can update team details
    if (team.leaderId.toString() !== userId) {
      throw new ForbiddenException('Only team leader can update team details');
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

  async addMember(teamId: string, userId: string, currentUserId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only team leader can add members
    if (team.leaderId.toString() !== currentUserId) {
      throw new ForbiddenException('Only team leader can add members');
    }

    // Check if user is already a member
    if (team.members.includes(userId)) {
      throw new ConflictException('User is already a team member');
    }

    return await Team.findByIdAndUpdate(
      teamId,
      { $push: { members: userId } },
      { new: true }
    ).populate('members', 'name email');
  }

  async removeMember(teamId: string, userId: string, currentUserId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only team leader can remove members
    if (team.leaderId.toString() !== currentUserId) {
      throw new ForbiddenException('Only team leader can remove members');
    }

    // Cannot remove the team leader
    if (userId === team.leaderId.toString()) {
      throw new ForbiddenException('Cannot remove team leader from the team');
    }

    return await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: userId } },
      { new: true }
    ).populate('members', 'name email');
  }

  async addProject(teamId: string, projectId: string, userId: string): Promise<ITeam> {
    const team = await this.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Only team leader can add projects
    if (team.leaderId.toString() !== userId) {
      throw new ForbiddenException('Only team leader can add projects');
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

    // Only team leader can remove projects
    if (team.leaderId.toString() !== userId) {
      throw new ForbiddenException('Only team leader can remove projects');
    }

    return await Team.findByIdAndUpdate(
      teamId,
      { $pull: { projects: projectId } },
      { new: true }
    ).populate('projects', 'name description status');
  }
}
