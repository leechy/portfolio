import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { type Project, loadProjects, projectsStore } from './projects';

describe('T018 - Projects Data Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    projectsStore.set({
      projects: [],
      featured: [],
      loading: false,
      error: null
    });
  });

  it('should load projects and identify featured ones', async () => {
    // Act - Load projects data
    await loadProjects();

    // Assert - Verify projects are loaded
    const state = get(projectsStore);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.projects.length).toBeGreaterThanOrEqual(2);
    expect(state.featured.length).toBeGreaterThanOrEqual(2);

    // Verify featured projects have all required properties
    const featuredProject = state.featured[0];
    expect(featuredProject).toHaveProperty('title');
    expect(featuredProject).toHaveProperty('description');
    expect(featuredProject).toHaveProperty('technologies');
    expect(featuredProject.featured).toBe(true);
    expect(Array.isArray(featuredProject.technologies)).toBe(true);
  });

  it('should validate project data structure', async () => {
    // Act
    await loadProjects();

    // Assert - Verify each project has required properties
    const state = get(projectsStore);

    state.projects.forEach((project: Project) => {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('technologies');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('featured');

      // Validate technologies array
      expect(Array.isArray(project.technologies)).toBe(true);
      project.technologies.forEach(tech => {
        expect(typeof tech).toBe('string');
      });

      // Validate status enum
      expect(['planning', 'development', 'completed', 'maintenance']).toContain(project.status);
    });
  });

  it('should handle project filtering by status', async () => {
    // Arrange
    await loadProjects();

    // Act - Filter projects by status
    const state = get(projectsStore);
    const completedProjects = state.projects.filter(
      (project: Project) => project.status === 'completed'
    );

    // Assert
    expect(completedProjects.length).toBeGreaterThanOrEqual(1);
    completedProjects.forEach((project: Project) => {
      expect(project.status).toBe('completed');
    });
  });

  it('should support project search by technology', async () => {
    // Arrange
    await loadProjects();

    // Act - Search for projects using SvelteKit
    const state = get(projectsStore);
    const svelteKitProjects = state.projects.filter((project: Project) =>
      project.technologies.includes('SvelteKit')
    );

    // Assert
    expect(svelteKitProjects.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle loading states correctly', async () => {
    // Act - Start loading
    const loadPromise = loadProjects();

    // Assert - Should be in loading state
    let state = get(projectsStore);
    expect(state.loading).toBe(true);

    // Wait for completion
    await loadPromise;

    // Assert - Loading should be complete
    state = get(projectsStore);
    expect(state.loading).toBe(false);
  });

  it('should calculate project statistics correctly', async () => {
    // Act
    await loadProjects();

    // Assert - Verify project counts and statistics
    const state = get(projectsStore);

    expect(state.projects.length).toBeGreaterThan(0);
    expect(state.featured.length).toBeLessThanOrEqual(state.projects.length);

    // All featured projects should also be in the main projects array
    state.featured.forEach((featured: Project) => {
      const foundInProjects = state.projects.some((project: Project) => project.id === featured.id);
      expect(foundInProjects).toBe(true);
    });
  });
});
