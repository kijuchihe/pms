import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Project, Task } from '../types';

interface ITeam {
  name: string;
  description: string;
  leaderId: string;
  projects: string[];
  members: string[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  teams: ITeam[]
  setUser: (user: User | null) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setTeams: (teams: ITeam[]) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      projects: [],
      currentProject: null,
      teams: [],

      setUser: (user) => set({ user }),
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setTeams: (teams) => set({ teams }),

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
        })),
    }),
    {
      name: 'app-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // (optional) specify which parts of state to persist
        user: state.user,
        projects: state.projects,
        teams: state.teams,
        // currentProject: state.currentProject,
      }),
    }
  )
);