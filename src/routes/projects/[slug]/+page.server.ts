import { error } from '@sveltejs/kit';
import { ProjectService } from '$lib/server/projects.js';
import { building } from '$app/environment';
export const load = async ({ params }: { params: { slug: string } }) => {
  // During build time, return empty data to prevent SQLite access issues
  if (building) {
    return {
      project: null,
      relatedProjects: [],
      meta: {
        title: 'Project Not Found',
        description: 'Project details not available'
      }
    };
  }

  try {
    const projectService = new ProjectService();
    const { slug } = params;

    if (!slug) {
      throw error(404, 'Project not found');
    }

    // Get the project by ID (slug is used as ID in this case)
    const project = await projectService.getProjectById(parseInt(slug));

    if (!project) {
      throw error(404, 'Project not found');
    }

    // Get related projects (projects with similar technologies, excluding current)
    const allProjects = await projectService.getAllProjects();
    const relatedProjects = allProjects
      .filter(p => p.id !== project.id)
      .filter(p => p.technologies.some(tech => project.technologies.includes(tech)))
      .slice(0, 3);

    return {
      project,
      relatedProjects,
      meta: {
        title: `${project.title} - Leechy's Portfolio`,
        description: project.description
      }
    };
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    throw error(500, 'Failed to load project');
  }
};
