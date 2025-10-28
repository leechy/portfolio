import { error, json } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';
import type { RequestHandler } from './$types';

const blogService = new BlogService();

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { slug } = params;

    if (!slug) {
      throw error(400, 'Blog slug is required');
    }

    const post = await blogService.getBlogPostBySlug(slug);
    if (!post) {
      throw error(404, 'Blog post not found');
    }

    return json(post);
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    return json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
};
