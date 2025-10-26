<script>
	export let data;

	let filteredProjects = [];
	let searchTerm = '';
	let statusFilter = 'all';
	let sortBy = 'date';

	// Use server-side data
	$: projectList = data.projects || [];

	// Initialize filtered projects when data loads
	$: if (projectList.length > 0) {
		filterAndSortProjects();
	}

	function filterAndSortProjects() {
		let filtered = projectList;

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter(
				project =>
					project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter(project => project.status === statusFilter);
		}

		// Apply sorting
		switch (sortBy) {
			case 'title':
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'status':
				filtered.sort((a, b) => a.status.localeCompare(b.status));
				break;
			case 'date':
			default:
				filtered.sort(
					(a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at)
				);
				break;
		}

		filteredProjects = filtered;
	}

	async function deleteProject(projectId) {
		if (confirm('Are you sure you want to delete this project?')) {
			try {
				const response = await fetch(`/api/projects/${projectId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					// Remove from local list to update UI immediately
					projectList = projectList.filter(p => p.id !== projectId);
					filterAndSortProjects();
				} else {
					throw new Error('Failed to delete project');
				}
			} catch (error) {
				console.error('Failed to delete project. Please try again.');
			}
		}
	}

	function getStatusBadgeClass(status) {
		switch (status) {
			case 'completed':
				return 'status-completed';
			case 'in-progress':
				return 'status-in-progress';
			case 'planning':
				return 'status-planning';
			default:
				return 'status-default';
		}
	}

	// Reactive statements
	$: if (searchTerm !== undefined || statusFilter !== undefined || sortBy !== undefined) {
		filterAndSortProjects();
	}
</script>

<svelte:head>
	<title>Admin - Projects</title>
</svelte:head>

<div class="projects-admin" data-testid="admin-projects">
	<header class="page-header">
		<div class="header-content">
			<h1>Project Management</h1>
			<p>Manage your portfolio projects and showcase your work</p>
		</div>
		<div class="header-actions">
			<a href="/admin/projects/new" class="btn btn-primary" data-testid="add-project-btn">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				New Project
			</a>
		</div>
	</header>
	<!-- Filters and Search -->
	<div class="controls">
		<div class="search-box">
			<svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				type="text"
				placeholder="Search projects..."
				bind:value={searchTerm}
				data-testid="search-input"
			/>
		</div>

		<div class="filters">
			<select bind:value={statusFilter} data-testid="status-filter">
				<option value="all">All Status</option>
				<option value="completed">Completed</option>
				<option value="in-progress">In Progress</option>
				<option value="planning">Planning</option>
			</select>

			<select bind:value={sortBy} data-testid="sort-select">
				<option value="date">Sort by Date</option>
				<option value="title">Sort by Title</option>
				<option value="status">Sort by Status</option>
			</select>
		</div>
	</div>

	<!-- Projects List -->
	<div class="projects-list" data-testid="projects-list">
		{#if filteredProjects.length === 0}
			<div class="empty-state">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
				<h3>No projects found</h3>
				<p>Try adjusting your search or filters, or create a new project.</p>
				<a href="/admin/projects/new" class="btn btn-primary">Create First Project</a>
			</div>
		{:else}
			{#each filteredProjects as project (project.id)}
				<div class="project-card" data-testid="project-item">
					<div class="project-image">
						{#if project.image}
							<img src={project.image} alt={project.title} />
						{:else}
							<div class="placeholder-image">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<div class="project-content">
						<div class="project-header">
							<h3 class="project-title">{project.title}</h3>
							<span class="status-badge {getStatusBadgeClass(project.status)}">
								{project.status.replace('-', ' ')}
							</span>
						</div>

						<p class="project-description">{project.description}</p>

						<div class="project-meta">
							<div class="technologies">
								{#each project.technologies.slice(0, 3) as tech}
									<span class="tech-tag">{tech}</span>
								{/each}
								{#if project.technologies.length > 3}
									<span class="tech-tag more">+{project.technologies.length - 3} more</span>
								{/if}
							</div>
							<span class="project-date"
								>{new Date(project.created_at || project.updated_at).toLocaleDateString()}</span
							>
						</div>

						<div class="project-actions">
							<a href="/projects/{project.id}" class="btn btn-secondary" target="_blank">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								View
							</a>
							<a
								href="/admin/projects/{project.id}/edit"
								class="btn btn-secondary"
								data-testid="edit-project-btn"
							>
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
								Edit
							</a>
							<button
								class="btn btn-danger"
								on:click={() => deleteProject(project.id)}
								data-testid="delete-project-btn"
							>
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								Delete
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Results Count -->
	<div class="results-count">
		Showing {filteredProjects.length} of {projectList.length} projects
	</div>
</div>

<style lang="scss">
	.projects-admin {
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		gap: 1rem;

		@media (max-width: 768px) {
			flex-direction: column;
		}

		.header-content {
			h1 {
				font-size: 2rem;
				font-weight: 700;
				color: #1e293b;
				margin: 0 0 0.5rem 0;
			}

			p {
				color: #64748b;
				margin: 0;
			}
		}

		.header-actions {
			display: flex;
			gap: 0.75rem;

			@media (max-width: 768px) {
				width: 100%;
				justify-content: center;
			}
		}
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.search-box {
		position: relative;
		flex: 1;
		min-width: 200px;

		.search-icon {
			position: absolute;
			left: 0.75rem;
			top: 50%;
			transform: translateY(-50%);
			width: 1.25rem;
			height: 1.25rem;
			color: #9ca3af;
		}

		input {
			width: 100%;
			padding: 0.75rem 0.75rem 0.75rem 2.5rem;
			border: 1px solid #d1d5db;
			border-radius: 0.5rem;
			font-size: 0.875rem;

			&:focus {
				outline: none;
				border-color: #3b82f6;
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
			}
		}
	}

	.filters {
		display: flex;
		gap: 0.5rem;

		select {
			padding: 0.75rem;
			border: 1px solid #d1d5db;
			border-radius: 0.5rem;
			font-size: 0.875rem;
			background: white;

			&:focus {
				outline: none;
				border-color: #3b82f6;
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
			}
		}
	}

	.projects-list {
		display: grid;
		gap: 1.5rem;
	}

	.project-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		overflow: hidden;
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: 1.5rem;
		transition: all 0.2s;

		&:hover {
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		}
	}

	.project-image {
		aspect-ratio: 16 / 10;
		background: #f8fafc;
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.placeholder-image {
			color: #94a3b8;

			svg {
				width: 3rem;
				height: 3rem;
			}
		}
	}

	.project-content {
		padding: 1.5rem 1.5rem 1.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.project-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1e293b;
		margin: 0;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
		white-space: nowrap;

		&.status-completed {
			background: #dcfce7;
			color: #166534;
		}

		&.status-in-progress {
			background: #fef3c7;
			color: #92400e;
		}

		&.status-planning {
			background: #e0e7ff;
			color: #3730a3;
		}

		&.status-default {
			background: #f1f5f9;
			color: #475569;
		}
	}

	.project-description {
		color: #64748b;
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.project-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.technologies {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-tag {
		background: #f1f5f9;
		color: #475569;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;

		&.more {
			background: #e2e8f0;
			color: #64748b;
		}
	}

	.project-date {
		color: #94a3b8;
		font-size: 0.875rem;
	}

	.project-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #64748b;

		svg {
			width: 4rem;
			height: 4rem;
			margin: 0 auto 1rem;
			color: #cbd5e1;
		}

		h3 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #374151;
			margin: 0 0 0.5rem 0;
		}

		p {
			margin: 0 0 1.5rem 0;
		}
	}

	.results-count {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e2e8f0;
		color: #64748b;
		font-size: 0.875rem;
		text-align: center;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		border: none;
		cursor: pointer;
		transition: all 0.2s;

		svg {
			width: 1rem;
			height: 1rem;
		}

		&.btn-primary {
			background: #3b82f6;
			color: white;

			&:hover {
				background: #2563eb;
			}
		}

		&.btn-secondary {
			background: #f8fafc;
			color: #475569;
			border: 1px solid #e2e8f0;

			&:hover {
				background: #f1f5f9;
			}
		}

		&.btn-danger {
			background: #fef2f2;
			color: #dc2626;
			border: 1px solid #fecaca;

			&:hover {
				background: #fee2e2;
			}
		}
	}

	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			align-items: stretch;
		}

		.controls {
			flex-direction: column;
		}

		.project-card {
			grid-template-columns: 1fr;
		}

		.project-image {
			height: 150px;
		}

		.project-content {
			padding: 1rem;
		}

		.project-actions {
			flex-wrap: wrap;
		}

		.btn {
			flex: 1;
			justify-content: center;
		}
	}
</style>
