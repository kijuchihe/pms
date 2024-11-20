import { Request, Response } from 'express';
import { TeamService } from './team.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { TeamRole } from './team-member.entity';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  findAll = catchAsync(async (req: Request, res: Response) => {
    const teams = await this.teamService.findAll();
    res.json(teams);
  });

  findOne = catchAsync(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const team = await this.teamService.findByIdWithDetails(teamId);
    res.json(team);
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const team = await this.teamService.create(req.body, userId);
    res.status(201).json(team);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user.id;
    const team = await this.teamService.update(teamId, req.body, userId);
    res.json(team);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const userId = req.user.id;
    await this.teamService.delete(teamId);
    res.status(204).end();
  });

  addMember = catchAsync(async (req: Request, res: Response) => {
    const { teamId, userId } = req.params;
    const { role = TeamRole.MEMBER } = req.body;
    const currentUserId = req.user.id;
    const team = await this.teamService.addMember(teamId, userId, currentUserId, role);
    res.json(team);
  });

  updateMemberRole = catchAsync(async (req: Request, res: Response) => {
    const { teamId, userId } = req.params;
    const { role } = req.body;
    const currentUserId = req.user.id;
    const team = await this.teamService.updateMemberRole(teamId, userId, role, currentUserId);
    res.json(team);
  });

  removeMember = catchAsync(async (req: Request, res: Response) => {
    const { teamId, userId } = req.params;
    const currentUserId = req.user.id;
    const team = await this.teamService.removeMember(teamId, userId, currentUserId);
    res.json(team);
  });

  addProject = catchAsync(async (req: Request, res: Response) => {
    const { teamId, projectId } = req.params;
    const userId = req.user.id;
    const team = await this.teamService.addProject(teamId, projectId, userId);
    res.json(team);
  });

  removeProject = catchAsync(async (req: Request, res: Response) => {
    const { teamId, projectId } = req.params;
    const userId = req.user.id;
    const team = await this.teamService.removeProject(teamId, projectId, userId);
    res.json(team);
  });
}
