import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Re-export database types for compatibility
export type { BlogPost } from '$lib/server/database.js';
export type BlogStatus = 'draft' | 'published' | 'archived';

import type { BlogPost } from '$lib/server/database.js';

export interface BlogsState {
  posts: BlogPost[];
  published: BlogPost[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogsState = {
  posts: [],
  published: [],
  loading: false,
  error: null
};

// Create the store
export const blogsStore = writable<BlogsState>(initialState);

// Create reactive writable store with database operations
function createBlogsStore() {
  const { subscribe, set, update } = writable<BlogPost[]>([]);

  return {
    subscribe,

    // Initialize by loading from API
    init: async () => {
      if (browser) {
        await loadBlogs();
      }
    },

    // Create new blog post (calls API)
    create: async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      const newPost = await response.json();
      update(posts => [...posts, newPost]);
      return newPost;
    },

    // Update existing blog post (calls API)
    updateById: async (
      id: number,
      postData: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>
    ) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      const updatedPost = await response.json();
      update(posts => posts.map(post => (post.id === id ? updatedPost : post)));
      return updatedPost;
    },

    // Delete blog post by ID (calls API)
    deleteById: async (id: number) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      update(posts => posts.filter(post => post.id !== id));
      return true;
    },

    // Get blog post by ID
    getById: (id: number): Promise<BlogPost | null> => {
      return fetch(`/api/blogs/${id}`)
        .then(response => (response.ok ? response.json() : null))
        .catch(() => null);
    },

    // Load all blog posts
    loadAll: async () => {
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to load blog posts');
      }
      const posts = await response.json();
      set(posts);
      return posts;
    },

    // Reset store
    reset: () => set([])
  };
}

// Export the reactive blogs store for admin interface
export const blogs = createBlogsStore();

// Load blog posts data (async to make API calls)
export async function loadBlogs(): Promise<void> {
  if (!browser) {
    return;
  }

  blogsStore.update(state => ({
    ...state,
    loading: true,
    error: null
  }));

  try {
    const response = await fetch('/api/blogs');
    if (!response.ok) {
      throw new Error('Failed to load blog posts');
    }

    const allPosts = await response.json();
    const publishedPosts = allPosts.filter((post: BlogPost) => post.status === 'published');

    blogsStore.update(state => ({
      ...state,
      posts: allPosts,
      published: publishedPosts,
      loading: false,
      error: null
    }));
  } catch (error) {
    blogsStore.update(state => ({
      ...state,
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to load blog posts'
    }));
  }
}

// Helper function to get posts by status
export function getPostsByStatus(status: BlogStatus): Promise<BlogPost[]> {
  return fetch(`/api/blogs?status=${status}`)
    .then(response => (response.ok ? response.json() : []))
    .catch(() => []);
}

// Helper function to search posts
export function searchPosts(query: string): Promise<BlogPost[]> {
  return fetch(`/api/blogs?search=${encodeURIComponent(query)}`)
    .then(response => (response.ok ? response.json() : []))
    .catch(() => []);
}

// Helper function to get post by ID (for detail pages)
export function getBlogPostById(id: number): Promise<BlogPost | null> {
  return fetch(`/api/blogs/${id}`)
    .then(response => (response.ok ? response.json() : null))
    .catch(() => null);
}

// Helper function to get blog statistics
export async function getBlogStatistics(): Promise<{
  total: number;
  published: number;
  draft: number;
  archived: number;
}> {
  try {
    const response = await fetch('/api/blogs/stats');
    if (!response.ok) {
      throw new Error('Failed to load statistics');
    }
    return response.json();
  } catch {
    return { total: 0, published: 0, draft: 0, archived: 0 };
  }
}

// For backward compatibility, export the store with the old name
export const blogStore = blogsStore;

// For backward compatibility - these would need to be implemented with API calls
export const blogPosts: BlogPost[] = [];

// Helper functions that need to be implemented with API calls
export async function getBlogById(idOrSlug: string | number): Promise<BlogPost | null> {
  return getBlogPostById(typeof idOrSlug === 'string' ? parseInt(idOrSlug) : idOrSlug);
}

export async function getRelatedBlogs(blogId: string | number, limit = 3): Promise<BlogPost[]> {
  // This would need to be implemented as an API endpoint
  // For now, return empty array
  void blogId;
  void limit;
  return [];
}

export async function searchBlogs(query: string): Promise<BlogPost[]> {
  return searchPosts(query);
}

export async function getAllBlogTags(): Promise<string[]> {
  // This would need to be implemented as an API endpoint
  return [];
}

export async function filterBlogsByTag(tag: string): Promise<BlogPost[]> {
  // This would need to be implemented as an API endpoint
  void tag;
  return [];
}

export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
