import type { Project } from '$lib/server/database.js';

export interface PageData {
	projects: Project[];
	allTechnologies: string[];
	meta: {
		total: number;
		title: string;
		description: string;
	};
}
