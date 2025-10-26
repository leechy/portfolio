import { ProjectService } from '$lib/server/projects.js';
import { building } from '$app/environment';

export const load = async () => {
	// During build time, return empty data to prevent SQLite access issues
	if (building) {
		return {
			projects: [],
			allTechnologies: [],
			meta: {
				total: 0,
				title: 'Projects - Leechy\'s Portfolio',
				description: 'Explore my development projects, technologies used, and the challenges I\'ve solved.'
			}
		};
	}

	try {
		const projectService = new ProjectService();
		
		// Get all projects directly from the service
		const allProjects = await projectService.getAllProjects();
		
		// Extract all unique technologies from projects
		const techSet = new Set<string>();
		allProjects.forEach(project => {
			project.technologies.forEach(tech => techSet.add(tech));
		});
		const allTechnologies = Array.from(techSet).sort();
		
		return {
			projects: allProjects,
			allTechnologies,
			meta: {
				total: allProjects.length,
				title: 'Projects - Leechy\'s Portfolio',
				description: 'Explore my development projects, technologies used, and the challenges I\'ve solved.'
			}
		};
	} catch {
		// If there's an error, return empty data but don't fail the page
		return {
			projects: [],
			allTechnologies: [],
			meta: {
				total: 0,
				title: 'Projects - Leechy\'s Portfolio',
				description: 'Explore my development projects, technologies used, and the challenges I\'ve solved.'
			}
		};
	}
};