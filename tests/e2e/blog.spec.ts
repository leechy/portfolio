import { test, expect } from '@playwright/test';

test.describe('Blog - User Story 3', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first to ensure consistent navigation
    await page.goto('/');
    // Wait for homepage to fully load
    await page.waitForSelector('[data-testid="hero-section"]');
  });

  test('should navigate from homepage to blog section', async ({ page }) => {
    // Click on the Blog navigation link
    await page.click('nav a[href="/blog"]');

    // Wait for blog page to load
    await page.waitForSelector('[data-testid="blog-section"]');

    // Verify we're on the blog page
    expect(page.url()).toContain('/blog');

    // Verify blog page header is visible
    await expect(page.locator('[data-testid="blog-header"]')).toBeVisible();

    // Verify blog posts list is visible
    await expect(page.locator('[data-testid="blog-posts-list"]')).toBeVisible();
  });

  test('should display list of blog posts with essential information', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Verify at least one blog post is displayed
    const blogPosts = page.locator('[data-testid="blog-post-preview"]');
    await expect(blogPosts.first()).toBeVisible();

    // Check first blog post has required elements
    const firstPost = blogPosts.first();

    // Verify blog post title is visible and clickable
    await expect(firstPost.locator('[data-testid="blog-post-title"]')).toBeVisible();

    // Verify blog post excerpt/preview is visible
    await expect(firstPost.locator('[data-testid="blog-post-excerpt"]')).toBeVisible();

    // Verify blog post metadata (date, read time) is visible
    await expect(firstPost.locator('[data-testid="blog-post-date"]')).toBeVisible();
    await expect(firstPost.locator('[data-testid="blog-post-read-time"]')).toBeVisible();

    // Verify blog post tags are visible
    await expect(firstPost.locator('[data-testid="blog-post-tags"]')).toBeVisible();

    // Verify "Read More" or similar navigation link exists
    await expect(firstPost.locator('[data-testid="blog-read-more"]')).toBeVisible();
  });

  test('should navigate from blog list to individual blog post', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Get the first blog post title for verification
    const firstPostTitle = await page
      .locator('[data-testid="blog-post-title"]')
      .first()
      .textContent();

    // Click on the first blog post
    await page.click('[data-testid="blog-post-preview"]:first-child');

    // Verify we navigated to a blog post page
    expect(page.url()).toMatch(/\/blog\/[^\/]+$/);

    // Wait for blog post content to load
    await page.waitForSelector('[data-testid="blog-post-content"]');

    // Verify blog post title matches what we clicked
    const postTitle = await page.locator('[data-testid="blog-title"]').textContent();
    expect(postTitle).toBe(firstPostTitle);

    // Verify blog post content is displayed
    await expect(page.locator('[data-testid="blog-post-content"]')).toBeVisible();

    // Verify blog post metadata is displayed
    await expect(page.locator('[data-testid="blog-post-metadata"]')).toBeVisible();
  });

  test('should display full blog post content with metadata', async ({ page }) => {
    // Navigate directly to a blog post
    await page.goto('/blog/first-blog-post');

    // Wait for blog post to load
    await page.waitForSelector('[data-testid="blog-post-content"]');

    // Verify breadcrumb navigation is present
    await expect(page.locator('[data-testid="breadcrumb"]')).toBeVisible();
    await expect(page.locator('[data-testid="breadcrumb"] a[href="/blog"]')).toBeVisible();

    // Verify blog post title is displayed
    await expect(page.locator('[data-testid="blog-title"]')).toBeVisible(); // Verify blog post content is substantial (not just a preview)
    const content = page.locator('[data-testid="blog-post-content"]');
    await expect(content).toBeVisible();
    const contentText = await content.textContent();
    expect(contentText?.length).toBeGreaterThan(100); // Should be more than just an excerpt

    // Verify publication date is displayed
    await expect(page.locator('[data-testid="blog-date"]')).toBeVisible();

    // Verify read time estimate is displayed
    await expect(page.locator('[data-testid="blog-read-time"]')).toBeVisible(); // Verify tags are displayed
    await expect(page.locator('[data-testid="blog-tag"]').first()).toBeVisible();

    // Verify author information is displayed
    await expect(page.locator('[data-testid="blog-author"]')).toBeVisible();
  });

  test('should provide navigation back to blog list from individual post', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/blog/first-blog-post');
    await page.waitForSelector('[data-testid="blog-post-content"]');

    // Click breadcrumb to go back to blog list
    await page.click('[data-testid="breadcrumb"] a[href="/blog"]');

    // Verify we're back on the blog list page
    await page.waitForSelector('[data-testid="blog-posts-list"]');
    expect(page.url()).toBe(`${page.url().split('/blog')[0]}/blog`);

    // Verify blog posts are visible again
    await expect(page.locator('[data-testid="blog-post-preview"]').first()).toBeVisible();
  });

  test('should provide navigation back to portfolio from blog section', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Click on portfolio/home link in navigation
    await page.click('nav a[href="/"]');

    // Verify we're back on the homepage
    await page.waitForSelector('[data-testid="hero-section"]');
    expect(page.url()).toMatch(/http:\/\/127\.0\.0\.1:\d+\/?$/); // Verify homepage content is visible
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
  });

  test('should implement blog search functionality', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Verify search input is present
    await expect(page.locator('[data-testid="blog-search-input"]')).toBeVisible();

    // Enter search term
    await page.fill('[data-testid="blog-search-input"]', 'javascript');

    // Verify search results are filtered
    const searchResults = page.locator('[data-testid="blog-post-preview"]');
    await expect(searchResults.first()).toBeVisible();

    // Verify search term is highlighted or results are relevant
    const firstResult = searchResults.first();
    const firstResultText = await firstResult.textContent();
    expect(firstResultText?.toLowerCase()).toContain('javascript');
  });

  test('should filter blog posts by tags', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Verify tag filter section is present
    await expect(page.locator('[data-testid="blog-tag-filters"]')).toBeVisible();

    // Click on a tag filter
    const firstTag = page.locator('[data-testid="blog-tag-filter"]').first();
    const tagText = await firstTag.textContent();
    await firstTag.click();

    // Verify posts are filtered by the selected tag
    const filteredPosts = page.locator('[data-testid="blog-post-preview"]');
    await expect(filteredPosts.first()).toBeVisible();

    // Verify filtered posts contain the selected tag
    const firstPost = filteredPosts.first();
    const postTags = await firstPost.locator('[data-testid="blog-post-tags"]').textContent();
    expect(postTags?.toLowerCase()).toContain(tagText?.toLowerCase());
  });

  test('should display related posts on individual blog post pages', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/blog/first-blog-post');
    await page.waitForSelector('[data-testid="blog-post-content"]');

    // Scroll to bottom of post to see related posts
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify related posts section is present
    await expect(page.locator('[data-testid="related-posts"]')).toBeVisible();

    // Verify at least one related post is shown
    await expect(page.locator('[data-testid="related-post-card"]').first()).toBeVisible();

    // Verify related posts have titles and are clickable
    const relatedPost = page.locator('[data-testid="related-post-card"]').first();
    await expect(relatedPost.locator('[data-testid="related-post-title"]')).toBeVisible();
    await expect(relatedPost.locator('a')).toBeVisible();
  });

  test('should handle non-existent blog posts (404)', async ({ page }) => {
    // Navigate to a non-existent blog post
    await page.goto('/blog/non-existent-post');

    // Verify 404/not found message is displayed
    await page.waitForSelector('[data-testid="not-found-section"]');
    await expect(page.locator('[data-testid="not-found-section"]')).toBeVisible();

    // Verify error message mentions blog post not found
    const errorText = await page.locator('[data-testid="not-found-section"]').textContent();
    expect(errorText?.toLowerCase()).toMatch(/(not found|404|blog post.*exist)/);

    // Verify link to go back to blog list
    await expect(page.locator('a[href="/blog"]').first()).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to blog page
    await page.goto('/blog');
    await page.waitForSelector('[data-testid="blog-section"]');

    // Verify blog posts are displayed properly on mobile
    await expect(page.locator('[data-testid="blog-post-preview"]').first()).toBeVisible();

    // Verify mobile navigation works
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    if (await mobileNav.isVisible()) {
      await mobileNav.click();
      await expect(page.locator('nav a[href="/"]')).toBeVisible();
    }

    // Navigate to individual blog post
    await page.click(
      '[data-testid="blog-post-preview"]:first-child [data-testid="blog-read-more"]'
    );
    await page.waitForSelector('[data-testid="blog-post-content"]');

    // Verify blog post content is readable on mobile
    const content = page.locator('[data-testid="blog-post-content"]');
    await expect(content).toBeVisible();

    // Verify text doesn't overflow on mobile
    const contentBox = await content.boundingBox();
    expect(contentBox?.width).toBeLessThanOrEqual(375);
  });
});
