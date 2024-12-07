;
import { TeamService } from '../teams/team.service';
import { ProjectService } from '../projects/project.service';
import { FilterQuery } from 'mongoose';
import { BaseService } from '../../shared/utils/base.service';
import { IUser, User } from '../auth/auth.entity';

export class UserService extends BaseService<IUser> {
  private teamService: TeamService;
  private projectService: ProjectService;

  constructor() {
    super(User);
    this.teamService = new TeamService();
    this.projectService = new ProjectService();
  }


  async getUserTeams(userId: string, query?: any) {
    const teams = await this.teamService.getUserTeams(userId);
    return teams;
  }

  async searchUsers(query?: any) {
    const filter: FilterQuery<IUser> = {};

    if (query?.status && query.status !== 'all') {
      filter.status = query.status;
    }
    const users = await this.model.find(filter);
    return users;
  }

  async getUserProjects(userId: string, query?: any) {
    const filter: FilterQuery<IUser> = { owner: userId };

    if (query?.status && query.status !== 'all') {
      filter.status = query.status;
    }

    const projects = await this.projectService.findUserProjects(userId);

    return projects;
  }

  async updateUser(userId: string, updateData: Partial<IUser>) {
    const user = await this.model.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}