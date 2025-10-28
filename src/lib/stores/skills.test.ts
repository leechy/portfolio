import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { type Skill, loadSkills, skillsStore } from './skills';

describe('T017 - Skills Data Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    skillsStore.set({
      categories: [],
      loading: false,
      error: null
    });
  });

  it('should load skills by category', async () => {
    // Act - Load skills data
    await loadSkills();

    // Assert - Verify skills are loaded and categorized
    const state = get(skillsStore);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.categories).toHaveLength(3); // Frontend, Backend, and Tools & Infrastructure categories

    // Verify Frontend category
    const frontendCategory = state.categories.find(cat => cat.name === 'Frontend Development');
    expect(frontendCategory).toBeDefined();
    expect(frontendCategory?.skills).toContainEqual(
      expect.objectContaining({
        name: 'TypeScript',
        proficiency: 'Advanced'
      })
    );

    // Verify Backend category
    const backendCategory = state.categories.find(cat => cat.name === 'Backend Development');
    expect(backendCategory).toBeDefined();
    expect(backendCategory?.skills).toContainEqual(
      expect.objectContaining({
        name: 'Node.js',
        proficiency: 'Advanced'
      })
    );
  });

  it('should handle loading states correctly', async () => {
    // Act - Start loading
    const loadPromise = loadSkills();

    // Assert - Should be in loading state
    let state = get(skillsStore);
    expect(state.loading).toBe(true);

    // Wait for completion
    await loadPromise;

    // Assert - Loading should be complete
    state = get(skillsStore);
    expect(state.loading).toBe(false);
  });

  it('should validate skill data structure', async () => {
    // Act
    await loadSkills();

    // Assert - Verify each skill has required properties
    const state = get(skillsStore);

    state.categories.forEach(category => {
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('skills');
      expect(Array.isArray(category.skills)).toBe(true);

      category.skills.forEach((skill: Skill) => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('proficiency');
        expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(skill.proficiency);

        if (skill.yearsExperience) {
          expect(typeof skill.yearsExperience).toBe('number');
          expect(skill.yearsExperience).toBeGreaterThan(0);
        }
      });
    });
  });

  it('should support skill search and filtering', async () => {
    // Arrange
    await loadSkills();

    // Act - Filter skills by proficiency
    const state = get(skillsStore);
    const advancedSkills = state.categories
      .flatMap(cat => cat.skills)
      .filter(skill => skill.proficiency === 'Advanced');

    // Assert
    expect(advancedSkills.length).toBeGreaterThanOrEqual(2);
    expect(advancedSkills).toContainEqual(expect.objectContaining({ name: 'TypeScript' }));
  });
});
