import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import BlogPreview from '$lib/components/BlogPreview.svelte';
import type { BlogPost } from '$lib/server/database.js';

// Mock blog post data for testing - matching actual BlogPost interface
const mockBlogPost: BlogPost = {
  id: 1,
  title: 'Getting Started with SvelteKit',
  slug: 'getting-started-with-sveltekit',
  excerpt:
    'Learn how to build modern web applications with SvelteKit, the official framework for Svelte applications.',
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
  excerpt: 'Essential tips and tricks for mastering CSS Grid layouts.',
  content: 'CSS Grid is a powerful layout system...',
  published_at: '2024-02-10T00:00:00Z',
  tags: ['CSS', 'Frontend'],
  status: 'published',
  created_at: '2024-02-10T00:00:00Z',
  updated_at: '2024-02-10T00:00:00Z'
  // No featured_image - testing without cover image
};

describe('BlogPreview Component', () => {
  describe('Rendering', () => {
    it('should render blog post preview with all required elements', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      // Check that main container is present
      expect(screen.getByTestId('blog-post-preview')).toBeInTheDocument();

      // Check title
      expect(screen.getByTestId('blog-post-title')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-title')).toHaveTextContent(mockBlogPost.title);

      // Check excerpt
      expect(screen.getByTestId('blog-post-excerpt')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-excerpt')).toHaveTextContent(mockBlogPost.excerpt || '');

      // Check publication date
      expect(screen.getByTestId('blog-post-date')).toBeInTheDocument();

      // Check read time (hardcoded in component)
      expect(screen.getByTestId('blog-post-read-time')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-read-time')).toHaveTextContent('5 min read');

      // Check author (hardcoded in component)
      expect(screen.getByTestId('blog-post-author')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-author')).toHaveTextContent('by Admin');

      // Check tags
      expect(screen.getByTestId('blog-post-tags')).toBeInTheDocument();

      // Check "Read More" link
      expect(screen.getByTestId('blog-read-more')).toBeInTheDocument();
    });

    it('should render blog post tags correctly', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const tagsContainer = screen.getByTestId('blog-post-tags');
      expect(tagsContainer).toBeInTheDocument();

      // Check that all tags are rendered
      mockBlogPost.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });

      // Check that tags have proper test IDs
      const tagElements = screen.getAllByTestId('blog-tag');
      expect(tagElements).toHaveLength(mockBlogPost.tags.length);
    });

    it('should render cover image when provided', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const coverImage = screen.getByTestId('blog-cover-image');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', mockBlogPost.featured_image);
      expect(coverImage).toHaveAttribute('alt', mockBlogPost.title);
    });

    it('should handle blog post without cover image', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPostMinimal
        }
      });

      // Cover image should not be present
      expect(screen.queryByTestId('blog-cover-image')).not.toBeInTheDocument();

      // Other elements should still be present
      expect(screen.getByTestId('blog-post-title')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-excerpt')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format publication date correctly', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const dateElement = screen.getByTestId('blog-post-date');
      const dateText = dateElement.textContent;

      // Should contain month and year at minimum
      expect(dateText).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
      expect(dateText).toMatch(/2024/);
    });

    it('should handle different date formats', () => {
      const recentPost = {
        ...mockBlogPost,
        publishedAt: new Date() // Today's date
      };

      render(BlogPreview, {
        props: {
          blog: recentPost
        }
      });

      const dateElement = screen.getByTestId('blog-post-date');
      expect(dateElement).toBeInTheDocument();
    });
  });

  describe('Read Time Display', () => {
    it('should display singular "min read" for 1 minute', () => {
      const oneMinutePost = {
        ...mockBlogPost,
        readTimeMinutes: 1
      };

      render(BlogPreview, {
        props: {
          blog: oneMinutePost
        }
      });

      expect(screen.getByTestId('blog-post-read-time')).toHaveTextContent('1 min read');
    });

    it('should display plural "min read" for multiple minutes', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      expect(screen.getByTestId('blog-post-read-time')).toHaveTextContent('8 min read');
    });

    it('should handle long read times appropriately', () => {
      const longPost = {
        ...mockBlogPost,
        readTimeMinutes: 25
      };

      render(BlogPreview, {
        props: {
          blog: longPost
        }
      });

      expect(screen.getByTestId('blog-post-read-time')).toHaveTextContent('25 min read');
    });
  });

  describe('Navigation', () => {
    it('should have correct href for read more link', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const readMoreLink = screen.getByTestId('blog-read-more');
      expect(readMoreLink).toHaveAttribute('href', `/blog/${mockBlogPost.slug}`);
    });

    it('should make entire card clickable', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const previewCard = screen.getByTestId('blog-post-preview');

      // Check if card has click behavior (role or href)
      expect(
        previewCard.getAttribute('role') === 'button' ||
          previewCard.getAttribute('href') === `/blog/${mockBlogPost.slug}` ||
          previewCard.querySelector('a[href*="/blog/"]')
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const previewCard = screen.getByTestId('blog-post-preview');

      // Should have appropriate role for interactive elements
      const interactiveElement = previewCard.querySelector('[role="button"], a');
      expect(interactiveElement).toBeInTheDocument();
    });

    it('should have alt text for cover images', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const coverImage = screen.getByTestId('blog-cover-image');
      expect(coverImage).toHaveAttribute('alt');
      expect(coverImage.getAttribute('alt')).toBeTruthy();
    });

    it('should be keyboard navigable', () => {
      render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      const readMoreLink = screen.getByTestId('blog-read-more');

      // Should be focusable
      readMoreLink.focus();
      expect(document.activeElement).toBe(readMoreLink);
    });
  });

  describe('Content Truncation', () => {
    it('should handle long excerpts appropriately', () => {
      const longExcerptPost = {
        ...mockBlogPost,
        excerpt:
          'This is a very long excerpt that should be handled appropriately by the BlogPreview component. It contains a lot of text that might need to be truncated or displayed in a way that maintains good user experience and visual design. The component should handle this gracefully without breaking the layout.'
      };

      render(BlogPreview, {
        props: {
          blog: longExcerptPost
        }
      });

      const excerptElement = screen.getByTestId('blog-post-excerpt');
      expect(excerptElement).toBeInTheDocument();
      expect(excerptElement).toHaveTextContent(longExcerptPost.excerpt);
    });

    it('should handle long titles appropriately', () => {
      const longTitlePost = {
        ...mockBlogPost,
        title:
          'This Is a Very Long Blog Post Title That Might Need Special Handling in the UI Components'
      };

      render(BlogPreview, {
        props: {
          blog: longTitlePost
        }
      });

      const titleElement = screen.getByTestId('blog-post-title');
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent(longTitlePost.title);
    });
  });

  describe('Tag Handling', () => {
    it('should handle posts with no tags', () => {
      const noTagsPost = {
        ...mockBlogPost,
        tags: []
      };

      render(BlogPreview, {
        props: {
          blog: noTagsPost
        }
      });

      // Tags container might be present but empty, or not present at all
      const tagsContainer = screen.queryByTestId('blog-post-tags');
      if (tagsContainer) {
        expect(tagsContainer).toBeEmptyDOMElement();
      }
    });

    it('should handle posts with many tags', () => {
      const manyTagsPost = {
        ...mockBlogPost,
        tags: [
          'JavaScript',
          'TypeScript',
          'SvelteKit',
          'Frontend',
          'Backend',
          'CSS',
          'HTML',
          'WebDev'
        ]
      };

      render(BlogPreview, {
        props: {
          blog: manyTagsPost
        }
      });

      const tagsContainer = screen.getByTestId('blog-post-tags');
      expect(tagsContainer).toBeInTheDocument();

      // All tags should be rendered
      manyTagsPost.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should handle tags with special characters', () => {
      const specialTagsPost = {
        ...mockBlogPost,
        tags: ['C++', 'Node.js', 'React.js', 'CSS-in-JS']
      };

      render(BlogPreview, {
        props: {
          blog: specialTagsPost
        }
      });

      specialTagsPost.tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Props Validation', () => {
    it('should handle missing optional properties gracefully', async () => {
      const minimalPost = {
        id: 'minimal-post',
        title: 'Minimal Post',
        slug: 'minimal-post',
        excerpt: 'A minimal post for testing.',
        content: 'Content here.',
        publishedAt: new Date(),
        tags: ['Test'],
        author: 'Test Author',
        readTimeMinutes: 2
        // Missing coverImageUrl and featured
      };

      render(BlogPreview, {
        props: {
          blog: minimalPost
        }
      });

      // Should render without errors
      expect(screen.getByTestId('blog-post-preview')).toBeInTheDocument();
      expect(screen.getByTestId('blog-post-title')).toBeInTheDocument();
    });

    it('should update when blog prop changes', async () => {
      const { rerender } = render(BlogPreview, {
        props: {
          blog: mockBlogPost
        }
      });

      // Initial state
      expect(screen.getByTestId('blog-post-title')).toHaveTextContent(mockBlogPost.title);

      // Update the blog prop
      await rerender({
        blog: mockBlogPostMinimal
      });

      await tick();

      // Should reflect the new blog post
      expect(screen.getByTestId('blog-post-title')).toHaveTextContent(mockBlogPostMinimal.title);
    });
  });
});
