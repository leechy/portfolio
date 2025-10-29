import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import BlogPreview from '$lib/components/BlogPreview.svelte';
import type { BlogPost } from '$lib/server/database.js';

// Mock blog post data for testing - matching actual BlogPost interface
const mockBlogPost: BlogPost = {
  id: 1,
  title: 'Getting Started with SvelteKit',
  slug: 'getting-started-with-sveltekit',
  category: 'JavaScript',
  excerpt: 'Learn how to build modern web applications with SvelteKit.',
  content: 'This is a comprehensive guide to getting started with SvelteKit...',
  published_at: '2024-01-15T00:00:00Z',
  tags: ['SvelteKit', 'JavaScript', 'Web Development'],
  featured_image: '/images/blog/sveltekit-guide.jpg',
  status: 'published',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z'
};

const mockBlogPostMinimal: BlogPost = {
  id: 2,
  title: 'CSS Grid Layout Tips',
  slug: 'css-grid-layout-tips',
  category: 'CSS',
  excerpt: 'Essential tips and tricks for mastering CSS Grid layouts.',
  content: 'CSS Grid is a powerful layout system...',
  published_at: '2024-02-10T00:00:00Z',
  tags: ['CSS', 'Frontend'],
  status: 'published',
  created_at: '2024-02-10T00:00:00Z',
  updated_at: '2024-02-10T00:00:00Z'
  // No featured_image - testing without cover image
};

describe('BlogPreview Component - Basic Tests', () => {
  it('should render blog post preview', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost
      }
    });

    // Check that main container is present
    const preview = screen.getByTestId('blog-post-preview');
    expect(preview).toBeDefined();

    // Check title is rendered
    const title = screen.getByTestId('blog-post-title');
    expect(title).toBeDefined();
    expect(title.textContent).toContain(mockBlogPost.title);
  });

  it('should render blog excerpt when showExcerpt is true', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost,
        showExcerpt: true
      }
    });

    const excerpt = screen.getByTestId('blog-post-excerpt');
    expect(excerpt).toBeDefined();
    expect(excerpt.textContent).toContain(mockBlogPost.excerpt);
  });

  it('should render cover image when provided', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost,
        showImage: true
      }
    });

    const coverImage = screen.getByTestId('blog-cover-image');
    expect(coverImage).toBeDefined();
    expect(coverImage.getAttribute('src')).toBe(mockBlogPost.featured_image);
    expect(coverImage.getAttribute('alt')).toBe(mockBlogPost.title);
  });

  it('should not render cover image when not provided', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPostMinimal,
        showImage: true
      }
    });

    const coverImage = screen.queryByTestId('blog-cover-image');
    expect(coverImage).toBeNull();
  });

  it('should render blog tags', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost
      }
    });

    const tagsContainer = screen.getByTestId('blog-post-tags');
    expect(tagsContainer).toBeDefined();

    // Check that all tags are rendered
    mockBlogPost.tags.forEach(tag => {
      const tagElement = screen.getByText(tag);
      expect(tagElement).toBeDefined();
    });
  });

  it('should have correct read more link', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost
      }
    });

    const readMoreLink = screen.getByTestId('blog-read-more');
    expect(readMoreLink).toBeDefined();

    // The read more link should be inside an <a> tag with correct href
    const linkElement = readMoreLink.closest('a');
    expect(linkElement?.getAttribute('href')).toBe(`/blog/${mockBlogPost.slug}`);
  });

  it('should render publication date', () => {
    render(BlogPreview, {
      props: {
        blog: mockBlogPost
      }
    });

    const dateElement = screen.getByTestId('blog-post-date');
    expect(dateElement).toBeDefined();
    // Date should be formatted (not the raw ISO string)
    expect(dateElement.textContent).not.toBe(mockBlogPost.published_at);
  });

  it('should handle props correctly', () => {
    const { rerender } = render(BlogPreview, {
      props: {
        blog: mockBlogPost,
        showExcerpt: false,
        showImage: false,
        showReadTime: false,
        showAuthor: false
      }
    });

    // Excerpt should not be rendered
    expect(screen.queryByTestId('blog-post-excerpt')).toBeNull();

    // Image should not be rendered
    expect(screen.queryByTestId('blog-cover-image')).toBeNull();

    // Read time and author should not be rendered
    expect(screen.queryByTestId('blog-post-read-time')).toBeNull();
    expect(screen.queryByTestId('blog-post-author')).toBeNull();
  });

  it('should update when blog prop changes', async () => {
    const { rerender } = render(BlogPreview, {
      props: {
        blog: mockBlogPost
      }
    });

    // Initial state
    let titleElement = screen.getByTestId('blog-post-title');
    expect(titleElement.textContent).toContain(mockBlogPost.title);

    // Update the blog prop
    await rerender({
      blog: mockBlogPostMinimal
    });

    // Should reflect the new blog post
    titleElement = screen.getByTestId('blog-post-title');
    expect(titleElement.textContent).toContain(mockBlogPostMinimal.title);
  });
});
