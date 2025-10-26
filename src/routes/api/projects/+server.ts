import { json } from '@sveltejs/kit';
import { ProjectService } from '$lib/server/projects.js';
import type { RequestHandler } from './$types';
import type { ProjectStatus } from '$lib/stores/projects.js';

const projectService = new ProjectService();

export const GET: RequestHandler = async ({ url }) => {
	try {
		const status = url.searchParams.get('status');
		const search = url.searchParams.get('search');

		let projects;

		if (status) {
			projects = await projectService.getProjectsByStatus(status as ProjectStatus);
		} else if (search) {
			projects = await projectService.searchProjects(search);
		} else {
			projects = await projectService.getAllProjects();
		}

		return json(projects);
	} catch {
		return json({ error: 'Failed to fetch projects' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const projectData = await request.json();
		const newProject = await projectService.createProject(projectData);
		return json(newProject, { status: 201 });
	} catch {
		return json({ error: 'Failed to create project' }, { status: 500 });
	}
};
