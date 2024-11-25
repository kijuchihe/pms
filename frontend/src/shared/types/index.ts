export interface User {
  id: string;
  firstName: string;
  lstName: string;
  email: string;
  avatar?: string;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER' | 'LEADER';

export interface ApiResponse<T> {
  data: T | T[];
  message?: string;
  error?: ApiError;
  success?: boolean;
}

// Common API Response Types
export interface ItemApiResponse<T> extends ApiResponse<T> {
  data: T;
}

export interface ListApiResponse<T> extends ApiResponse<T> {
  data: T[]
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common Filter Types
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SearchFilter {
  query?: string;
}

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
  tasks: Task[];
}
export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

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
export interface ProjectResponse extends Project { }
export interface TaskResponse extends Task { }



export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
