import mongoose, { FilterQuery } from 'mongoose';
import { BaseService } from '../../shared/utils/base.service';
import { Project, IProject } from './project.entity';
import { NotFoundException, BadRequestException } from '../../shared/exceptions';

export class ProjectService extends BaseService<IProject> {
  constructor() {
    super(Project);
  }

  async findByIdWithDetails(id: string): Promise<IProject> {
    const project = await Project
      .findById(id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks', 'name description status assigneeId priority dueDate');

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findAllWithPagination(
    filter: FilterQuery<IProject> = {},
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.model
        .find(filter)
        .populate('ownerId', 'name email')
        .populate('members.userId', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.model.countDocuments(filter),
    ]);

    return {
      projects,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findUserProjects(userId: string): Promise<IProject[]> {
    return this.model
      .find({ $or: [{ ownerId: userId }, { memberIds: userId }] })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks', 'title description status priority dueDate assigneeId');
  }

  async addMember(projectId: string, userId: string): Promise<IProject> {
    const project = await this.findByIdWithDetails(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is already a member
    if (project.memberIds.some(member => member.toString() === userId)) {
      throw new BadRequestException('User is already a member of this project');
    }

    project.memberIds.push(userId as unknown as mongoose.Schema.Types.ObjectId);
    return await project.save();
  }

  async removeMember(projectId: string, userId: string): Promise<IProject> {
    const project = await this.findByIdWithDetails(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.memberIds = project.memberIds.filter(
      memberId => memberId.toString() !== userId
    );

    return await project.save();
  }

  async isUserMember(projectId: string, userId: string): Promise<boolean> {
    const project = await this.findByIdWithDetails(projectId);
    if (!project) return false;

    return (
      project.ownerId.toString() === userId.toString() ||
      project.memberIds.some(memberId => memberId.toString() === userId.toString())
    );
  }
}
