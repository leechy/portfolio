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
	// User Story 2 enhanced fields
	challenges?: string[];
	solutions?: string[];
	skillsDemonstrated?: string[];
	content?: string; // Rendered HTML or markdown content
	relatedProjects?: string[]; // IDs of related projects
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
		completionDate: new Date('2024-03-01'),
		challenges: [
			'Implementing responsive design that works across all device sizes',
			'Optimizing performance for fast loading times',
			'Creating an accessible and SEO-friendly structure',
			'Balancing modern design with professional appearance'
		],
		solutions: [
			'Used Tailwind CSS utility classes for consistent responsive breakpoints',
			'Implemented lazy loading and image optimization with SvelteKit',
			'Added proper semantic HTML and ARIA labels throughout',
			'Created a clean, minimal design system with professional color palette'
		],
		skillsDemonstrated: [
			'Frontend Development',
			'Responsive Design',
			'Performance Optimization',
			'SEO Implementation',
			'TypeScript Development'
		],
		content: `# Portfolio Website Development

This project showcases modern web development practices using SvelteKit and TypeScript. The website features a responsive design that adapts seamlessly across desktop, tablet, and mobile devices.

## Architecture Decisions

The project uses SvelteKit for its powerful SSR capabilities and TypeScript for type safety. Tailwind CSS provides utility-first styling for consistent design implementation.

## Key Features

- Responsive design system
- Optimized performance with lazy loading
- SEO-friendly structure with meta tags
- Accessible navigation and content
- Dark/light theme support

## Technical Implementation

The website leverages SvelteKit's file-based routing and component architecture to create a maintainable and scalable codebase.`,
		relatedProjects: ['task-management-app', 'weather-dashboard']
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
		completionDate: new Date('2023-12-15'),
		challenges: [
			'Implementing real-time collaboration without conflicts',
			'Handling concurrent task updates from multiple users',
			'Designing an intuitive task organization system',
			'Ensuring data consistency across WebSocket connections'
		],
		solutions: [
			'Implemented operational transformation for conflict resolution',
			'Used optimistic updates with rollback mechanisms',
			'Created drag-and-drop interface with visual feedback',
			'Added transaction-based updates with SQLite WAL mode'
		],
		skillsDemonstrated: [
			'Backend Development',
			'Real-time Systems',
			'Database Design',
			'WebSocket Implementation',
			'API Development'
		],
		content: `# Task Management Application

A full-stack collaborative task management system built with Node.js and real-time WebSocket communication.

## Core Features

- Real-time task updates across all connected clients
- Drag-and-drop task organization
- Team collaboration with user assignments
- Project-based task grouping
- Due date tracking and notifications

## Technical Challenges

The primary challenge was implementing real-time collaboration while maintaining data consistency. This required careful coordination between client and server states.

## Implementation Approach

Used WebSockets for instant updates and SQLite with WAL mode for reliable data persistence. The system handles concurrent edits through operational transformation principles.`,
		relatedProjects: ['ecommerce-platform', 'portfolio-website']
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
		startDate: new Date('2024-06-01'),
		challenges: [
			'Integrating secure payment processing',
			'Managing complex inventory tracking',
			'Implementing multi-tenant architecture',
			'Handling high-volume concurrent transactions'
		],
		solutions: [
			'Stripe integration with PCI compliance',
			'Real-time inventory updates with PostgreSQL triggers',
			'Row-level security for tenant isolation',
			'Connection pooling and caching strategies'
		],
		skillsDemonstrated: [
			'Full-stack Development',
			'Payment Integration',
			'Database Architecture',
			'Security Implementation',
			'Performance Optimization'
		],
		content: `# E-commerce Platform Development

Currently developing a comprehensive e-commerce solution with modern web technologies and secure payment processing.

## Planned Features

- Multi-vendor marketplace support
- Advanced inventory management
- Secure payment processing with Stripe
- Real-time order tracking
- Analytics dashboard

## Development Progress

The project is in active development with core features being implemented iteratively using agile methodology.`,
		relatedProjects: ['task-management-app', 'weather-dashboard']
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
		completionDate: new Date('2023-07-30'),
		challenges: [
			'Processing large amounts of weather data efficiently',
			'Creating intuitive data visualizations',
			'Handling API rate limits and caching',
			'Implementing responsive charts for mobile devices'
		],
		solutions: [
			'Implemented data aggregation and efficient filtering algorithms',
			'Used D3.js for custom, interactive visualizations',
			'Added intelligent caching layer with Redis',
			'Created responsive SVG charts that adapt to screen sizes'
		],
		skillsDemonstrated: [
			'Data Visualization',
			'API Integration',
			'Frontend Development',
			'Performance Optimization',
			'Responsive Design'
		],
		content: `# Weather Dashboard

An interactive weather visualization platform that transforms complex meteorological data into intuitive, actionable insights.

## Key Features

- Real-time weather data from multiple sources
- Interactive charts and graphs using D3.js
- 7-day weather forecasting
- Historical weather pattern analysis
- Location-based weather alerts

## Data Processing

The dashboard processes weather data from multiple APIs, aggregates the information, and presents it through custom visualizations optimized for both desktop and mobile viewing.

## Technical Innovation

Custom D3.js visualizations provide interactive exploration of weather patterns, with responsive design ensuring optimal viewing across all devices.`,
		relatedProjects: ['portfolio-website', 'task-management-app']
	}
];

