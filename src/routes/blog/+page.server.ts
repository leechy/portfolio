import { BlogService } from '$lib/server/blogs.js';
import { building } from '$app/environment';

export const load = async () => {
  // During build time, return empty data to prevent SQLite access issues
  if (building) {
    return {
      blogs: [],
      featuredBlogs: [],
      allTags: [],
      meta: {
        total: 0,
        title: 'Leechy’s Dev Thoughts',
        description:
          'Read articles about web development, programming, and technology. Tips, tutorials, and insights from a full-stack developer.'
      }
    };
  }

  try {
    const blogService = new BlogService();

    // Get all blog posts directly from the service
    const allPosts = await blogService.getAllBlogPosts();

    // Filter published posts for the public blog page
    const publishedPosts = allPosts.filter(post => post.status === 'published');

    // Get featured posts (limit to first 3 for now)
    const featuredPosts = publishedPosts.slice(0, 3);

    // Extract all unique tags from published posts
    const allTags = [
      ...new Set(publishedPosts.flatMap(post => post.tags || []).filter(tag => tag && tag.trim()))
    ].sort();

    return {
      blogs: publishedPosts,
      featuredBlogs: featuredPosts,
      allTags,
      meta: {
        total: publishedPosts.length,
        title: 'Leechy’s Dev Thoughts',
        description:
          'Read articles about web development, programming, and technology. Tips, tutorials, and insights from a full-stack developer.'
      }
    };
  } catch {
    // If there's an error, return empty data but don't fail the page
    return {
      blogs: [],
      featuredBlogs: [],
      allTags: [],
      meta: {
        total: 0,
        title: 'Leechy’s Dev Thoughts',
        description:
          'Read articles about web development, programming, and technology. Tips, tutorials, and insights from a full-stack developer.'
      }
    };
  }
};
