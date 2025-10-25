import { expect, test } from '@playwright/test';

test.describe('Homepage - User Story 1', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to homepage before each test
		await page.goto('/');
	});

	test('should load homepage within 10 seconds and display key information', async ({ page }) => {
		// Set timeout for the entire test to 10 seconds as per requirement
		test.setTimeout(10000);

		// Wait for the page to be fully loaded
		await page.waitForLoadState('networkidle');

		// Verify page title is set correctly
		await expect(page).toHaveTitle(/Leechy\.dev/);

		// Check that the main navigation is visible
		const navigation = page.locator('nav[aria-label="Main navigation"]');
		await expect(navigation).toBeVisible();

		// Verify navigation links are present
		const navLinks = navigation.locator('[data-testid="main-nav-links"] a');
		await expect(navLinks).toHaveCount(4); // Home, Projects, Blog, Contact

		// Check specific navigation items
		await expect(navLinks.nth(0)).toHaveText('Home');
		await expect(navLinks.nth(1)).toHaveText('Projects');
		await expect(navLinks.nth(2)).toHaveText('Blog');
		await expect(navLinks.nth(3)).toHaveText('Contact');

		// Verify hero section is visible
		const heroSection = page.locator('[data-testid="hero-section"]');
		await expect(heroSection).toBeVisible();

		// Check hero content
		const heroTitle = heroSection.locator('h1');
		await expect(heroTitle).toBeVisible();
		await expect(heroTitle).toContainText('Leechy');

		const heroDescription = heroSection.locator('p').first();
		await expect(heroDescription).toBeVisible();
		await expect(heroDescription).toContainText('developer');

		// Verify skills section is present and loaded
		const skillsSection = page.locator('[data-testid="skills-section"]');
		await expect(skillsSection).toBeVisible();

		const skillsSectionTitle = skillsSection.locator('h2');
		await expect(skillsSectionTitle).toHaveText('Skills & Technologies');

		// Check that skills are loaded (should have at least 5 skill cards)
		const skillCards = skillsSection.locator('[data-testid="skill-card"]');
		const skillCount = await skillCards.count();
		expect(skillCount).toBeGreaterThanOrEqual(5);

		// Verify skill categories are present
		const skillCategories = skillsSection.locator('[data-testid="skill-category"]');
		const categoryCount = await skillCategories.count();
		expect(categoryCount).toBeGreaterThanOrEqual(3); // Frontend, Backend, Tools etc.

		// Verify featured projects section is visible
		const projectsSection = page.locator('[data-testid="featured-projects-section"]');
		await expect(projectsSection).toBeVisible();

		const projectsSectionTitle = projectsSection.locator('h2');
		await expect(projectsSectionTitle).toHaveText('Featured Projects');

		// Check that at least one featured project is displayed
		const projectCards = projectsSection.locator('[data-testid="project-card"]');
		const projectCount = await projectCards.count();
		expect(projectCount).toBeGreaterThanOrEqual(1);

		// Verify project card contains required elements
		const firstProject = projectCards.first();
		await expect(firstProject.locator('h3')).toBeVisible(); // Project title
		await expect(firstProject.locator('p')).toBeVisible(); // Project description

		// Verify contact section is visible
		const contactSection = page.locator('[data-testid="contact-section"]');
		await expect(contactSection).toBeVisible();

		const contactTitle = contactSection.locator('h2');
		await expect(contactTitle).toHaveText(/contact/i);

		// Check contact information is displayed
		const contactInfo = contactSection.locator('[data-testid="contact-info"]');
		await expect(contactInfo).toBeVisible();

		// Verify social links are present
		const socialLinks = contactSection.locator('[data-testid="social-links"] a');
		const socialCount = await socialLinks.count();
		expect(socialCount).toBeGreaterThanOrEqual(2); // At least GitHub and LinkedIn

		// Verify footer is present
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
		await expect(footer).toContainText('Leechy');
	});

	test('should display skills grouped by categories', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		const skillsSection = page.locator('[data-testid="skills-section"]');
		await expect(skillsSection).toBeVisible();

		// Check for specific skill categories
		const frontendCategory = skillsSection.locator(
			'[data-testid="skill-category"][data-category="frontend"]'
		);
		await expect(frontendCategory).toBeVisible();

		const backendCategory = skillsSection.locator(
			'[data-testid="skill-category"][data-category="backend"]'
		);
		await expect(backendCategory).toBeVisible();

		const toolsCategory = skillsSection.locator(
			'[data-testid="skill-category"][data-category="tool"]'
		);
		await expect(toolsCategory).toBeVisible();

		// Verify each category has skills
		const frontendSkills = frontendCategory.locator('[data-testid="skill-card"]');
		const frontendCount = await frontendSkills.count();
		expect(frontendCount).toBeGreaterThanOrEqual(3);

		const backendSkills = backendCategory.locator('[data-testid="skill-card"]');
		const backendCount = await backendSkills.count();
		expect(backendCount).toBeGreaterThanOrEqual(2);

		const toolSkills = toolsCategory.locator('[data-testid="skill-card"]');
		const toolCount = await toolSkills.count();
		expect(toolCount).toBeGreaterThanOrEqual(2);
	});

	test('should display skill proficiency levels', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		const skillCards = page.locator('[data-testid="skill-card"]');
		const firstSkill = skillCards.first();

		// Check skill card structure
		await expect(firstSkill).toBeVisible();
		await expect(firstSkill.locator('[data-testid="skill-name"]')).toBeVisible();
		await expect(firstSkill.locator('[data-testid="skill-proficiency"]')).toBeVisible();

		// Verify proficiency is displayed (1-5 scale)
		const proficiency = firstSkill.locator('[data-testid="skill-proficiency"]');
		const proficiencyLevel = await proficiency.getAttribute('data-level');
		expect(parseInt(proficiencyLevel || '0')).toBeGreaterThanOrEqual(1);
		expect(parseInt(proficiencyLevel || '6')).toBeLessThanOrEqual(5);
	});

	test('should show featured projects with proper information', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		const projectsSection = page.locator('[data-testid="featured-projects-section"]');
		const projectCards = projectsSection.locator('[data-testid="project-card"]');

		const firstProject = projectCards.first();

		// Verify project card contains all required elements
		await expect(firstProject.locator('[data-testid="project-title"]')).toBeVisible();
		await expect(firstProject.locator('[data-testid="project-description"]')).toBeVisible();
		await expect(firstProject.locator('[data-testid="project-technologies"]')).toBeVisible();

		// Check for action buttons/links
		const projectLinks = firstProject.locator('a');
		const linkCount = await projectLinks.count();
		expect(linkCount).toBeGreaterThanOrEqual(1); // At least view project or GitHub link
	});

	test('should have responsive design for mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 812 });
		await page.waitForLoadState('networkidle');

		// Verify mobile navigation works
		const mobileMenuButton = page.locator('[data-testid="mobile-menu-toggle"]');
		await expect(mobileMenuButton).toBeVisible();

		// Click mobile menu and verify it opens
		await mobileMenuButton.click();
		const mobileNav = page.locator('[data-testid="mobile-navigation"]');
		await expect(mobileNav).toBeVisible();

		// Verify sections are still accessible on mobile
		const heroSection = page.locator('[data-testid="hero-section"]');
		await expect(heroSection).toBeVisible();

		const skillsSection = page.locator('[data-testid="skills-section"]');
		await expect(skillsSection).toBeVisible();

		// Check that content is responsive
		const skillCards = skillsSection.locator('[data-testid="skill-card"]');
		await expect(skillCards.first()).toBeVisible();
	});

	test('should handle loading states gracefully', async ({ page }) => {
		// Test loading behavior
		const response = page.goto('/');

		// Check that page shows loading states before data loads
		await page.waitForSelector('[data-testid="skills-section"]');

		// Ensure no error states are shown
		const errorMessages = page.locator('[data-testid="error-message"]');
		await expect(errorMessages).toHaveCount(0);

		await response;

		// Wait for content to finish loading
		await page.waitForSelector('[data-testid="skill-card"]', { timeout: 5000 });
		await page.waitForSelector('[data-testid="project-card"]', { timeout: 5000 });

		// Verify content loaded successfully
		const finalSkillCount = await page.locator('[data-testid="skill-card"]').count();
		expect(finalSkillCount).toBeGreaterThanOrEqual(5);

		const finalProjectCount = await page.locator('[data-testid="project-card"]').count();
		expect(finalProjectCount).toBeGreaterThanOrEqual(1);
	});

	test('should display contact information correctly', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		const contactSection = page.locator('[data-testid="contact-section"]');

		// Verify contact methods are displayed
		const contactInfo = contactSection.locator('[data-testid="contact-info"]');
		await expect(contactInfo).toBeVisible();

		// Check social media links
		const githubLink = contactSection.locator('[data-testid="social-link-github"]');
		await expect(githubLink).toBeVisible();
		await expect(githubLink).toHaveAttribute('href', /github/);

		const linkedinLink = contactSection.locator('[data-testid="social-link-linkedin"]');
		await expect(linkedinLink).toBeVisible();
		await expect(linkedinLink).toHaveAttribute('href', /linkedin/);

		// Verify external links open in new tab
		await expect(githubLink).toHaveAttribute('target', '_blank');
		await expect(linkedinLink).toHaveAttribute('target', '_blank');
	});
});
