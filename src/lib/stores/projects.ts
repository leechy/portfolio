import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Re-export database types for compatibility
export type { Project } from '$lib/server/database.js';
export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';

import type { Project } from '$lib/server/database.js';

export interface ProjectsState {
  projects: Project[];
  featured: Project[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProjectsState = {
  projects: [],
  featured: [],
  loading: false,
  error: null
};

// Create the store
export const projectsStore = writable<ProjectsState>(initialState);

// Create reactive writable store with database operations
function createProjectsStore() {
  const { subscribe, set, update } = writable<Project[]>([]);

  return {
    subscribe,

    // Initialize by loading from API
    init: async () => {
      if (browser) {
        await loadProjects();
      }
    },

    // Create new project (calls API)
    create: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      update(projects => [...projects, newProject]);
      return newProject;
    },

    // Update existing project (calls API)
    updateById: async (
      id: number,
      projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
    ) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      update(projects => projects.map(project => (project.id === id ? updatedProject : project)));
      return updatedProject;
    },

    // Delete project by ID (calls API)
    deleteById: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      update(projects => projects.filter(project => project.id !== id));
      return true;
    },

    // Get project by ID
    getById: (id: number): Promise<Project | null> => {
      return fetch(`/api/projects/${id}`)
        .then(response => (response.ok ? response.json() : null))
        .catch(() => null);
    },

    // Load all projects
    loadAll: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      const projects = await response.json();
      set(projects);
      return projects;
    },

    // Reset store
    reset: () => set([])
  };
}

// Export the reactive projects store for admin interface
export const projects = createProjectsStore();

// Load projects data (async to make API calls)
export async function loadProjects(): Promise<void> {
  if (!browser) {
    return;
  }

  projectsStore.update(state => ({
    ...state,
    loading: true,
    error: null
  }));

  try {
    const response = await fetch('/api/projects');

    if (!response.ok) {
      throw new Error('Failed to load projects');
    }

    const allProjects = await response.json();
    const featuredProjects = allProjects.filter((project: Project) => project.featured);

    projectsStore.update(state => ({
      ...state,
      projects: allProjects,
      featured: featuredProjects,
      loading: false,
      error: null
    }));
  } catch (error) {
    projectsStore.update(state => ({
      ...state,
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to load projects'
    }));
  }
}

// Helper function to get projects by status
export function getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
  return fetch(`/api/projects?status=${status}`)
    .then(response => (response.ok ? response.json() : []))
    .catch(() => []);
}

// Helper function to get projects by technology
export function getProjectsByTechnology(technology: string): Promise<Project[]> {
  return fetch(`/api/projects?technology=${encodeURIComponent(technology)}`)
    .then(response => (response.ok ? response.json() : []))
    .catch(() => []);
}

// Helper function to search projects
export function searchProjects(query: string): Promise<Project[]> {
  return fetch(`/api/projects?search=${encodeURIComponent(query)}`)
    .then(response => (response.ok ? response.json() : []))
    .catch(() => []);
}

// Helper function to get project by ID (for detail pages)
export function getProjectById(id: number): Promise<Project | null> {
  return fetch(`/api/projects/${id}`)
    .then(response => (response.ok ? response.json() : null))
    .catch(() => null);
}

// Helper function to get project statistics
export async function getProjectStatistics(): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  featured: number;
}> {
  try {
    const response = await fetch('/api/projects/stats');
    if (!response.ok) {
      throw new Error('Failed to load statistics');
    }
    return response.json();
  } catch {
    return { total: 0, completed: 0, inProgress: 0, featured: 0 };
  }
}

// For backward compatibility - empty array since we're using database now
export const projectsData: Project[] = [];

// Helper function to get related projects
export async function getRelatedProjects(projectId: string | number): Promise<Project[]> {
  // This would need to be implemented as an API endpoint
  void projectId;
  return [];
}
