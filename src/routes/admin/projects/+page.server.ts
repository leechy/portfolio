import { ProjectService } from '$lib/server/projects.js';
import { building } from '$app/environment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Don't access database during build
  if (building) {
    return {
      projects: []
    };
  }

  try {
    const projectService = new ProjectService();
    const projects = projectService.getAllProjects();

    return {
      projects
    };
  } catch {
    // Return empty array on error
    return {
      projects: []
    };
  }
};
