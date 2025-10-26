<script lang="ts">
	import BlogPreview from '$lib/components/BlogPreview.svelte';
	import { formatBlogDate, formatReadTime } from '$lib/stores/blogs';
	import type { BlogPost } from '$lib/stores/blogs';

	export let data: { blog: BlogPost; relatedBlogs: BlogPost[] };

	$: blog = data.blog;
	$: relatedBlogs = data.relatedBlogs;
</script>

<svelte:head>
	<title>{blog.title} - Leechy Dev Blog</title>
	<meta name="description" content={blog.excerpt} />
	<meta property="og:title" content={blog.title} />
	<meta property="og:description" content={blog.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="article:published_time" content={blog.publishedAt?.toISOString?.()} />
	<meta property="article:author" content={blog.author} />
	{#if blog.coverImageUrl}
		<meta property="og:image" content={blog.coverImageUrl} />
	{/if}
	{#each blog.tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<!-- Navigation Back -->
	<nav class="mb-8" aria-label="Breadcrumb" data-testid="breadcrumb">
		<a
			href="/blog"
			class="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
			data-testid="back-to-blog"
		>
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Blog
		</a>
	</nav>

	<!-- Article Header -->
	<header class="mb-12">
		{#if blog.featured}
			<div class="mb-4">
				<span
					class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
				>
					Featured Article
				</span>
			</div>
		{/if}

		<h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight" data-testid="blog-title">
			{blog.title}
		</h1>

		<div
			class="flex flex-wrap items-center gap-4 text-gray-600 mb-6"
			data-testid="blog-post-metadata"
		>
			<time datetime={blog?.published_at?.toISOString?.()} class="text-sm" data-testid="blog-date">
				{formatBlogDate(blog.published_at)}
			</time>
			<span class="text-gray-400">•</span>
			<span class="text-sm" data-testid="blog-author">by {blog.author}</span>
			<span class="text-gray-400">•</span>
			<span class="text-sm" data-testid="blog-read-time">
				{formatReadTime(blog.readTimeMinutes)}
			</span>
		</div>

		{#if blog.tags && blog.tags.length > 0}
			<div class="flex flex-wrap gap-2 mb-6">
				{#each blog.tags as tag (tag)}
					<a
						href="/blog?tag={encodeURIComponent(tag)}"
						class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
						data-testid="blog-tag"
					>
						{tag}
					</a>
				{/each}
			</div>
		{/if}

		{#if blog.coverImageUrl}
			<div class="mb-8">
				<img
					src={blog.coverImageUrl}
					alt={blog.title}
					class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
					data-testid="blog-cover-image"
				/>
			</div>
		{/if}

		<p class="text-xl text-gray-700 leading-relaxed" data-testid="blog-excerpt">
			{blog.excerpt}
		</p>
	</header>

	<!-- Article Content -->
	<article class="prose prose-lg max-w-none mb-16" data-testid="blog-post-content">
		{@html blog.content}
	</article>

	<!-- Share Section -->
	<section class="border-t border-gray-200 pt-8 mb-16">
		<h2 class="text-xl font-semibold mb-4">Share this article</h2>
		<div class="flex flex-wrap gap-4">
			<a
				href="https://twitter.com/intent/tweet?text={encodeURIComponent(blog.title)}"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
				data-testid="share-twitter"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
					/>
				</svg>
				Tweet
			</a>

			<a
				href="https://www.linkedin.com/sharing/share-offsite/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
				data-testid="share-linkedin"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
					/>
				</svg>
				Share
			</a>

			<button
				on:click={async () => {
					if (typeof window !== 'undefined') {
						if (navigator.share) {
							try {
								await navigator.share({
									title: blog.title,
									text: blog.excerpt,
									url: window.location.href
								});
							} catch (err) {
								console.log('Share cancelled');
							}
						} else {
							try {
								await navigator.clipboard.writeText(window.location.href);
								alert('Link copied to clipboard!');
							} catch (err) {
								console.error('Failed to copy link');
							}
						}
					}
				}}
				class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
				data-testid="share-copy"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				Copy Link
			</button>
		</div>
	</section>

	<!-- Related Articles -->
	{#if relatedBlogs && relatedBlogs.length > 0}
		<section class="border-t border-gray-200 pt-16" data-testid="related-posts">
			<h2 class="text-2xl font-bold mb-8" data-testid="related-articles-title">Related Articles</h2>
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				data-testid="related-articles"
			>
				{#each relatedBlogs as relatedBlog (relatedBlog.id)}
					<article
						data-testid="related-post-card"
						class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
					>
						<a href="/blog/{relatedBlog.slug}" class="block">
							<h3 class="text-lg font-semibold mb-2 line-clamp-2" data-testid="related-post-title">
								{relatedBlog.title}
							</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2">
								{relatedBlog.excerpt}
							</p>
							<div class="flex items-center text-xs text-gray-500 gap-2">
								<time datetime={relatedBlog.published_at?.toISOString?.()}>
									{formatBlogDate(relatedBlog.published_at)}
								</time>
								<span>•</span>
								<span>{formatReadTime(relatedBlog.readTimeMinutes)}</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	.container {
		max-width: 800px;
	}

	/* Prose styles for article content */
	.prose {
		color: #374151;
		line-height: 1.75;
	}

	.prose h1,
	.prose h2,
	.prose h3,
	.prose h4,
	.prose h5,
	.prose h6 {
		color: #111827;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.prose h1 {
		font-size: 2.25rem;
		line-height: 1.2;
	}

	.prose h2 {
		font-size: 1.875rem;
		line-height: 1.3;
	}

	.prose h3 {
		font-size: 1.5rem;
		line-height: 1.4;
	}

	.prose p {
		margin-bottom: 1.5rem;
	}

	.prose code {
		background-color: #f3f4f6;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: 'Fira Code', 'Courier New', monospace;
		font-size: 0.875em;
	}

	.prose pre {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 1.5rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.prose pre code {
		background-color: transparent;
		padding: 0;
		color: inherit;
	}

	.prose blockquote {
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: #6b7280;
	}

	.prose ul,
	.prose ol {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.prose li {
		margin-bottom: 0.5rem;
	}

	.prose a {
		color: #3b82f6;
		text-decoration: underline;
	}

	.prose a:hover {
		color: #1d4ed8;
	}

	.prose img {
		margin: 2rem 0;
		border-radius: 0.5rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.container {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.prose h1 {
			font-size: 1.875rem;
		}

		.prose h2 {
			font-size: 1.5rem;
		}

		.prose h3 {
			font-size: 1.25rem;
		}
	}
</style>
