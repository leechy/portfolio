import { json } from '@sveltejs/kit';
import { BlogService } from '$lib/server/blogs.js';
import type { RequestHandler } from './$types';
import type { BlogStatus } from '$lib/stores/blogs.js';

const blogService = new BlogService();

export const GET: RequestHandler = async ({ url }) => {
	try {
		const status = url.searchParams.get('status');
		const search = url.searchParams.get('search');

		let posts;

		if (status) {
			posts = await blogService.getBlogPostsByStatus(status as BlogStatus);
		} else if (search) {
			posts = await blogService.searchBlogPosts(search);
		} else {
			posts = await blogService.getAllBlogPosts();
		}

		return json(posts);
	} catch {
		return json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const postData = await request.json();
		const newPost = await blogService.createBlogPost(postData);
		return json(newPost, { status: 201 });
	} catch {
		return json({ error: 'Failed to create blog post' }, { status: 500 });
	}
};
