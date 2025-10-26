<script>
	import { goto } from '$app/navigation';
	import { blogs } from '$lib/stores/blogs.js';
	import { onMount } from 'svelte';

	// Form state
	let formData = {
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		tags: [],
		featured_image: '',
		status: 'draft',
		published_at: ''
	};

	// UI state
	let isLoading = false;
	let errors = {};
	let currentTag = '';

	// Available categories
	const availableCategories = [
		'Frontend Development',
		'Backend Development',
		'Full Stack Development',
		'DevOps',
		'Mobile Development',
		'Data Science',
		'Machine Learning',
		'Web Design',
		'Performance',
		'Security',
		'Tutorial',
		'Opinion',
		'News'
	];

	// Available tags for autocomplete
	const availableTags = [
		'JavaScript',
		'TypeScript',
		'React',
		'Vue.js',
		'Svelte',
		'SvelteKit',
		'Node.js',
		'Express',
		'NextJS',
		'Nuxt',
		'Gatsby',
		'HTML',
		'CSS',
		'Tailwind CSS',
		'SCSS',
		'Bootstrap',
		'MongoDB',
		'PostgreSQL',
		'MySQL',
		'SQLite',
		'Redis',
		'Docker',
		'AWS',
		'Kubernetes',
		'CI/CD',
		'GitHub Actions',
		'Testing',
		'Jest',
		'Cypress',
		'Playwright',
		'Performance',
		'SEO',
		'Accessibility',
		'UI/UX',
		'Tutorial',
		'Guide',
		'Tips',
		'Best Practices'
	];

	// Generate slug from title
	function generateSlugFromTitle(title) {
		return (
			title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-+|-+$/g, '') || `post-${Date.now()}`
		);
	}

	// Add tag to the list
	function addTag() {
		if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
			formData.tags = [...formData.tags, currentTag.trim()];
			currentTag = '';
		}
	}

	// Remove tag from the list
	function removeTag(tag) {
		formData.tags = formData.tags.filter(t => t !== tag);
	}

	// Form validation
	function validateForm() {
		errors = {};

		if (!formData.title.trim()) {
			errors.title = 'Blog post title is required';
		}

		if (!formData.excerpt.trim()) {
			errors.excerpt = 'Blog post excerpt is required';
		}

		if (!formData.content.trim()) {
			errors.content = 'Blog post content is required';
		}

		if (!formData.category) {
			errors.category = 'Please select a category';
		}

		if (formData.tags.length === 0) {
			errors.tags = 'At least one tag is required';
		}

		if (formData.published && !formData.publishedAt) {
			errors.publishedAt = 'Published date is required for published posts';
		}

		return Object.keys(errors).length === 0;
	}

	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		isLoading = true;

		try {
			// Generate slug if not set
			if (!formData.slug) {
				formData.slug = generateSlugFromTitle(formData.title);
			}

			// Set published date to now if publishing and no date set
			if (formData.status === 'published' && !formData.published_at) {
				formData.published_at = new Date().toISOString().split('T')[0];
			}

			// Prepare data for API (matching database schema)
			const blogData = {
				title: formData.title,
				slug: formData.slug,
				content: formData.content,
				excerpt: formData.excerpt || undefined,
				featured_image: formData.featured_image || undefined,
				tags: formData.tags || [],
				status: formData.status,
				published_at: formData.published_at || undefined
			};

			// Create via API
			const response = await fetch('/api/blogs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(blogData)
			});

			if (!response.ok) {
				throw new Error('Failed to create blog post');
			}

			// Show success message and redirect
			console.log('Blog post created successfully!');
			goto('/admin/blog');
		} catch (error) {
			console.error('Error creating blog post:', error);
			errors.general = 'Failed to create blog post. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Handle Enter key in input fields
	function handleKeyPress(event, action) {
		if (event.key === 'Enter') {
			event.preventDefault();
			action();
		}
	}

	// Handle save as draft
	function saveAsDraft() {
		formData.status = 'draft';
		handleSubmit(new Event('submit'));
	}

	// Handle publish
	function publishPost() {
		formData.status = 'published';
		if (!formData.published_at) {
			formData.published_at = new Date().toISOString().split('T')[0];
		}
		handleSubmit(new Event('submit'));
	}

	onMount(() => {
		// Auto-generate ID when title changes
		const unsubscribe = setInterval(() => {
			if (formData.title && !formData.id) {
				formData.id = generateBlogId();
			}
		}, 500);

		return () => clearInterval(unsubscribe);
	});
</script>

<svelte:head>
	<title>New Blog Post - Admin</title>
</svelte:head>

<div class="blog-form">
	<header class="form-header">
		<div class="header-content">
			<a href="/admin/blog" class="back-link">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Blog Posts
			</a>
			<h1>Create New Blog Post</h1>
			<p>Write and publish a new blog post</p>
		</div>
	</header>

	<form class="form-container" on:submit|preventDefault data-testid="blog-post-form">
		{#if errors.general}
			<div class="error-message" data-testid="form-error">
				{errors.general}
			</div>
		{/if}

		<!-- Basic Information -->
		<section class="form-section">
			<h2>Basic Information</h2>

			<div class="form-row">
				<div class="form-group">
					<label for="title">Post Title *</label>
					<input
						id="title"
						name="title"
						type="text"
						bind:value={formData.title}
						class:error={errors.title}
						placeholder="Enter blog post title"
						data-testid="blog-title-input"
					/>
					{#if errors.title}
						<span class="field-error">{errors.title}</span>
					{/if}
				</div>

				<div class="form-group">
					<label for="blog-slug">Post Slug</label>
					<input
						id="blog-slug"
						name="slug"
						type="text"
						bind:value={formData.slug}
						placeholder="Auto-generated from title"
						data-testid="blog-slug-input"
					/>
					<span class="field-help">Used in URLs. Auto-generated from title if empty.</span>
				</div>
			</div>

			<div class="form-group">
				<label for="excerpt">Excerpt *</label>
				<textarea
					id="excerpt"
					name="excerpt"
					bind:value={formData.excerpt}
					class:error={errors.excerpt}
					placeholder="Write a brief excerpt that summarizes your post..."
					rows="3"
					data-testid="blog-excerpt-input"
				></textarea>
				{#if errors.excerpt}
					<span class="field-error">{errors.excerpt}</span>
				{/if}
				<span class="field-help">This will appear in blog listings and social media previews</span>
			</div>
		</section>

		<!-- Post Details -->
		<section class="form-section">
			<h2>Post Details</h2>

			<div class="form-row">
				<div class="form-group">
					<label for="category">Category *</label>
					<select
						id="category"
						name="category"
						bind:value={formData.category}
						class:error={errors.category}
						data-testid="blog-category-select"
					>
						<option value="">Select a category</option>
						{#each availableCategories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					{#if errors.category}
						<span class="field-error">{errors.category}</span>
					{/if}
				</div>

				<div class="form-group">
					<label for="featured-image">Featured Image URL</label>
					<input
						id="featured-image"
						name="featured_image"
						type="url"
						bind:value={formData.featured_image}
						placeholder="https://example.com/image.jpg"
						data-testid="blog-featured-image-input"
					/>
					<span class="field-help">URL to the cover image for this blog post</span>
				</div>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="status">Post Status</label>
					<select
						id="status"
						name="status"
						bind:value={formData.status}
						data-testid="blog-status-select"
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
					<span class="field-help">Draft posts are not visible to the public</span>
				</div>

				<div class="form-group">
					<label for="published-date">Published Date</label>
					<input
						id="published-date"
						name="publishedDate"
						type="date"
						bind:value={formData.published_at}
						class:error={errors.published_at}
						data-testid="blog-published-date-input"
					/>
					{#if errors.published_at}
						<span class="field-error">{errors.published_at}</span>
					{/if}
					<span class="field-help">Leave empty for posts that haven't been published yet</span>
				</div>
			</div>
		</section>

		<!-- Tags -->
		<section class="form-section">
			<h2>Tags *</h2>

			<!-- Simple input for E2E tests -->
			<div class="form-group" style="position: absolute; left: -9999px; opacity: 0;">
				<input
					name="tags"
					type="text"
					value={formData.tags.join(', ')}
					readonly
					data-testid="tags-input"
				/>
			</div>

			<div class="form-group">
				<div class="tag-input-container">
					<input
						type="text"
						name="tag-input"
						bind:value={currentTag}
						placeholder="Add tag (e.g., JavaScript, Tutorial)"
						list="tag-suggestions"
						on:keypress={e => handleKeyPress(e, addTag)}
						data-testid="tag-input"
					/>
					<button type="button" on:click={addTag} class="btn-add">Add</button>
				</div>

				<datalist id="tag-suggestions">
					{#each availableTags as tag}
						<option value={tag}></option>
					{/each}
				</datalist>

				{#if formData.tags.length > 0}
					<div class="tag-list">
						{#each formData.tags as tag}
							<span class="tag-item">
								{tag}
								<button type="button" on:click={() => removeTag(tag)}>×</button>
							</span>
						{/each}
					</div>
				{/if}

				{#if errors.tags}
					<span class="field-error">{errors.tags}</span>
				{/if}
			</div>
		</section>

		<!-- Content -->
		<section class="form-section">
			<h2>Post Content *</h2>

			<div class="form-group">
				<label for="content">Content</label>
				<textarea
					id="content"
					name="content"
					bind:value={formData.content}
					class:error={errors.content}
					placeholder="Write your blog post content here. You can use Markdown formatting."
					rows="20"
					data-testid="blog-content-input"
				></textarea>
				{#if errors.content}
					<span class="field-error">{errors.content}</span>
				{/if}
				<div class="content-help">
					<span class="field-help"
						>Supports Markdown formatting (headings, links, code blocks, etc.)</span
					>
					{#if formData.content.trim()}
						<span class="word-count">
							{formData.content.trim().split(/\s+/).length} words
						</span>
					{/if}
				</div>
			</div>
		</section>

		<!-- Form Actions -->
		<section class="form-actions">
			<div class="left-actions">
				<button type="button" class="btn btn-secondary" on:click={() => goto('/admin/blog')}>
					Cancel
				</button>
			</div>

			<div class="right-actions">
				<button
					type="button"
					class="btn btn-outline"
					on:click={saveAsDraft}
					disabled={isLoading}
					data-testid="save-draft-blog"
				>
					{#if isLoading && formData.status !== 'published'}
						<svg class="spinner" viewBox="0 0 24 24">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
								opacity="0.25"
							/>
							<path
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Saving Draft...
					{:else}
						Save as Draft
					{/if}
				</button>

				<button
					type="button"
					class="btn btn-primary"
					on:click={publishPost}
					disabled={isLoading}
					data-testid="publish-blog"
				>
					{#if isLoading && formData.status === 'published'}
						<svg class="spinner" viewBox="0 0 24 24">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
								opacity="0.25"
							/>
							<path
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Publishing...
					{:else}
						Publish Post
					{/if}
				</button>
			</div>
		</section>
	</form>
</div>

<style lang="scss">
	.blog-form {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.form-header {
		margin-bottom: 2rem;

		.header-content {
			h1 {
				font-size: 2rem;
				font-weight: 700;
				color: #1e293b;
				margin: 1rem 0 0.5rem 0;
			}

			p {
				color: #64748b;
				margin: 0 0 1rem 0;
			}
		}
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #64748b;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;

		&:hover {
			color: #3b82f6;
		}

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	.form-container {
		background: white;
		border-radius: 0.75rem;
		border: 1px solid #e2e8f0;
		overflow: hidden;
	}

	.form-section {
		padding: 2rem;
		border-bottom: 1px solid #f1f5f9;

		&:last-of-type {
			border-bottom: none;
		}

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #1e293b;
			margin: 0 0 1.5rem 0;
		}
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;

		&:last-child {
			margin-bottom: 0;
		}
	}

	label {
		font-weight: 500;
		color: #374151;
		font-size: 0.875rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: normal;
		cursor: pointer;
	}

	input,
	select,
	textarea {
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		transition: all 0.2s;

		&:focus {
			outline: none;
			border-color: #3b82f6;
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		}

		&.error {
			border-color: #dc2626;
			box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
		}

		&::placeholder {
			color: #9ca3af;
		}
	}

	textarea {
		resize: vertical;
		min-height: 100px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	.field-error {
		color: #dc2626;
		font-size: 0.75rem;
	}

	.field-help {
		color: #6b7280;
		font-size: 0.75rem;
	}

	.content-help {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.word-count {
		color: #64748b;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #fecaca;
		margin-bottom: 2rem;
	}

	.tag-input-container {
		display: flex;
		gap: 0.5rem;

		input {
			flex: 1;
		}
	}

	.btn-add {
		background: #3b82f6;
		color: white;
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background 0.2s;

		&:hover {
			background: #2563eb;
		}
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.tag-item {
		background: #eff6ff;
		color: #1d4ed8;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		button {
			background: none;
			border: none;
			color: #1d4ed8;
			cursor: pointer;
			font-size: 0.875rem;
			padding: 0;
			width: 1rem;
			height: 1rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.form-actions {
		background: #f8fafc;
		padding: 1.5rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;

		@media (max-width: 768px) {
			flex-direction: column;
			gap: 1rem;
		}

		.left-actions,
		.right-actions {
			display: flex;
			gap: 1rem;

			@media (max-width: 768px) {
				flex-direction: column;
				width: 100%;
			}
		}
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s;

		&.btn-primary {
			background: #3b82f6;
			color: white;

			&:hover:not(:disabled) {
				background: #2563eb;
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}

		&.btn-secondary {
			background: white;
			color: #374151;
			border: 1px solid #d1d5db;

			&:hover {
				background: #f9fafb;
			}
		}

		&.btn-outline {
			background: transparent;
			color: #3b82f6;
			border: 1px solid #3b82f6;

			&:hover:not(:disabled) {
				background: #3b82f6;
				color: white;
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
