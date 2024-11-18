import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { ProjectService } from '../projects/project.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { 
  BadRequestException, 
  NotFoundException, 
  ForbiddenException 
} from '../../shared/exceptions';

export class TaskController {
  private taskService: TaskService;
  private projectService: ProjectService;

  constructor() {
    this.taskService = new TaskService();
    this.projectService = new ProjectService();
  }

  create = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user?.id;

    if (!projectId || !userId) {
      throw new BadRequestException('Project ID and user ID are required');
    }

    // Check if user has access to the project
    const project = await this.projectService.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!await this.projectService.isUserMember(projectId, userId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const task = await this.taskService.create({
      ...req.body,
      projectId,
      createdBy: userId,
    });

    res.status(201).json({
      status: 'success',
      data: { task },
    });
  });

  findAllByProject = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { page = 1, limit = 50, status } = req.query;
    const userId = req.user?.id;

    if (!projectId || !userId) {
      throw new BadRequestException('Project ID and user ID are required');
    }

    // Check if user has access to the project
    if (!await this.projectService.isUserMember(projectId, userId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const filter = status ? { status } : {};
    const tasks = await this.taskService.findAllByProject(
      projectId,
      filter,
      Number(page),
      Number(limit)
    );

    res.json({
      status: 'success',
      data: { tasks },
    });
  });

  findOne = catchAsync(async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const userId = req.user?.id;

    if (!projectId || !taskId || !userId) {
      throw new BadRequestException('Project ID, task ID, and user ID are required');
    }

    // Check if user has access to the project
    if (!await this.projectService.isUserMember(projectId, userId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const task = await this.taskService.findByIdWithDetails(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId.toString() !== projectId) {
      throw new BadRequestException('Task does not belong to this project');
    }

    res.json({
      status: 'success',
      data: { task },
    });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const userId = req.user?.id;

    if (!projectId || !taskId || !userId) {
      throw new BadRequestException('Project ID, task ID, and user ID are required');
    }

    // Check if user has access to the project
    if (!await this.projectService.isUserMember(projectId, userId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId.toString() !== projectId) {
      throw new BadRequestException('Task does not belong to this project');
    }

    const updatedTask = await this.taskService.update(taskId, req.body);

    res.json({
      status: 'success',
      data: { task: updatedTask },
    });
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { projectId, taskId } = req.params;
    const userId = req.user?.id;

    if (!projectId || !taskId || !userId) {
      throw new BadRequestException('Project ID, task ID, and user ID are required');
    }

    // Check if user has access to the project
    if (!await this.projectService.isUserMember(projectId, userId)) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.projectId.toString() !== projectId) {
      throw new BadRequestException('Task does not belong to this project');
    }

    await this.taskService.delete(taskId);

    res.status(204).send();
  });

  updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!taskId || !userId || !status) {
      throw new BadRequestException('Task ID, user ID, and status are required');
    }

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.taskService.updateStatus(taskId, status, userId);

    res.json({
      status: 'success',
      data: { task: updatedTask },
    });
  });

  assignTask = catchAsync(async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user?.id;

    if (!taskId || !userId || !assigneeId) {
      throw new BadRequestException('Task ID, user ID, and assignee ID are required');
    }

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.taskService.assignTask(taskId, assigneeId, userId);

    res.json({
      status: 'success',
      data: { task: updatedTask },
    });
  });
}
