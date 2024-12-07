import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { BadRequestException, ForbiddenException } from '../../shared/exceptions';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  create = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const project = await this.projectService.create({
      ...req.body,
      ownerId: userId,
    });

    res.status(201).json({
      status: 'success',
      data: { project },
    });
  });

  findAll = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user?.id;

    const filter = {
      $or: [{ ownerId: userId }, { members: userId }],
    };

    const projects = await this.projectService.findAllWithPagination(
      filter,
      Number(page),
      Number(limit)
    );

    res.json({
      status: 'success',
      data: { projects },
    });
  });

  findOne = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await this.projectService.findByIdWithDetails(projectId);

    if (!project) {
      throw new BadRequestException('Project not found');
    }


    if (!this.hasAccess(project, req.user?.id)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    res.json({
      status: 'success',
      data: { project },
    });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await this.projectService.findById(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (!this.hasAccess(project, req.user?.id)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const updatedProject = await this.projectService.update(id, req.body);

    res.json({
      status: 'success',
      data: { project: updatedProject },
    });
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await this.projectService.findById(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (!this.isOwner(project, req.user?.id)) {
      throw new ForbiddenException('Only the project owner can delete the project');
    }

    await this.projectService.delete(id);

    res.status(204).send();
  });

  addMember = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const project = await this.projectService.findById(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (!this.isOwner(project, req.user?.id)) {
      throw new ForbiddenException('Only the project owner can add members');
    }

    const updatedProject = await this.projectService.addMember(id, userId);

    res.json({
      status: 'success',
      data: { project: updatedProject },
    });
  });

  removeMember = catchAsync(async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const project = await this.projectService.findById(id);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (!this.isOwner(project, req.user?.id)) {
      throw new ForbiddenException('Only the project owner can remove members');
    }

    const updatedProject = await this.projectService.removeMember(id, userId);

    res.json({
      status: 'success',
      data: { project: updatedProject },
    });
  });

  private hasAccess(project: any, userId: string): boolean {
    if (!project || !userId) return false;

    return (project.ownerId.toString() === userId.toString()) || project.memberIds.some((memberId: any) => memberId.toString() === userId);
  }

  private isOwner(project: any, userId: string): boolean {
    if (!project || !userId) return false;
    return project.ownerId.toString() === userId;
  }
}
