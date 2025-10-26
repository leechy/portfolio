<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data;

	// Get project ID from URL params
	$: projectId = $page.params.id;
	$: project = data.project;

	// Form state - initialize with server data
	let formData = {
		title: '',
		description: '',
		technologies: [],
		status: 'planning',
		featured: false,
		githubUrl: '',
		demoUrl: '',
		imageUrl: '',
		content: ''
	};

	// UI state
	let isLoading = false;
	let errors = {};
	let currentTech = '';

	// Initialize form data when project loads
	$: if (project) {
		formData = {
			title: project.title || '',
			description: project.description || '',
			technologies: project.technologies || [],
			status: project.status || 'planning',
			featured: project.featured || false,
			githubUrl: project.github_url || '',
			demoUrl: project.live_url || '',
			imageUrl: project.image || '',
			content: project.content || ''
		};
	}

	// Available technologies for autocomplete
	const availableTechnologies = [
		'JavaScript',
		'TypeScript',
		'React',
		'Vue.js',
		'Svelte',
		'SvelteKit',
		'Node.js',
		'Express',
		'FastAPI',
		'Django',
		'Flask',
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
		'Vercel',
		'Netlify',
		'Firebase',
		'Git',
		'GitHub Actions',
		'Jest',
		'Cypress',
		'Playwright',
		'Webpack',
		'Vite',
		'Rollup',
		'ESLint',
		'Prettier'
	];

	// Load project data
	function loadProject() {
		const project = projects.find(p => p.id === projectId);

		if (!project) {
			projectFound = false;
			isLoadingProject = false;
			return;
		}

		projectFound = true;

		// Populate form with project data
		formData = {
			...project,
			// Convert Date objects to string format for inputs
			startDate: project.startDate ? formatDateForInput(project.startDate) : '',
			completionDate: project.completionDate ? formatDateForInput(project.completionDate) : '',
			// Ensure arrays exist
			technologies: project.technologies || [],
			challenges: project.challenges || [],
			solutions: project.solutions || [],
			skillsDemonstrated: project.skillsDemonstrated || [],
			relatedProjects: project.relatedProjects || []
		};

		isLoadingProject = false;
	}

	// Format Date object for date input
	function formatDateForInput(date) {
		if (!date) return '';
		if (typeof date === 'string') return date.split('T')[0];
		return date.toISOString().split('T')[0];
	}

	// Add technology to the list
	function addTechnology() {
		if (currentTech.trim() && !formData.technologies.includes(currentTech.trim())) {
			formData.technologies = [...formData.technologies, currentTech.trim()];
			currentTech = '';
		}
	}

	// Remove technology from the list
	function removeTechnology(tech) {
		formData.technologies = formData.technologies.filter(t => t !== tech);
	}

	// Form validation
	function validateForm() {
		errors = {};

		if (!formData.title.trim()) {
			errors.title = 'Project title is required';
		}

		if (!formData.description.trim()) {
			errors.description = 'Project description is required';
		}

		if (formData.technologies.length === 0) {
			errors.technologies = 'At least one technology is required';
		}

		if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
			errors.githubUrl = 'Please enter a valid GitHub URL';
		}

		if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
			errors.demoUrl = 'Please enter a valid demo URL';
		}

		return Object.keys(errors).length === 0;
	}

	// URL validation helper
	function isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	}

	// Handle Enter key in input fields
	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTechnology();
		}
	}

	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		isLoading = true;

		try {
			// Prepare project data for database (map form fields to database schema)
			const projectData = {
				title: formData.title,
				description: formData.description,
				content: formData.content || null,
				image: formData.imageUrl || null,
				technologies: formData.technologies,
				github_url: formData.githubUrl || null,
				live_url: formData.demoUrl || null,
				status: formData.status,
				featured: formData.featured
			};

			// Update project via API
			const response = await fetch(`/api/projects/${projectId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(projectData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to update project');
			}

			// Show success message and redirect
			console.log('Project updated successfully!');
			goto('/admin/projects');
		} catch (error) {
			console.error('Error updating project:', error);
			errors.general = error.message || 'Failed to update project. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Handle project deletion
	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
			return;
		}

		try {
			// Delete project via API
			const response = await fetch(`/api/projects/${projectId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to delete project');
			}

			console.log('Project deleted successfully!');
			goto('/admin/projects');
		} catch (error) {
			console.error('Error deleting project:', error);
			console.error('Failed to delete project. Please try again.');
		}
	}
</script>

<svelte:head>
	<title>Edit Project - Admin</title>
</svelte:head>

