import axios from 'axios';
import { PaginationParams } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  logout: () => {
    localStorage.removeItem('token');
  },
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
