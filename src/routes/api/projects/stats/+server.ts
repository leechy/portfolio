import { json } from '@sveltejs/kit';
import { ProjectService } from '$lib/server/projects.js';
import type { RequestHandler } from './$types';

const projectService = new ProjectService();

export const GET: RequestHandler = async () => {
  try {
    const allProjects = await projectService.getAllProjects();

    const stats = {
      total: allProjects.length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      inProgress: allProjects.filter(p => p.status === 'in-progress').length,
      featured: allProjects.filter(p => p.featured).length
    };

    return json(stats);
  } catch {
    return json({ error: 'Failed to fetch project statistics' }, { status: 500 });
  }
};