<div class="project-form">
	<header class="form-header">
		<div class="header-content">
			<a href="/admin/projects" class="back-link">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Projects
			</a>

			<h1>Edit Project</h1>
			<p>Update your project details</p>
		</div>
	</header>

	{#if project}
		<form class="form-container" on:submit={handleSubmit}>
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
						<label for="title">Project Title *</label>
						<input
							id="title"
							type="text"
							bind:value={formData.title}
							class:error={errors.title}
							placeholder="Enter project title"
							data-testid="project-title-input"
						/>
						{#if errors.title}
							<span class="field-error">{errors.title}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="project-id">Project ID</label>
						<input
							id="project-id"
							type="text"
							bind:value={formData.id}
							readonly
							class="readonly"
							data-testid="project-id-input"
						/>
						<span class="field-help">Project ID cannot be changed after creation</span>
					</div>
				</div>

				<div class="form-group">
					<label for="description">Description *</label>
					<textarea
						id="description"
						bind:value={formData.description}
						class:error={errors.description}
						placeholder="Describe your project..."
						rows="4"
						data-testid="project-description-input"
					></textarea>
					{#if errors.description}
						<span class="field-error">{errors.description}</span>
					{/if}
				</div>
			</section>

			<!-- Project Details -->
			<section class="form-section">
				<h2>Project Details</h2>

				<div class="form-row">
					<div class="form-group">
						<label for="status">Status</label>
						<select id="status" bind:value={formData.status} data-testid="project-status-select">
							<option value="planning">Planning</option>
							<option value="development">In Development</option>
							<option value="completed">Completed</option>
							<option value="maintenance">Maintenance</option>
						</select>
					</div>

					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:checked={formData.featured}
								data-testid="project-featured-checkbox"
							/>
							Featured Project
						</label>
						<span class="field-help">Featured projects appear prominently on the homepage</span>
					</div>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="github-url">GitHub URL</label>
						<input
							id="github-url"
							type="url"
							bind:value={formData.githubUrl}
							class:error={errors.githubUrl}
							placeholder="https://github.com/..."
							data-testid="project-github-input"
						/>
						{#if errors.githubUrl}
							<span class="field-error">{errors.githubUrl}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="demo-url">Demo URL</label>
						<input
							id="demo-url"
							type="url"
							bind:value={formData.demoUrl}
							class:error={errors.demoUrl}
							placeholder="https://..."
							data-testid="project-demo-input"
						/>
						{#if errors.demoUrl}
							<span class="field-error">{errors.demoUrl}</span>
						{/if}
					</div>
				</div>

				<div class="form-group">
					<label for="image-url">Project Image URL</label>
					<input
						id="image-url"
						type="url"
						bind:value={formData.imageUrl}
						placeholder="https://..."
						data-testid="project-image-input"
					/>
				</div>
			</section>

			<!-- Technologies -->
			<section class="form-section">
				<h2>Technologies *</h2>

				<div class="form-group">
					<div class="tech-input-container">
						<input
							type="text"
							bind:value={currentTech}
							placeholder="Add technology (e.g., React, Node.js)"
							list="tech-suggestions"
							on:keypress={handleKeyPress}
							data-testid="tech-input"
						/>
						<button type="button" on:click={addTechnology} class="btn-add">Add</button>
					</div>

					<datalist id="tech-suggestions">
						{#each availableTechnologies as tech}
							<option value={tech}></option>
						{/each}
					</datalist>

					{#if formData.technologies.length > 0}
						<div class="tech-list">
							{#each formData.technologies as tech}
								<span class="tech-tag">
									{tech}
									<button type="button" on:click={() => removeTechnology(tech)}>×</button>
								</span>
							{/each}
						</div>
					{/if}

					{#if errors.technologies}
						<span class="field-error">{errors.technologies}</span>
					{/if}
				</div>
			</section>

			<!-- Content -->
			<section class="form-section">
				<h2>Project Content</h2>

				<div class="form-group">
					<label for="content">Detailed Description</label>
					<textarea
						id="content"
						bind:value={formData.content}
						placeholder="Write detailed project description, implementation details, etc. (Supports Markdown)"
						rows="10"
						data-testid="project-content-input"
					></textarea>
					<span class="field-help">You can use Markdown formatting here</span>
				</div>
			</section>

			<!-- Content -->
			<section class="form-section">
				<h2>Project Content</h2>

				<div class="form-group">
					<label for="content">Detailed Description</label>
					<textarea
						id="content"
						bind:value={formData.content}
						placeholder="Write detailed project description, implementation details, etc. (Supports Markdown)"
						rows="10"
						data-testid="project-content-input"
					></textarea>
					<span class="field-help">You can use Markdown formatting here</span>
				</div>
			</section>

			<!-- Form Actions -->
			<section class="form-actions">
				<div class="left-actions">
					<button
						type="button"
						class="btn btn-danger"
						on:click={handleDelete}
						data-testid="delete-project"
					>
						Delete Project
					</button>
				</div>

				<div class="right-actions">
					<button type="button" class="btn btn-secondary" on:click={() => goto('/admin/projects')}>
						Cancel
					</button>
					<button
						type="submit"
						class="btn btn-primary"
						disabled={isLoading}
						data-testid="update-project"
					>
						{#if isLoading}
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
							Updating Project...
						{:else}
							Update Project
						{/if}
					</button>
				</div>
			</section>
		</form>
	{:else}
		<div class="error-message">Project not found or failed to load.</div>
	{/if}
</div>

<style lang="scss">
	.project-form {
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

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid #e2e8f0;

		p {
			color: #64748b;
			margin-top: 1rem;
		}
	}

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.not-found-container {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid #e2e8f0;

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			color: #1e293b;
			margin-bottom: 0.5rem;
		}

		p {
			color: #64748b;
			margin-bottom: 2rem;
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

		&.readonly {
			background-color: #f9fafb;
			cursor: not-allowed;
		}

		&::placeholder {
			color: #9ca3af;
		}
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.field-error {
		color: #dc2626;
		font-size: 0.75rem;
	}

	.field-help {
		color: #6b7280;
		font-size: 0.75rem;
	}

	.error-message {
		background: #fef2f2;
		color: #dc2626;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #fecaca;
		margin-bottom: 2rem;
	}

	.tech-input-container,
	.list-input-container {
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

	.tech-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.tech-tag {
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

	.skill-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.skill-tag {
		background: #f0fdf4;
		color: #166534;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		button {
			background: none;
			border: none;
			color: #166534;
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

	.list-items {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8fafc;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid #e2e8f0;

		button {
			background: #ef4444;
			color: white;
			border: none;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 50%;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.875rem;

			&:hover {
				background: #dc2626;
			}
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

		&.btn-danger {
			background: #ef4444;
			color: white;

			&:hover {
				background: #dc2626;
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
