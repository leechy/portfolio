import { BlogService } from '$lib/server/blogs.js';

export const load = async () => {
	try {
		const blogService = new BlogService();
		const posts = blogService.getAllBlogPosts();

		return {
			posts
		};
	} catch {
		return {
			posts: []
		};
	}
};
