import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { blogStore, getBlogById, getRelatedBlogs, loadBlogs } from '$lib/stores/blogs';

export const load = async ({ params }: { params: { slug: string } }) => {
	const { slug } = params;

	// Ensure blogs are loaded
	const currentState = get(blogStore);
	if (currentState.blogs.length === 0) {
		await loadBlogs();
	}

	// Find the blog post
	const blog = getBlogById(slug);

	if (!blog) {
		throw error(404, `Blog post not found: ${slug}`);
	}

	// Get related blog posts
	const relatedBlogs = getRelatedBlogs(blog.id, 3);

	return {
		blog,
		relatedBlogs
	};
};
