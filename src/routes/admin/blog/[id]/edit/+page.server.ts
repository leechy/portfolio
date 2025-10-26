import { error } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';

export const load = async ({ params }: { params: { id: string } }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			throw error(400, 'Invalid blog post ID');
		}

		const blogService = new BlogService();
		const post = blogService.getBlogPostById(id);

		if (!post) {
			throw error(404, 'Blog post not found');
		}

		return {
			post
		};
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		throw error(500, 'Failed to load blog post');
	}
};
