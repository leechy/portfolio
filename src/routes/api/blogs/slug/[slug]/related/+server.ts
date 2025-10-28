import { error, json } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';
import type { RequestHandler } from './$types';

const blogService = new BlogService();

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const { slug } = params;
    const limit = parseInt(url.searchParams.get('limit') || '3');

    if (!slug) {
      throw error(400, 'Blog slug is required');
    }

    // First get the blog post by slug to get its ID
    const post = await blogService.getBlogPostBySlug(slug);
    if (!post) {
      throw error(404, 'Blog post not found');
    }

    // Get related posts
    const relatedPosts = await blogService.getRelatedBlogPosts(post.id, limit);

    return json(relatedPosts);
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    return json({ error: 'Failed to fetch related blog posts' }, { status: 500 });
  }
};
