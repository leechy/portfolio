<script lang="ts">
	import { onMount } from 'svelte';
	import {
		blogStore,
		loadBlogs,
		searchBlogs,
		getAllBlogTags,
		filterBlogsByTag
	} from '$lib/stores/blogs';
	import BlogPreview from '$lib/components/BlogPreview.svelte';
	import type { BlogPost } from '$lib/stores/blogs';

	let searchQuery = '';
	let selectedTag = '';
	let filteredBlogs: BlogPost[] = [];
	let allTags: string[] = [];
	let isLoading = false;

	// Reactive statements
	$: {
		if ($blogStore.blogs.length > 0) {
			if (searchQuery.trim()) {
				filteredBlogs = searchBlogs(searchQuery.trim());
			} else if (selectedTag) {
				filteredBlogs = filterBlogsByTag(selectedTag);
			} else {
				filteredBlogs = $blogStore.blogs;
			}
		}
	}

	$: if ($blogStore.blogs.length > 0) {
		allTags = getAllBlogTags();
	}

	// Event handlers
	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		selectedTag = ''; // Clear tag filter when searching
	}

	function handleTagFilter(tag: string) {
		if (selectedTag === tag) {
			selectedTag = ''; // Toggle off if same tag clicked
		} else {
			selectedTag = tag;
			searchQuery = ''; // Clear search when filtering by tag
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedTag = '';
	}

	// Lifecycle
	onMount(async () => {
		if ($blogStore.blogs.length === 0) {
			await loadBlogs();
		}
	});
</script>

<svelte:head>
	<title>Blog - Leechy Dev</title>
	<meta
		name="description"
		content="Read articles about web development, programming, and technology. Tips, tutorials, and insights from a full-stack developer."
	/>
	<meta property="og:title" content="Blog - Leechy Dev" />
	<meta
		property="og:description"
		content="Read articles about web development, programming, and technology. Tips, tutorials, and insights from a full-stack developer."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main class="container mx-auto px-4 py-8" data-testid="blog-section">
	<header class="mb-12 text-center" data-testid="blog-header">
		<h1 class="text-4xl md:text-5xl font-bold mb-4" data-testid="page-title">Blog</h1>
		<p class="text-xl text-gray-600 max-w-2xl mx-auto">
			Articles about web development, programming insights, and technology trends.
		</p>
	</header>

	<!-- Search and Filter Section -->
	<section class="mb-8" aria-label="Blog filters">
		<div class="flex flex-col md:flex-row gap-4 mb-6">
			<!-- Search Input -->
			<div class="flex-1">
				<label for="blog-search" class="sr-only">Search blog posts</label>
				<input
					id="blog-search"
					type="search"
					placeholder="Search articles..."
					value={searchQuery}
					on:input={handleSearch}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					data-testid="blog-search-input"
				/>
			</div>

			<!-- Clear Filters Button -->
			{#if searchQuery || selectedTag}
				<button
					on:click={clearFilters}
					class="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
					data-testid="clear-filters"
				>
					Clear Filters
				</button>
			{/if}
		</div>

		<!-- Tag Filters -->
		{#if allTags.length > 0}
			<div class="mb-6">
				<h2 class="text-sm font-medium text-gray-700 mb-3">Filter by topic:</h2>
				<div class="flex flex-wrap gap-2" data-testid="blog-tag-filters">
					{#each allTags as tag (tag)}
						<button
							on:click={() => handleTagFilter(tag)}
							class="px-3 py-1 text-sm font-medium rounded-full border transition-colors
								{selectedTag === tag
								? 'bg-blue-600 text-white border-blue-600'
								: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
							data-testid="blog-tag-filter"
							data-tag={tag}
						>
							{tag}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Active Filters Display -->
		{#if searchQuery || selectedTag}
			<div class="mb-4 text-sm text-gray-600" data-testid="active-filters">
				{#if searchQuery}
					Searching for: <strong>"{searchQuery}"</strong>
				{/if}
				{#if selectedTag}
					Filtered by: <strong>{selectedTag}</strong>
				{/if}
				<span class="ml-2">({filteredBlogs.length} articles found)</span>
			</div>
		{/if}
	</section>

	<!-- Loading State -->
	{#if $blogStore.loading}
		<div class="text-center py-12" data-testid="loading-state">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
			<p class="text-gray-600">Loading articles...</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if $blogStore.error}
		<div class="text-center py-12" data-testid="error-state">
			<div class="text-red-600 mb-4">
				<svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
			</div>
			<h2 class="text-xl font-semibold mb-2">Error Loading Articles</h2>
			<p class="text-gray-600 mb-4">{$blogStore.error}</p>
			<button
				on:click={() => loadBlogs()}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
			>
				Try Again
			</button>
		</div>
	{/if}

	<!-- Featured Blogs Section -->
	{#if !searchQuery && !selectedTag && $blogStore.featured.length > 0}
		<section class="mb-12">
			<h2 class="text-2xl font-bold mb-6" data-testid="featured-section-title">
				Featured Articles
			</h2>
			<div
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				data-testid="featured-blogs"
			>
				{#each $blogStore.featured as blog (blog.id)}
					<BlogPreview {blog} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- All Blogs Section -->
	{#if !$blogStore.loading && !$blogStore.error}
		<section>
			<h2 class="text-2xl font-bold mb-6" data-testid="all-blogs-section-title">
				{#if searchQuery || selectedTag}
					Search Results
				{:else}
					All Articles
				{/if}
			</h2>

			{#if filteredBlogs.length > 0}
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					data-testid="blog-posts-list"
				>
					{#each filteredBlogs as blog (blog.id)}
						<BlogPreview {blog} />
					{/each}
				</div>
			{:else if searchQuery || selectedTag}
				<div class="text-center py-12" data-testid="no-results">
					<div class="text-gray-400 mb-4">
						<svg
							class="w-16 h-16 mx-auto mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.072-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold mb-2">No articles found</h3>
					<p class="text-gray-600 mb-4">
						{#if searchQuery}
							No articles match your search for "{searchQuery}".
						{:else if selectedTag}
							No articles found with the tag "{selectedTag}".
						{/if}
					</p>
					<button
						on:click={clearFilters}
						class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
					>
						View All Articles
					</button>
				</div>
			{:else}
				<div class="text-center py-12" data-testid="no-blogs">
					<p class="text-gray-600 text-lg">No articles available at this time.</p>
				</div>
			{/if}
		</section>
	{/if}
</main>

<style>
	.container {
		max-width: 1200px;
	}

	/* Search input focus styles */
	input[type='search']:focus {
		outline: none;
	}

	/* Animation for loading spinner */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	/* Responsive design adjustments */
	@media (max-width: 768px) {
		.container {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}
</style>
