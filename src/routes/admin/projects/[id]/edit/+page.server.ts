import { ProjectService } from '$lib/server/projects.js';
import { building } from '$app/environment';
import { error } from '@sveltejs/kit';
export const load = async ({ params }: { params: { id: string } }) => {
  // Don't access database during build
  if (building) {
    return {
      project: null
    };
  }

  try {
    const projectService = new ProjectService();
    const projectId = parseInt(params.id);

    if (isNaN(projectId)) {
      throw error(404, 'Invalid project ID');
    }

    const project = projectService.getProjectById(projectId);

    if (!project) {
      throw error(404, 'Project not found');
    }

    return {
      project
    };
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    throw error(500, 'Failed to load project');
  }
};
