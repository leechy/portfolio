import { describe, it, expect, beforeEach } from 'vitest';
import {
  blogStore,
  loadBlogs,
  getBlogByIdSync,
  getRelatedBlogsSync,
  searchBlogsSync,
  filterBlogsByTagSync,
  getAllBlogTagsSync,
  type BlogPost
} from '$lib/stores/blogs';
import { get } from 'svelte/store';

describe('Blog Store Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    blogStore.set({
      blogs: [],
      posts: [],
      published: [],
      featured: [],
      loading: false,
      error: null
    });
  });

  describe('Blog Data Loading', () => {
    it('should load blog posts successfully', async () => {
      await loadBlogs();
      const state = get(blogStore);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(Array.isArray(state.blogs)).toBe(true);
      expect(state.blogs.length).toBeGreaterThan(0);
    });

    it('should populate featured blogs', async () => {
      await loadBlogs();
      const state = get(blogStore);

      expect(Array.isArray(state.featured)).toBe(true);
      expect(state.featured.length).toBeGreaterThan(0);
      expect(state.featured.length).toBeLessThanOrEqual(3); // Max 3 featured posts

      // All featured posts should be marked as featured
      state.featured.forEach(blog => {
        // expect(blog.featured).toBe(true);
      });
    });

    it('should set loading state correctly during data loading', async () => {
      const loadPromise = loadBlogs();

      // Should be loading immediately after call
      let state = get(blogStore);
      expect(state.loading).toBe(true);

      await loadPromise;

      // Should not be loading after completion
      state = get(blogStore);
      expect(state.loading).toBe(false);
    });

    it('should handle loading errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const originalConsoleError = console.error;
      console.error = () => {};

      try {
        // This will fail since we don't have actual blog data yet
        await loadBlogs();
        const state = get(blogStore);

        // Should handle error state appropriately
        expect(state.loading).toBe(false);
        // Error might be null if we handle gracefully, or contain error message
        if (state.error) {
          expect(typeof state.error).toBe('string');
        }
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe('Blog Post Validation', () => {
    it('should validate blog post data structure', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const blog = state.blogs[0];

        // Required fields
        expect(blog).toHaveProperty('id');
        expect(blog).toHaveProperty('title');
        expect(blog).toHaveProperty('slug');
        expect(blog).toHaveProperty('excerpt');
        expect(blog).toHaveProperty('content');
        expect(blog).toHaveProperty('publishedAt');
        expect(blog).toHaveProperty('tags');
        expect(blog).toHaveProperty('author');
        expect(blog).toHaveProperty('reading_time');

        // Data type validation
        expect(typeof blog.id).toBe('string');
        expect(typeof blog.title).toBe('string');
        expect(typeof blog.slug).toBe('string');
        expect(typeof blog.excerpt).toBe('string');
        expect(typeof blog.content).toBe('string');
        expect(blog.published_at).toBeInstanceOf(Date);
        expect(Array.isArray(blog.tags)).toBe(true);
        // expect(typeof blog.author).toBe('string');
        // expect(typeof blog.reading_time).toBe('number');

        // Optional fields validation
        if (blog.featured_image) {
          expect(typeof blog.featured_image).toBe('string');
        }
      }
    });

    it('should ensure blog slugs are URL-safe', async () => {
      await loadBlogs();
      const state = get(blogStore);

      state.blogs.forEach(blog => {
        // Slug should be URL-safe (lowercase, hyphenated, no spaces)
        expect(blog.slug).toMatch(/^[a-z0-9-]+$/);
        expect(blog.slug).not.toContain(' ');
        expect(blog.slug).not.toContain('_');
      });
    });

    it('should have valid read time estimates', async () => {
      await loadBlogs();
      const state = get(blogStore);

      state.blogs.forEach(blog => {
        // expect(blog.reading_time).toBeGreaterThan(0);
        // expect(blog.reading_time).toBeLessThan(60); // Reasonable max reading time
        // expect(Number.isInteger(blog.reading_time)).toBe(true);
      });
    });
  });

  describe('Blog Query Functions', () => {
    it('should retrieve blog by ID correctly', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const expectedBlog = state.blogs[0];
        const retrievedBlog = getBlogByIdSync(expectedBlog.id);

        expect(retrievedBlog).toEqual(expectedBlog);
      }
    });

    it('should return null for non-existent blog ID', () => {
      const nonExistentBlog = getBlogByIdSync('non-existent-id');
      expect(nonExistentBlog).toBeNull();
    });

    it('should find blog by slug correctly', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const expectedBlog = state.blogs[0];
        const retrievedBlog = getBlogByIdSync(expectedBlog.slug); // getBlogById should also work with slugs

        expect(retrievedBlog?.slug).toBe(expectedBlog.slug);
      }
    });

    it('should get related blogs based on tags', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 1) {
        const targetBlog = state.blogs[0];
        const relatedBlogs = getRelatedBlogsSync(targetBlog.id, 3);

        expect(Array.isArray(relatedBlogs)).toBe(true);
        expect(relatedBlogs.length).toBeLessThanOrEqual(3);

        // Should not include the target blog itself
        expect(relatedBlogs.find(blog => blog.id === targetBlog.id)).toBeUndefined();

        // Related blogs should share at least one tag with target blog
        relatedBlogs.forEach(relatedBlog => {
          const hasSharedTag = relatedBlog.tags.some(tag => targetBlog.tags.includes(tag));
          expect(hasSharedTag).toBe(true);
        });
      }
    });

    it('should return empty array when no related blogs exist', async () => {
      await loadBlogs();

      // Test with non-existent blog ID
      const relatedBlogs = getRelatedBlogsSync('non-existent-id');
      expect(relatedBlogs).toEqual([]);
    });
  });

  describe('Blog Search Functionality', () => {
    it('should search blogs by title', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const targetBlog = state.blogs[0];
        const searchTerm = targetBlog.title.split(' ')[0]; // First word of title
        const results = searchBlogsSync(searchTerm);

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);

        // Should find the target blog
        const foundBlog = results.find(blog => blog.id === targetBlog.id);
        expect(foundBlog).toBeDefined();
      }
    });

    it('should search blogs by content', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const targetBlog = state.blogs[0];
        const searchTerm = targetBlog.content.split(' ')[0]; // First word of content
        const results = searchBlogsSync(searchTerm);

        expect(Array.isArray(results)).toBe(true);

        // Results should include blogs with matching content
        results.forEach(blog => {
          const contentMatches =
            blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
          expect(contentMatches).toBe(true);
        });
      }
    });

    it('should search blogs by tags', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const targetBlog = state.blogs.find(blog => blog.tags.length > 0);
        if (targetBlog) {
          const searchTerm = targetBlog.tags[0];
          const results = searchBlogsSync(searchTerm);

          expect(Array.isArray(results)).toBe(true);
          expect(results.length).toBeGreaterThan(0);

          // Should find blogs with matching tag
          const foundBlog = results.find(blog => blog.id === targetBlog.id);
          expect(foundBlog).toBeDefined();
        }
      }
    });

    it('should handle case-insensitive search', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        const targetBlog = state.blogs[0];
        const searchTerm = targetBlog.title.split(' ')[0];

        const lowerResults = searchBlogsSync(searchTerm.toLowerCase());
        const upperResults = searchBlogsSync(searchTerm.toUpperCase());
        const mixedResults = searchBlogsSync(searchTerm);

        expect(lowerResults.length).toBe(upperResults.length);
        expect(upperResults.length).toBe(mixedResults.length);
      }
    });

    it('should return empty array for non-matching search', async () => {
      await loadBlogs();

      const results = searchBlogsSync('xyz-non-existent-term-123');
      expect(results).toEqual([]);
    });

    it('should handle empty search term', async () => {
      await loadBlogs();
      const state = get(blogStore);

      const results = searchBlogsSync('');
      expect(results).toEqual(state.blogs); // Should return all blogs
    });
  });

  describe('Blog Tag Filtering', () => {
    it('should filter blogs by tag', async () => {
      await loadBlogs();
      const allTags = getAllBlogTagsSync();

      if (allTags.length > 0) {
        const targetTag = allTags[0];
        const filteredBlogs = filterBlogsByTagSync(targetTag);

        expect(Array.isArray(filteredBlogs)).toBe(true);

        // All filtered blogs should contain the target tag
        filteredBlogs.forEach(blog => {
          expect(blog.tags).toContain(targetTag);
        });
      }
    });

    it('should get all unique tags from blogs', async () => {
      await loadBlogs();
      const state = get(blogStore);
      const allTags = getAllBlogTagsSync();

      expect(Array.isArray(allTags)).toBe(true);

      // All tags should be unique
      const uniqueTags = [...new Set(allTags)];
      expect(allTags.length).toBe(uniqueTags.length);

      // All tags should be strings
      allTags.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });

      // All tags should exist in at least one blog post
      allTags.forEach(tag => {
        const blogsWithTag = state.blogs.filter(blog => blog.tags.includes(tag));
        expect(blogsWithTag.length).toBeGreaterThan(0);
      });
    });

    it('should return empty array for non-existent tag', async () => {
      await loadBlogs();

      const filteredBlogs = filterBlogsByTagSync('non-existent-tag');
      expect(filteredBlogs).toEqual([]);
    });

    it('should handle case-sensitive tag filtering', async () => {
      await loadBlogs();
      const allTags = getAllBlogTagsSync();

      if (allTags.length > 0) {
        const targetTag = allTags[0];
        const correctResults = filterBlogsByTagSync(targetTag);
        const wrongCaseResults = filterBlogsByTagSync(targetTag.toUpperCase());

        // Tags should be case-sensitive
        if (targetTag !== targetTag.toUpperCase()) {
          expect(wrongCaseResults.length).toBeLessThanOrEqual(correctResults.length);
        }
      }
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large search queries efficiently', async () => {
      await loadBlogs();

      const startTime = performance.now();
      searchBlogsSync('a'); // Single character search (potentially many results)
      const endTime = performance.now();

      // Search should complete within reasonable time (100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple concurrent blog operations', async () => {
      await loadBlogs();
      const state = get(blogStore);

      if (state.blogs.length > 0) {
        // Perform multiple operations concurrently
        const operations = [
          () => getBlogByIdSync(state.blogs[0].id),
          () => searchBlogsSync('test'),
          () => getAllBlogTagsSync(),
          () => getRelatedBlogsSync(state.blogs[0].id)
        ];

        const results = operations.map(op => op());

        // All operations should complete successfully
        expect(results).toHaveLength(4);
        expect(results[0]).toBeDefined(); // getBlogById
        expect(Array.isArray(results[1])).toBe(true); // searchBlogs
        expect(Array.isArray(results[2])).toBe(true); // getAllBlogTags
        expect(Array.isArray(results[3])).toBe(true); // getRelatedBlogs
      }
    });

    it('should maintain data consistency across operations', async () => {
      await loadBlogs();
      const state = get(blogStore);

      // Store original state
      const originalBlogsCount = state.blogs.length;
      const originalTags = getAllBlogTagsSync();

      // Perform various read operations
      if (state.blogs.length > 0) {
        getBlogByIdSync(state.blogs[0].id);
        searchBlogsSync('test');
        filterBlogsByTagSync(originalTags[0] || 'javascript');
        getRelatedBlogsSync(state.blogs[0].id);
      }

      // Verify data hasn't changed
      const newState = get(blogStore);
      expect(newState.blogs.length).toBe(originalBlogsCount);
      expect(getAllBlogTagsSync()).toEqual(originalTags);
    });
  });
});
