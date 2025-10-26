import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { BlogPost } from '$lib/server/database.js';

export const load: PageLoad = async ({ params, fetch: eventFetch }) => {
	try {
		const { slug } = params;

		if (!slug) {
			throw error(404, 'Blog post not found');
		}

		// Fetch the blog post
		const blogResponse = await eventFetch(`/api/blogs/slug/${slug}`);
		if (!blogResponse.ok) {
			throw error(blogResponse.status, 'Blog post not found');
		}

		const blog = await blogResponse.json();

		// Fetch related blog posts
		let relatedBlogs: BlogPost[] = [];
		try {
			const relatedResponse = await eventFetch(`/api/blogs/slug/${slug}/related?limit=3`);
			if (relatedResponse.ok) {
				relatedBlogs = await relatedResponse.json();
			}
		} catch {
			// If related posts fail, just continue with empty array
		}

		return {
			blog,
			relatedBlogs
		};
	} catch {
		throw error(500, 'Failed to load blog post');
	}
};
