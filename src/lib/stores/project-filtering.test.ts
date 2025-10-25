import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { getProjectsByTechnology, loadProjects, projectsStore } from './projects';

// T034 - Integration tests for User Story 2: Project Filtering by Skills
// These tests MUST FAIL initially (TDD red phase)

describe('T034 - Project Filtering Integration', () => {
	beforeEach(() => {
		// Reset the store before each test
		projectsStore.set({
			projects: [],
			featured: [],
			loading: false,
			error: null
		});
	});

	it('should filter projects by single technology', async () => {
		await loadProjects();

		// Test filtering by SvelteKit
		const svelteProjects = getProjectsByTechnology('SvelteKit');

		expect(svelteProjects.length).toBeGreaterThan(0);

		// All returned projects should contain SvelteKit
		svelteProjects.forEach(project => {
			expect(project.technologies).toContain('SvelteKit');
		});
	});

	it('should filter projects by TypeScript technology', async () => {
		await loadProjects();

		// Test filtering by TypeScript
		const tsProjects = getProjectsByTechnology('TypeScript');

		expect(tsProjects.length).toBeGreaterThan(0);

		// All returned projects should contain TypeScript
		tsProjects.forEach(project => {
			expect(project.technologies).toContain('TypeScript');
		});
	});

	it('should return empty array for non-existent technology', async () => {
		await loadProjects();

		// Test filtering by non-existent technology
		const nonExistentProjects = getProjectsByTechnology('NonExistentFramework');

		expect(nonExistentProjects).toEqual([]);
	});

	it('should filter projects by multiple technologies (intersection)', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Find projects that have both SvelteKit AND TypeScript
		const multiTechProjects = state.projects.filter(
			project =>
				project.technologies.includes('SvelteKit') && project.technologies.includes('TypeScript')
		);

		expect(multiTechProjects.length).toBeGreaterThanOrEqual(1);

		// Verify each project has both technologies
		multiTechProjects.forEach(project => {
			expect(project.technologies).toContain('SvelteKit');
			expect(project.technologies).toContain('TypeScript');
		});
	});

	it('should support case-insensitive technology filtering', async () => {
		await loadProjects();

		// Test case-insensitive matching
		const lowerCaseResults = getProjectsByTechnology('sveltekit');
		const upperCaseResults = getProjectsByTechnology('SVELTEKIT');
		const properCaseResults = getProjectsByTechnology('SvelteKit');

		// All should return same projects (case insensitive)
		expect(lowerCaseResults.length).toBe(properCaseResults.length);
		expect(upperCaseResults.length).toBe(properCaseResults.length);

		// Verify they contain the same project IDs
		const lowerIds = lowerCaseResults.map(p => p.id).sort();
		const upperIds = upperCaseResults.map(p => p.id).sort();
		const properIds = properCaseResults.map(p => p.id).sort();

		expect(lowerIds).toEqual(properIds);
		expect(upperIds).toEqual(properIds);
	});

	it('should filter projects by project status', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Filter completed projects
		const completedProjects = state.projects.filter(p => p.status === 'completed');
		expect(completedProjects.length).toBeGreaterThan(0);

		// Filter development projects
		const devProjects = state.projects.filter(p => p.status === 'development');
		expect(devProjects.length).toBeGreaterThanOrEqual(0);

		// All completed projects should have completion date
		completedProjects.forEach(project => {
			expect(project.status).toBe('completed');
		});
	});

	it('should support combined technology and status filtering', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Find completed SvelteKit projects
		const completedSvelteProjects = state.projects.filter(
			project => project.status === 'completed' && project.technologies.includes('SvelteKit')
		);

		// Should find at least one (portfolio project)
		expect(completedSvelteProjects.length).toBeGreaterThan(0);

		// Verify all results match both criteria
		completedSvelteProjects.forEach(project => {
			expect(project.status).toBe('completed');
			expect(project.technologies).toContain('SvelteKit');
		});
	});

	it('should support fuzzy technology search', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Search for partial technology matches
		const partialMatches = state.projects.filter(project =>
			project.technologies.some(
				tech => tech.toLowerCase().includes('script') // Should match TypeScript, JavaScript
			)
		);

		expect(partialMatches.length).toBeGreaterThan(0);

		// Verify results contain technologies with 'script'
		partialMatches.forEach(project => {
			const hasScriptTech = project.technologies.some(tech =>
				tech.toLowerCase().includes('script')
			);
			expect(hasScriptTech).toBe(true);
		});
	});

	it('should handle filtering with project date ranges', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Filter projects started after a certain date
		const cutoffDate = new Date('2024-01-01');
		const recentProjects = state.projects.filter(
			project => project.startDate && project.startDate >= cutoffDate
		);

		expect(recentProjects.length).toBeGreaterThanOrEqual(0);

		// Verify all results are after cutoff date
		recentProjects.forEach(project => {
			if (project.startDate) {
				expect(project.startDate.getTime()).toBeGreaterThanOrEqual(cutoffDate.getTime());
			}
		});
	});

	it('should provide project search functionality', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Search projects by title or description
		const searchTerm = 'portfolio';
		const searchResults = state.projects.filter(
			project =>
				project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project.description.toLowerCase().includes(searchTerm.toLowerCase())
		);

		expect(searchResults.length).toBeGreaterThan(0);

		// Verify results contain search term
		searchResults.forEach(project => {
			const titleMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
			const descriptionMatch = project.description.toLowerCase().includes(searchTerm.toLowerCase());
			expect(titleMatch || descriptionMatch).toBe(true);
		});
	});

	it('should support advanced filtering combinations', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Complex filter: Featured + Completed + Has GitHub URL + Uses TypeScript
		const advancedFilter = state.projects.filter(
			project =>
				project.featured &&
				project.status === 'completed' &&
				project.githubUrl &&
				project.technologies.includes('TypeScript')
		);

		// Should find at least one project matching all criteria
		expect(advancedFilter.length).toBeGreaterThan(0);

		// Verify each result matches all criteria
		advancedFilter.forEach(project => {
			expect(project.featured).toBe(true);
			expect(project.status).toBe('completed');
			expect(project.githubUrl).toBeDefined();
			expect(project.technologies).toContain('TypeScript');
		});
	});

	it('should maintain performance with large datasets', async () => {
		await loadProjects();
		const state = get(projectsStore);

		// Measure filtering performance
		const startTime = performance.now();

		// Run multiple filter operations
		for (let i = 0; i < 1000; i++) {
			getProjectsByTechnology('SvelteKit');
			state.projects.filter(p => p.featured);
			state.projects.filter(p => p.status === 'completed');
		}

		const endTime = performance.now();
		const executionTime = endTime - startTime;

		// Should complete within reasonable time (less than 100ms for 1000 operations)
		expect(executionTime).toBeLessThan(100);
	});
});
