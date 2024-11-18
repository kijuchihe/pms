import { create } from 'zustand';
import { User, Project, Task } from '../types';

interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  currentProject: null,
  
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  
  updateTask: (projectId, taskId, updates) =>
    set((state) => ({
      projects: state.projects.map((project) => {
        if (project.id !== projectId) return project;
        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      }),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            tasks: state.currentProject.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          }
        : state.currentProject,
    })),
}));