// Create reactive writable store with CRUD operations for admin interface
function createProjectsStore() {
	const { subscribe, set, update } = writable([...mockProjectsData]);

	return {
		subscribe,
		// Initialize with mock data
		init: () => set([...mockProjectsData]),
		
		// Create new project
		create: (projectData: Partial<Project>) => {
			const newProject: Project = {
				id: projectData.id || `project-${Date.now()}`,
				title: projectData.title || '',
				description: projectData.description || '',
				technologies: projectData.technologies || [],
				status: projectData.status || 'planning',
				featured: projectData.featured || false,
				githubUrl: projectData.githubUrl,
				demoUrl: projectData.demoUrl,
				imageUrl: projectData.imageUrl,
				startDate: projectData.startDate,
				completionDate: projectData.completionDate,
				challenges: projectData.challenges || [],
				solutions: projectData.solutions || [],
				skillsDemonstrated: projectData.skillsDemonstrated || [],
				content: projectData.content || '',
				relatedProjects: projectData.relatedProjects || []
			};
			
			update(projects => [...projects, newProject]);
			return newProject;
		},
		
		// Update existing project
		updateById: (id: string, projectData: Partial<Project>) => update(projects => {
			return projects.map(project => 
				project.id === id ? { ...project, ...projectData } : project
			);
		}),
		
		// Delete project by ID
		deleteById: (id: string) => update(projects => {
			return projects.filter(project => project.id !== id);
		}),
		
		// Get project by ID
		getById: (id: string): Project | undefined => {
			let foundProject: Project | undefined = undefined;
			update(projects => {
				foundProject = projects.find(project => project.id === id);
				return projects;
			});
			return foundProject;
		},
		
		// Array access methods for backward compatibility
		push: (projectData: Project) => update(projects => {
			return [...projects, projectData];
		}),
		
		find: (predicate: (project: Project) => boolean): Project | undefined => {
			let foundProject: Project | undefined = undefined;
			update(projects => {
				foundProject = projects.find(predicate);
				return projects;
			});
			return foundProject;
		},
		
		findIndex: (predicate: (project: Project) => boolean): number => {
			let index = -1;
			update(projects => {
				index = projects.findIndex(predicate);
				return projects;
			});
			return index;
		},
		
		splice: (start: number, deleteCount: number, ...items: Project[]) => update(projects => {
			const newArray = [...projects];
			newArray.splice(start, deleteCount, ...items);
			return newArray;
		}),
		
		// Reset to original data
		reset: () => set([...mockProjectsData])
	};
}

// Export the reactive projects store for admin interface
export const projects = createProjectsStore();

// Export the mock data for other components compatibility
export const projectsData = mockProjectsData;

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

// Helper function to get projects by technology (case-insensitive)
export function getProjectsByTechnology(technology: string): Project[] {
	const lowerTechnology = technology.toLowerCase();
	return mockProjectsData.filter(project =>
		project.technologies.some(tech => tech.toLowerCase() === lowerTechnology)
	);
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

// Helper function to get project by ID (for detail pages)
export function getProjectById(id: string): Project | undefined {
	return mockProjectsData.find(project => project.id === id);
}

// Helper function to get related projects
export function getRelatedProjects(projectId: string): Project[] {
	const project = getProjectById(projectId);
	if (!project || !project.relatedProjects) {
		return [];
	}

	return project.relatedProjects
		.map(id => getProjectById(id))
		.filter((p): p is Project => p !== undefined);
}

// Helper function to search projects by text
export function searchProjects(query: string): Project[] {
	const lowerQuery = query.toLowerCase();
	return mockProjectsData.filter(
		project =>
			project.title.toLowerCase().includes(lowerQuery) ||
			project.description.toLowerCase().includes(lowerQuery) ||
			project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery))
	);
}
