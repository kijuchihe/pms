import axios from 'axios';
import { PaginationParams, TaskPriority, TaskStatus, User } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  const token = (typeof window !== 'undefined' ? document.cookie : '') // Get token from cookies in browser
    .split(';')
    .find((c) => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      document.cookie = `token=${response.data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
      return response.data
    } catch (error) {
      throw error
    }
  },
  register: async (registerData: { firstName: string, lastName: string, email: string, password: string }) => {
    try {
      const response = await api.post('/auth/register', registerData)
      document.cookie = `token=${response.data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
      return response.data
    } catch (error) {
      throw error
    }
  },
  logout: async () => {
    axios.defaults.headers['authorization'] = ``
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
    localStorage.removeItem('token');
  },
};

// Teams APIs
export const teamsApi = {
  getAll: (params?: PaginationParams) => api.get('/teams', { params }),
  getById: (id: string) => api.get(`/teams/${id}`),
  addProject: (teamId: string, projectId: string) =>
    api.post(`/teams/${teamId}/projects`, { projectId }),
  create: (data: { name: string; description: string }) =>
    api.post('/teams', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
};

// type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
// Projects APIs
export const projectsApi = {
  getAll: (params?: PaginationParams) => api.get('/projects', {
    params
  }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description: string, startDate?: string, endDate: string, ownerId: string }) =>
    api.post('/projects', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Tasks APIs

type CreateTask = {
  title: string;
  description: string;
  assigneeId?: string;
  dueDate?: string;
  priority: TaskPriority;
  projectId: string;
}
export const tasksApi = {
  create: (data: CreateTask) => api.post(`/tasks`, data),
  update: (taskId: string, data: Partial<CreateTask & { status?: TaskStatus }>) => api.put(`/tasks/${taskId}`, data),
  delete: (taskId: string) =>
    api.delete(`/tasks/${taskId}`),
};


export const userApi = {
  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    console.log('Data', response.data)
    return response.data
  },
  getUserTeams: (userId: string) => api.get(`/users/${userId}/teams`),
  getUserProjects: async (userId: string) => {
    const response = await api.get(`/users/${userId}/projects`)
    return response.data
  },
  updateUser: (userId: string, data: Partial<User>) => api.put(`/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
}