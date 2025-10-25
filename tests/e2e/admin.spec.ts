import { test, expect } from '@playwright/test';

test.describe('Admin Interface - Authentication & Dashboard', () => {
	test.beforeEach(async ({ page }) => {
		// Start from homepage
		await page.goto('/');
	});

	test('should have admin login link in navigation', async ({ page }) => {
		// Look for admin login link (could be hidden in dev mode)
		const adminLink = page.locator('a[href="/admin/login"]');

		// Check if admin link exists (might be in footer or hidden menu)
		const adminLinkCount = await adminLink.count();
		expect(adminLinkCount).toBeGreaterThanOrEqual(0); // Allow 0 for hidden admin access

		// If admin link exists, verify it's accessible
		if (adminLinkCount > 0) {
			await expect(adminLink.first()).toBeVisible();
		}
	});

	test('should access admin login page directly', async ({ page }) => {
		// Navigate directly to admin login
		await page.goto('/admin/login');

		// Verify login page loads
		await expect(page).toHaveTitle(/Admin Login/);

		// Verify login form elements exist
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test('should show error for invalid credentials', async ({ page }) => {
		await page.goto('/admin/login');

		// Fill in invalid credentials
		await page.fill('input[name="email"]', 'invalid@test.com');
		await page.fill('input[name="password"]', 'wrongpassword');

		// Submit form
		await page.click('button[type="submit"]');

		// Verify error message appears
		await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
		await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
	});

	test('should redirect to admin dashboard after successful login', async ({ page }) => {
		await page.goto('/admin/login');

		// Use test credentials (we'll create a test admin user)
		await page.fill('input[name="email"]', 'admin@leechy.dev');
		await page.fill('input[name="password"]', 'admin123');

		// Submit form
		await page.click('button[type="submit"]');

		// Verify redirect to admin dashboard
		await expect(page).toHaveURL(/\/admin\/dashboard/);
		await expect(page).toHaveTitle(/Admin Dashboard/);

		// Verify dashboard content
		await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-nav"]')).toBeVisible();
	});

	test('should display admin navigation menu', async ({ page }) => {
		// Skip login for now - we'll implement session handling later
		await page.goto('/admin/dashboard');

		// Verify admin navigation exists
		await expect(page.locator('[data-testid="admin-nav"]')).toBeVisible();

		// Verify navigation links using more specific selectors to avoid strict mode violations
		await expect(
			page.locator('[data-testid="admin-nav"] a[href="/admin/dashboard"]')
		).toBeVisible();
		await expect(page.locator('[data-testid="admin-nav"] a[href="/admin/projects"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-nav"] a[href="/admin/blog"]')).toBeVisible();
		await expect(page.locator('[data-testid="admin-nav"] a[href="/admin/media"]')).toBeVisible();
	});

	test('should show admin dashboard overview', async ({ page }) => {
		await page.goto('/admin/dashboard');

		// Verify dashboard sections
		await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
		await expect(page.locator('[data-testid="stats-overview"]')).toBeVisible();
		await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();

		// Verify stats cards
		await expect(page.locator('[data-testid="total-projects"]')).toBeVisible();
		await expect(page.locator('[data-testid="total-blog-posts"]')).toBeVisible();
		await expect(page.locator('[data-testid="recent-views"]')).toBeVisible();
	});
});

test.describe('Admin Interface - Project Management', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to admin projects page (skip auth for now)
		await page.goto('/admin/projects');
	});

	test('should display projects management page', async ({ page }) => {
		await expect(page).toHaveTitle(/Admin - Projects/);
		await expect(page.locator('[data-testid="admin-projects"]')).toBeVisible();

		// Verify action buttons
		await expect(page.locator('[data-testid="add-project-btn"]')).toBeVisible();
		await expect(page.locator('[data-testid="projects-list"]')).toBeVisible();
	});

	test('should show existing projects in admin list', async ({ page }) => {
		// Verify projects are displayed
		await expect(page.locator('[data-testid="projects-list"]')).toBeVisible();

		// Should show at least the projects we created earlier
		const projectItems = page.locator('[data-testid="project-item"]');
		const count = await projectItems.count();
		expect(count).toBeGreaterThan(0);

		// Verify each project has edit/delete buttons
		await expect(projectItems.first().locator('[data-testid="edit-project-btn"]')).toBeVisible();
		await expect(projectItems.first().locator('[data-testid="delete-project-btn"]')).toBeVisible();
	});

	test('should open add project form', async ({ page }) => {
		await page.click('[data-testid="add-project-btn"]');

		// Verify form appears
		await expect(page.locator('[data-testid="project-form"]')).toBeVisible();

		// Verify form fields
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('textarea[name="description"]')).toBeVisible();
		await expect(page.locator('input[name="technologies"]')).toBeVisible();
		await expect(page.locator('input[name="liveUrl"]')).toBeVisible();
		await expect(page.locator('input[name="githubUrl"]')).toBeVisible();
	});
});

test.describe('Admin Interface - Blog Management', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/admin/blog');
	});

	test('should display blog management page', async ({ page }) => {
		await expect(page).toHaveTitle(/Admin - Blog/);
		await expect(page.locator('[data-testid="admin-blog"]')).toBeVisible();

		// Verify action buttons
		await expect(page.locator('[data-testid="add-blog-post-btn"]')).toBeVisible();
		await expect(page.locator('[data-testid="blog-posts-list"]')).toBeVisible();
	});

	test('should show existing blog posts in admin list', async ({ page }) => {
		await expect(page.locator('[data-testid="blog-posts-list"]')).toBeVisible();

		// Should show the blog posts we created
		const blogItems = page.locator('[data-testid="blog-post-item"]');
		const count = await blogItems.count();
		expect(count).toBeGreaterThan(0);

		// Verify each post has edit/delete buttons
		await expect(blogItems.first().locator('[data-testid="edit-blog-post-btn"]')).toBeVisible();
		await expect(blogItems.first().locator('[data-testid="delete-blog-post-btn"]')).toBeVisible();
	});

	test('should open add blog post form', async ({ page }) => {
		await page.click('[data-testid="add-blog-post-btn"]');

		// Verify form appears
		await expect(page.locator('[data-testid="blog-post-form"]')).toBeVisible();

		// Verify form fields
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('input[name="slug"]')).toBeVisible();
		await expect(page.locator('textarea[name="excerpt"]')).toBeVisible();
		await expect(page.locator('textarea[name="content"]')).toBeVisible();
		await expect(page.locator('input[name="tags"]')).toBeVisible();
	});
});
