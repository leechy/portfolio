<script lang="ts">
	import type { BlogPost } from '$lib/stores/blogs';
	import { formatBlogDate, formatReadTime } from '$lib/stores/blogs';

	export let blog: BlogPost;
	export let showExcerpt = true;
	export let showImage = true;
	export let showReadTime = true;
	export let showAuthor = true;
	export let className = '';
</script>

<article class="blog-preview {className}" data-testid="blog-post-preview" data-blog-id={blog.id}>
	<a href="/blog/{blog.slug}" class="block hover:opacity-80 transition-opacity">
		{#if showImage && blog.coverImageUrl}
			<div class="mb-4">
				<img
					src={blog.coverImageUrl}
					alt={blog.title}
					class="w-full h-48 object-cover rounded-lg"
					loading="lazy"
				/>
			</div>
		{/if}

		<header class="mb-3">
			<h3 class="text-xl font-semibold mb-2 line-clamp-2" data-testid="blog-post-title">
				{blog.title}
			</h3>

			<div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
				<time datetime={blog.published_at} data-testid="blog-post-date">
					{formatBlogDate(blog.published_at)}
				</time>

				{#if showAuthor}
					<span class="text-gray-400">•</span>
					<span data-testid="blog-author">by {blog.author}</span>
				{/if}

				{#if showReadTime}
					<span class="text-gray-400">•</span>
					<span data-testid="blog-post-read-time">
						{formatReadTime(blog.readTimeMinutes)}
					</span>
				{/if}
			</div>
		</header>

		{#if showExcerpt}
			<p class="text-gray-700 line-clamp-3 mb-4" data-testid="blog-post-excerpt">
				{blog.excerpt}
			</p>
		{/if}

		<!-- Read more link -->
		<div class="mt-4">
			<span
				class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
				data-testid="blog-read-more"
			>
				Read more
				<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</span>
		</div>

		{#if blog.tags && blog.tags.length > 0}
			<footer class="flex flex-wrap gap-2" data-testid="blog-post-tags">
				{#each blog.tags as tag (tag)}
					<span
						class="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
						data-testid="blog-tag"
					>
						{tag}
					</span>
				{/each}
			</footer>
		{/if}

		{#if blog.featured}
			<div
				class="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium"
			>
				Featured
			</div>
		{/if}
	</a>
</article>

<style>
	.blog-preview {
		position: relative;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
		transition: all 0.2s ease-in-out;
	}

	.blog-preview:hover {
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		transform: translateY(-1px);
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Focus styles for accessibility */
	.blog-preview a:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.blog-preview {
			padding: 1rem;
		}
	}
</style>
