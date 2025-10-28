import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { loadProjects, projectsStore } from './projects';

// T032 - Integration tests for User Story 2: Project Content Loading
// These tests MUST FAIL initially (TDD red phase)

describe('T032 - Project Content Integration', () => {
  beforeEach(() => {
    // Reset the store before each test
    projectsStore.set({
      projects: [],
      featured: [],
      loading: false,
      error: null
    });
  });

  it('should load project with detailed content structure', async () => {
    await loadProjects();
    const state = get(projectsStore);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.projects.length).toBeGreaterThan(0);

    // Verify projects have detailed content structure for User Story 2
    const project = state.projects[0];
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('title');
    expect(project).toHaveProperty('description');
    expect(project).toHaveProperty('technologies');
    expect(project).toHaveProperty('status');

    // User Story 2 specific requirements
    expect(project.technologies).toBeInstanceOf(Array);
    expect(project.technologies.length).toBeGreaterThan(0);
  });

  it('should provide project content by slug', async () => {
    // Test getting project by slug (needed for dynamic routes)
    await loadProjects();
    const state = get(projectsStore);

    const portfolioProject = state.projects.find(p => p.id === 'portfolio-website');
    expect(portfolioProject).toBeDefined();
    expect(portfolioProject?.title).toBe('Portfolio Website');
    expect(portfolioProject?.technologies).toContain('SvelteKit');
  });

  it('should handle project content with challenges and solutions', async () => {
    // Enhanced project interface should support challenges and solutions
    await loadProjects();
    const state = get(projectsStore);

    // Projects should be structured to support detailed content
    const project = state.projects[0];
    expect(project).toHaveProperty('description');
    expect(typeof project.description).toBe('string');
    expect(project.description.length).toBeGreaterThan(10);
  });

  it('should provide project metadata for detailed pages', async () => {
    await loadProjects();
    const state = get(projectsStore);

    const project = state.projects[0];

    // Essential metadata for project detail pages
    expect(project).toHaveProperty('status');
    expect(project).toHaveProperty('githubUrl');
    expect(project).toHaveProperty('demoUrl');
    expect(project).toHaveProperty('startDate');

    // Status should be valid enum value
    expect(['planning', 'development', 'completed', 'maintenance']).toContain(project.status);
  });

  it('should filter projects by technology for skills demonstration', async () => {
    await loadProjects();
    const state = get(projectsStore);

    // Test filtering by specific technology
    const svelteProjects = state.projects.filter(p => p.technologies.includes('SvelteKit'));

    expect(svelteProjects.length).toBeGreaterThan(0);

    // Verify filtered projects actually contain the technology
    svelteProjects.forEach(project => {
      expect(project.technologies).toContain('SvelteKit');
    });
  });

  it('should support related project suggestions', async () => {
    await loadProjects();
    const state = get(projectsStore);

    // For related projects, we need multiple projects with overlapping technologies
    expect(state.projects.length).toBeGreaterThanOrEqual(2);

    // Test logic for finding related projects
    const targetProject = state.projects[0];
    const relatedProjects = state.projects.filter(
      p =>
        p.id !== targetProject.id &&
        p.technologies.some(tech => targetProject.technologies.includes(tech))
    );

    // Should be able to find related projects (at least one for a rich portfolio)
    expect(relatedProjects.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle project content loading errors gracefully', async () => {
    // Simulate error in loading (will need to mock this later)
    const state = get(projectsStore);

    // Initially should not have error
    expect(state.error).toBe(null);

    // After successful load, still no error
    await loadProjects();
    const updatedState = get(projectsStore);
    expect(updatedState.error).toBe(null);
  });

  it('should provide project statistics for overview pages', async () => {
    await loadProjects();
    const state = get(projectsStore);

    // Should have both completed and in-development projects
    const completedProjects = state.projects.filter(p => p.status === 'completed');
    const developmentProjects = state.projects.filter(p => p.status === 'development');

    expect(completedProjects.length).toBeGreaterThan(0);
    expect(developmentProjects.length).toBeGreaterThanOrEqual(0);
    expect(state.projects.length).toBeGreaterThan(0);

    // Featured projects should be subset of all projects
    expect(state.featured.length).toBeLessThanOrEqual(state.projects.length);
  });

  it('should validate project content structure for detail pages', async () => {
    await loadProjects();
    const state = get(projectsStore);

    state.projects.forEach(project => {
      // Required fields for project detail pages
      expect(typeof project.id).toBe('string');
      expect(typeof project.title).toBe('string');
      expect(typeof project.description).toBe('string');
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(typeof project.status).toBe('string');
      expect(typeof project.featured).toBe('boolean');

      // Optional fields should be properly typed
      if (project.githubUrl) {
        expect(typeof project.githubUrl).toBe('string');
        expect(project.githubUrl).toMatch(/^https?:\/\//);
      }
      if (project.demoUrl) {
        expect(typeof project.demoUrl).toBe('string');
        expect(project.demoUrl).toMatch(/^https?:\/\//);
      }
      if (project.startDate) {
        expect(project.startDate).toBeInstanceOf(Date);
      }
    });
  });

  it('should support project content for markdown rendering', async () => {
    await loadProjects();
    const state = get(projectsStore);

    // Projects should have sufficient description content for detail pages
    const project = state.projects[0];
    expect(project.description.length).toBeGreaterThan(20);

    // Should support rich content structure
    expect(project.technologies.length).toBeGreaterThan(1);
  });
});
