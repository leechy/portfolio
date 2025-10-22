import { writable } from 'svelte/store';

export interface Skill {
	name: string;
	proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	yearsExperience?: number;
	description?: string;
}

export interface SkillCategory {
	name: string;
	skills: Skill[];
	icon?: string;
}

export interface SkillsState {
	categories: SkillCategory[];
	loading: boolean;
	error: string | null;
}

// Initial state
const initialState: SkillsState = {
	categories: [],
	loading: false,
	error: null
};

// Create the store
export const skillsStore = writable<SkillsState>(initialState);

// Mock data for development (will be replaced with real data source later)
const mockSkillsData: SkillCategory[] = [
	{
		name: 'Frontend Development',
		icon: '🎨',
		skills: [
			{
				name: 'TypeScript',
				proficiency: 'Advanced',
				yearsExperience: 5,
				description: 'Strong typing for JavaScript development'
			},
			{
				name: 'SvelteKit',
				proficiency: 'Advanced',
				yearsExperience: 3,
				description: 'Modern web framework with excellent performance'
			},
			{
				name: 'React',
				proficiency: 'Intermediate',
				yearsExperience: 4,
				description: 'Component-based UI library'
			},
			{
				name: 'Tailwind CSS',
				proficiency: 'Advanced',
				yearsExperience: 3,
				description: 'Utility-first CSS framework'
			}
		]
	},
	{
		name: 'Backend Development',
		icon: '⚙️',
		skills: [
			{
				name: 'Node.js',
				proficiency: 'Advanced',
				yearsExperience: 5,
				description: 'JavaScript runtime for server-side development'
			},
			{
				name: 'SQLite',
				proficiency: 'Intermediate',
				yearsExperience: 2,
				description: 'Lightweight relational database'
			},
			{
				name: 'PostgreSQL',
				proficiency: 'Intermediate',
				yearsExperience: 3,
				description: 'Advanced open-source relational database'
			}
		]
	},
	{
		name: 'Tools & Technologies',
		icon: '🛠️',
		skills: [
			{
				name: 'Git',
				proficiency: 'Advanced',
				yearsExperience: 5,
				description: 'Version control and collaboration'
			},
			{
				name: 'Docker',
				proficiency: 'Intermediate',
				yearsExperience: 2,
				description: 'Containerization and deployment'
			},
			{
				name: 'Vite',
				proficiency: 'Advanced',
				yearsExperience: 2,
				description: 'Fast build tool for modern web projects'
			}
		]
	}
];

// Load skills data (async to simulate API calls)
export async function loadSkills(): Promise<void> {
	skillsStore.update(state => ({
		...state,
		loading: true,
		error: null
	}));

	try {
		// Simulate API delay (reduced for testing)
		await new Promise(resolve => setTimeout(resolve, 50));

		// Update store with loaded data
		skillsStore.update(state => ({
			...state,
			categories: mockSkillsData,
			loading: false,
			error: null
		}));
	} catch (error) {
		skillsStore.update(state => ({
			...state,
			loading: false,
			error: error instanceof Error ? error.message : 'Failed to load skills'
		}));
	}
}

// Helper function to get all skills flattened
export function getAllSkills(): Skill[] {
	return mockSkillsData.flatMap(category => category.skills);
}

// Helper function to filter skills by proficiency
export function getSkillsByProficiency(proficiency: Skill['proficiency']): Skill[] {
	return getAllSkills().filter(skill => skill.proficiency === proficiency);
}
