import axios from 'axios';
import { ItemApiResponse, PaginationParams } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
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

    }
  },
  register: (registerData: { firstName: string, lastName: string, email: string, password: string }) =>
    api.post('/auth/register', registerData),
  logout: () => {
    axios.defaults.headers['authorization'] = ``
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict';
    localStorage.removeItem('token');
  },
};

// Teams APIs
export const teamsApi = {
  getAll: (params?: PaginationParams) => api.get('/teams'),
  getById: (id: string) => api.get(`/teams/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post('/teams', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/teams/${id}`, data),
  delete: (id: string) => api.delete(`/teams/${id}`),
};


// Projects APIs
export const projectsApi = {
  getAll: (params?: PaginationParams) => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description: string }) =>
    api.post('/projects', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Tasks APIs
export const tasksApi = {
  create: (projectId: string, data: {
    title: string;
    description: string;
    assigneeId?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }) => api.post(`/projects/${projectId}/tasks`, data),
  update: (projectId: string, taskId: string, data: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'todo' | 'in-progress' | 'done';
  }) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  delete: (projectId: string, taskId: string) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),
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
    console.log('Data', response.data)
    return response.data
  },
  updateUser: (userId: string, data: Partial<any>) => api.put(`/users/${userId}`, data),
}