import { json } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';
import type { RequestHandler } from './$types';

const blogService = new BlogService();

export const GET: RequestHandler = async () => {
  try {
    const allPosts = await blogService.getAllBlogPosts();

    const stats = {
      total: allPosts.length,
      published: allPosts.filter(p => p.status === 'published').length,
      draft: allPosts.filter(p => p.status === 'draft').length,
      archived: allPosts.filter(p => p.status === 'archived').length
    };

    return json(stats);
  } catch {
    return json({ error: 'Failed to fetch blog statistics' }, { status: 500 });
  }
};
