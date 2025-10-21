import { writable } from 'svelte/store';

export type ProjectStatus = 'planning' | 'development' | 'completed' | 'maintenance';

export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	status: ProjectStatus;
	featured: boolean;
	githubUrl?: string;
	demoUrl?: string;
	imageUrl?: string;
	startDate?: Date;
	completionDate?: Date;
}

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

// Mock data for development (will be replaced with real data source later)
const mockProjectsData: Project[] = [
	{
		id: 'portfolio-website',
		title: 'Portfolio Website',
		description:
			'A modern portfolio website built with SvelteKit, featuring responsive design and optimized performance.',
		technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Vite'],
		status: 'completed',
		featured: true,
		githubUrl: 'https://github.com/leechy/portfolio',
		demoUrl: 'https://leechy.dev',
		startDate: new Date('2024-01-15'),
		completionDate: new Date('2024-03-01')
	},
	{
		id: 'task-management-app',
		title: 'Task Management App',
		description:
			'A collaborative task management application with real-time updates and team collaboration features.',
		technologies: ['Node.js', 'SQLite', 'WebSocket', 'Express'],
		status: 'completed',
		featured: true,
		githubUrl: 'https://github.com/leechy/task-manager',
		startDate: new Date('2023-09-01'),
		completionDate: new Date('2023-12-15')
	},
	{
		id: 'ecommerce-platform',
		title: 'E-commerce Platform',
		description:
			'Full-featured e-commerce platform with payment integration and inventory management.',
		technologies: ['SvelteKit', 'PostgreSQL', 'Stripe', 'TypeScript'],
		status: 'development',
		featured: false,
		githubUrl: 'https://github.com/leechy/ecommerce',
		startDate: new Date('2024-06-01')
	},
	{
		id: 'weather-dashboard',
		title: 'Weather Dashboard',
		description:
			'Interactive weather dashboard with forecasting and historical data visualization.',
		technologies: ['React', 'D3.js', 'Node.js', 'Weather API'],
		status: 'completed',
		featured: false,
		githubUrl: 'https://github.com/leechy/weather-dashboard',
		demoUrl: 'https://weather.leechy.dev',
		startDate: new Date('2023-05-01'),
		completionDate: new Date('2023-07-30')
	}
];

// Load projects data (async to simulate API calls)
export async function loadProjects(): Promise<void> {
	projectsStore.update(state => ({
		...state,
		loading: true,
		error: null
	}));

	try {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 150));

		// Filter featured projects
		const featuredProjects = mockProjectsData.filter(project => project.featured);

		// Update store with loaded data
		projectsStore.update(state => ({
			...state,
			projects: mockProjectsData,
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
export function getProjectsByStatus(status: ProjectStatus): Project[] {
	return mockProjectsData.filter(project => project.status === status);
}

// Helper function to get projects by technology
export function getProjectsByTechnology(technology: string): Project[] {
	return mockProjectsData.filter(project => project.technologies.includes(technology));
}

// Helper function to get project statistics
export function getProjectStatistics(): {
	total: number;
	completed: number;
	inDevelopment: number;
	featured: number;
} {
	const total = mockProjectsData.length;
	const completed = mockProjectsData.filter(p => p.status === 'completed').length;
	const inDevelopment = mockProjectsData.filter(p => p.status === 'development').length;
	const featured = mockProjectsData.filter(p => p.featured).length;

	return { total, completed, inDevelopment, featured };
}
