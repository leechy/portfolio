import { error, json } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';
import type { RequestHandler } from './$types';

const blogService = new BlogService();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			throw error(400, 'Invalid blog post ID');
		}

		const post = await blogService.getBlogPostById(id);
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

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			throw error(400, 'Invalid blog post ID');
		}

		const postData = await request.json();
		const updatedPost = await blogService.updateBlogPost(id, postData);

		if (!updatedPost) {
			throw error(404, 'Blog post not found');
		}

		return json(updatedPost);
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		return json({ error: 'Failed to update blog post' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			throw error(400, 'Invalid blog post ID');
		}

		const success = await blogService.deleteBlogPost(id);
		if (!success) {
			throw error(404, 'Blog post not found');
		}

		return json({ success: true });
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		return json({ error: 'Failed to delete blog post' }, { status: 500 });
	}
};
