export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ApiResponse<T> {
  data: T | T[];
  message?: string;
  error?: ApiError;
  success?: boolean;
}

// Common API Response Types
export interface ItemApiResponse<T> extends ApiResponse<T> {
  data: T ;

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
  description?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members?: User[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
