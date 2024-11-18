import { FilterQuery } from 'mongoose';
import { Task, ITask } from './task.entity';
import { BaseService } from '../../shared/utils/base.service';
import { 
  NotFoundException, 
  BadRequestException,
  ForbiddenException 
} from '../../shared/exceptions';
import { ProjectService } from '../projects/project.service';

export class TaskService extends BaseService<ITask> {
  private projectService: ProjectService;

  constructor() {
    super(Task);
    this.projectService = new ProjectService();
  }

  async findByIdWithDetails(id: string): Promise<ITask> {
    const task = await Task.findById(id)
      .populate('assigneeId', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'name');

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findAllByProject(
    projectId: string,
    filter: any = {},
    page = 1,
    limit = 50
  ) {
    const skip = (page - 1) * limit;
    const finalFilter = { ...filter, projectId };

    const [tasks, total] = await Promise.all([
      Task.find(finalFilter)
        .populate('assigneeId', 'name email')
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Task.countDocuments(finalFilter),
    ]);

    return {
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findByProjectAndStatus(projectId: string, status: ITask['status']) {
    return this.model
      .find({ projectId, status })
      .populate('assigneeId', 'name email')
      .sort({ updatedAt: -1 });
  }

  async create(taskData: Partial<ITask>): Promise<ITask> {
    if (!taskData.projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!taskData.title) {
      throw new BadRequestException('Task title is required');
    }

    // Set default status if not provided
    if (!taskData.status) {
      taskData.status = 'TODO';
    }

    return await Task.create(taskData);
  }

  async update(id: string, updateData: Partial<ITask>): Promise<ITask> {
    const task = await this.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Don't allow updating projectId or createdBy
    delete updateData.projectId;
    delete updateData.createdBy;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('assigneeId', 'name email');

    if (!updatedTask) {
      throw new NotFoundException('Task not found after update');
    }

    return updatedTask;
  }

  async updateStatus(taskId: string, status: string, userId: string): Promise<ITask> {
    const task = await this.findById(taskId);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Only assignee or creator can update status
    if (task.assigneeId?.toString() !== userId && task.createdBy?.toString() !== userId) {
      throw new ForbiddenException('Only assignee or creator can update task status');
    }

    // Validate status transition
    if (!this.isValidStatusTransition(task.status, status)) {
      throw new BadRequestException(`Invalid status transition from ${task.status} to ${status}`);
    }

    return await this.update(taskId, { status });
  }

  async assignTask(taskId: string, assigneeId: string, userId: string): Promise<ITask> {
    const task = await this.findById(taskId);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Only creator or current assignee can reassign task
    if (task.createdBy?.toString() !== userId && task.assigneeId?.toString() !== userId) {
      throw new ForbiddenException('Only task creator or current assignee can reassign tasks');
    }

    return await this.update(taskId, { assigneeId });
  }

  async delete(id: string): Promise<void> {
    const task = await this.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await Task.findByIdAndDelete(id);
  }

  async updatePriority(
    taskId: string,
    priority: ITask['priority'],
    userId: string
  ): Promise<ITask | null> {
    const task = await this.findById(taskId);
    if (!task) return null;

    // Check if user has access to the project
    const hasAccess = await this.projectService.isUserMember(
      task.projectId.toString(),
      userId
    );
    if (!hasAccess) return null;

    return this.update(taskId, { priority });
  }

  private isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: { [key: string]: string[] } = {
      'TODO': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['DONE', 'BLOCKED', 'TODO'],
      'BLOCKED': ['IN_PROGRESS', 'CANCELLED'],
      'DONE': ['IN_PROGRESS'],
      'CANCELLED': ['TODO']
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
