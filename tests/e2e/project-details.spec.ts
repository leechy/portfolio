import { expect, test } from '@playwright/test';

// T031 - E2E tests for User Story 2: Project Deep Dive
// These tests MUST FAIL initially (TDD red phase)

test.describe('Project Details - User Story 2', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage first
		await page.goto('/');
		// Wait for homepage to fully load
		await page.waitForSelector('[data-testid="projects-section"]');
	});

	test('should navigate from homepage to project detail page', async ({ page }) => {
		// Click on the first featured project card
		const projectCard = page.locator('[data-testid="project-card"]').first();
		await expect(projectCard).toBeVisible();

		// Get project title for verification
		const projectTitle = await projectCard.locator('h3').textContent();

		// Click to navigate to project detail
		await projectCard.click();

		// Verify we're on the project detail page
		await expect(page).toHaveURL(/\/projects\/[^/]+$/);

		// Verify project detail page loads with correct title
		await expect(page.locator('[data-testid="project-detail-title"]')).toContainText(
			projectTitle || ''
		);
	});

	test('should display comprehensive project information on detail page', async ({ page }) => {
		// Navigate to a specific project (portfolio-website)
		await page.goto('/projects/portfolio-website');

		// Verify core project information sections are present
		await expect(page.locator('[data-testid="project-detail-title"]')).toBeVisible();
		await expect(page.locator('[data-testid="project-description"]')).toBeVisible();
		await expect(page.locator('[data-testid="project-technologies"]')).toBeVisible();

		// Verify User Story 2 specific requirements
		await expect(page.locator('[data-testid="project-challenges"]')).toBeVisible();
		await expect(page.locator('[data-testid="project-solutions"]')).toBeVisible();
		await expect(page.locator('[data-testid="skills-demonstrated"]')).toBeVisible();

		// Verify project metadata
		await expect(page.locator('[data-testid="project-status"]')).toBeVisible();
		await expect(page.locator('[data-testid="project-links"]')).toBeVisible();
	});

	test('should show technologies used with proper formatting', async ({ page }) => {
		await page.goto('/projects/portfolio-website');

		// Verify technologies section
		const technologiesSection = page.locator('[data-testid="project-technologies"]');
		await expect(technologiesSection).toBeVisible();

		// Should have at least 2 technology tags
		const techTags = page.locator('[data-testid="tech-tag"]');
		expect(await techTags.count()).toBeGreaterThanOrEqual(2);

		// Verify specific technologies for portfolio project
		await expect(techTags).toContainText(['SvelteKit', 'TypeScript']);
	});

	test('should display challenges and solutions sections', async ({ page }) => {
		await page.goto('/projects/task-management-app');

		// Verify challenges section exists and has content
		const challengesSection = page.locator('[data-testid="project-challenges"]');
		await expect(challengesSection).toBeVisible();

		const challengeItems = page.locator('[data-testid="challenge-item"]');
		expect(await challengeItems.count()).toBeGreaterThanOrEqual(1);

		// Verify solutions section exists and has content
		const solutionsSection = page.locator('[data-testid="project-solutions"]');
		await expect(solutionsSection).toBeVisible();

		const solutionItems = page.locator('[data-testid="solution-item"]');
		expect(await solutionItems.count()).toBeGreaterThanOrEqual(1);
	});

	test('should show skills demonstrated in the project', async ({ page }) => {
		await page.goto('/projects/portfolio-website');

		// Verify skills demonstrated section
		const skillsSection = page.locator('[data-testid="skills-demonstrated"]');
		await expect(skillsSection).toBeVisible();

		// Should show skill tags
		const skillTags = page.locator('[data-testid="skill-tag"]');
		expect(await skillTags.count()).toBeGreaterThanOrEqual(1);

		// Skills should be clickable (for potential filtering)
		await expect(skillTags.first()).toBeVisible();
	});

	test('should provide navigation back to projects overview', async ({ page }) => {
		await page.goto('/projects/portfolio-website');

		// Should have breadcrumb or back navigation
		const backNav = page.locator('[data-testid="back-to-projects"]');
		await expect(backNav).toBeVisible();

		// Click back navigation
		await backNav.click();

		// Should navigate back to projects page
		await expect(page).toHaveURL('/projects');
		await expect(page.locator('[data-testid="projects-overview"]')).toBeVisible();
	});

	test('should handle project links (GitHub, Demo) correctly', async ({ page }) => {
		await page.goto('/projects/portfolio-website');

		const projectLinks = page.locator('[data-testid="project-links"]');
		await expect(projectLinks).toBeVisible();

		// Should have GitHub and Demo links if available
		const githubLink = page.locator('[data-testid="github-link"]');
		const demoLink = page.locator('[data-testid="demo-link"]');

		// At least one link should be present
		const linkCount = (await githubLink.count()) + (await demoLink.count());
		expect(linkCount).toBeGreaterThanOrEqual(1);

		// Links should open in new tab (target="_blank")
		if ((await githubLink.count()) > 0) {
			await expect(githubLink).toHaveAttribute('target', '_blank');
		}
		if ((await demoLink.count()) > 0) {
			await expect(demoLink).toHaveAttribute('target', '_blank');
		}
	});

	test('should display related projects suggestions', async ({ page }) => {
		await page.goto('/projects/portfolio-website');

		// Should show related projects section
		const relatedSection = page.locator('[data-testid="related-projects"]');
		await expect(relatedSection).toBeVisible();

		// Should have at least 1 related project (if multiple projects exist)
		const relatedCards = page.locator('[data-testid="related-project-card"]');

		// May have 0 related projects if only one project exists
		const relatedCount = await relatedCards.count();
		if (relatedCount > 0) {
			// If there are related projects, they should be clickable
			await expect(relatedCards.first()).toBeVisible();
		}
	});

	test('should handle non-existent project pages (404)', async ({ page }) => {
		// Navigate to non-existent project
		const response = await page.goto('/projects/non-existent-project');

		// Should return 404 status or show error page
		expect(response?.status()).toBe(404);

		// Should show appropriate error message
		await expect(page.locator('[data-testid="project-not-found"]')).toBeVisible();

		// Should provide navigation back to projects
		const backToProjects = page.locator('[data-testid="back-to-projects"]');
		await expect(backToProjects).toBeVisible();
	});

	test('should be responsive on mobile devices', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto('/projects/portfolio-website');

		// Verify mobile layout adaptations
		await expect(page.locator('[data-testid="project-detail-title"]')).toBeVisible();
		await expect(page.locator('[data-testid="project-technologies"]')).toBeVisible();

		// Technology tags should wrap properly on mobile
		const techTags = page.locator('[data-testid="tech-tag"]');
		if ((await techTags.count()) > 0) {
			await expect(techTags.first()).toBeVisible();
		}

		// Navigation should be accessible on mobile
		await expect(page.locator('[data-testid="back-to-projects"]')).toBeVisible();
	});
});
