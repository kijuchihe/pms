import { User } from '@/shared/types';
import { Task } from '@/shared/types';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  members: User[];
  tasks: ProjectTask[];
}

export interface ProjectTask extends Task {
  projectId: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Request/Response Types
export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
  memberIds?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  memberIds?: string[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}

// Response Types
export interface ProjectResponse extends Project {}
export interface TaskResponse extends ProjectTask {}
