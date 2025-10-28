import { error, json } from '@sveltejs/kit';
import { ProjectService } from '$lib/server/projects.js';
import type { RequestHandler } from './$types';

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw error(400, 'Invalid project ID');
    }

    const project = await projectService.getProjectById(id);
    if (!project) {
      throw error(404, 'Project not found');
    }

    return json(project);
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    return json({ error: 'Failed to fetch project' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw error(400, 'Invalid project ID');
    }

    const projectData = await request.json();
    const updatedProject = await projectService.updateProject(id, projectData);

    if (!updatedProject) {
      throw error(404, 'Project not found');
    }

    return json(updatedProject);
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    return json({ error: 'Failed to update project' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw error(400, 'Invalid project ID');
    }

    const success = await projectService.deleteProject(id);
    if (!success) {
      throw error(404, 'Project not found');
    }

    return json({ success: true });
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    return json({ error: 'Failed to delete project' }, { status: 500 });
  }
};
