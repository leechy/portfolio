<script lang="ts">
	import { onMount } from 'svelte';
	import {
		loadProjects,
		projectsStore,
		getProjectsByTechnology,
		searchProjects
	} from '../../lib/stores/projects';
	import type { Project } from '../../lib/stores/projects';

	let projects: Project[] = [];
	let filteredProjects: Project[] = [];
	let loading = true;
	let error: string | null = null;
	let searchQuery = '';
	let selectedTechnology = '';

	// Get unique technologies for filter dropdown
	let allTechnologies: string[] = [];

	onMount(async () => {
		try {
			await loadProjects();
			projectsStore.subscribe(state => {
				projects = state.projects;
				filteredProjects = projects;
				loading = state.loading;
				error = state.error;

				// Extract all unique technologies
				const techSet = new Set<string>();
				projects.forEach(project => {
					project.technologies.forEach(tech => techSet.add(tech));
				});
				allTechnologies = Array.from(techSet).sort();
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load projects';
			loading = false;
		}
	});

	// Filter projects based on search query and technology
	$: {
		let result = projects;

		if (searchQuery.trim()) {
			result = searchProjects(searchQuery);
		}

		if (selectedTechnology) {
			result = result.filter(project =>
				project.technologies.some(tech => tech.toLowerCase() === selectedTechnology.toLowerCase())
			);
		}

		filteredProjects = result;
	}

	function clearFilters() {
		searchQuery = '';
		selectedTechnology = '';
	}

	function handleProjectClick(projectId: string) {
		window.location.href = `/projects/${projectId}`;
	}
</script>

<svelte:head>
	<title>Projects - Leechy's Portfolio</title>
	<meta
		name="description"
		content="Explore my development projects, technologies used, and the challenges I've solved."
	/>
</svelte:head>

<div class="projects-overview" data-testid="projects-overview">
	<div class="container">
		<header class="projects-header">
			<h1>My Projects</h1>
			<p class="projects-subtitle">
				Explore the projects I've built, the technologies I've used, and the challenges I've solved.
			</p>
		</header>

		{#if loading}
			<div class="loading-section">
				<div class="loading-spinner" data-testid="projects-loading"></div>
				<p>Loading projects...</p>
			</div>
		{:else if error}
			<div class="error-section" data-testid="projects-error">
				<h2>Error Loading Projects</h2>
				<p>{error}</p>
			</div>
		{:else}
			<!-- Filters Section -->
			<div class="filters-section" data-testid="projects-filters">
				<div class="filter-controls">
					<div class="search-control">
						<label for="search-projects">Search Projects:</label>
						<input
							id="search-projects"
							type="text"
							bind:value={searchQuery}
							placeholder="Search by title, description, or technology..."
							data-testid="project-search-input"
						/>
					</div>

					<div class="technology-filter">
						<label for="technology-select">Filter by Technology:</label>
						<select
							id="technology-select"
							bind:value={selectedTechnology}
							data-testid="technology-filter-select"
						>
							<option value="">All Technologies</option>
							{#each allTechnologies as tech}
								<option value={tech}>{tech}</option>
							{/each}
						</select>
					</div>

					<button
						type="button"
						on:click={clearFilters}
						class="clear-filters-btn"
						data-testid="clear-filters-btn"
					>
						Clear Filters
					</button>
				</div>

				<div class="filter-results">
					<p data-testid="projects-count">
						Showing {filteredProjects.length} of {projects.length} projects
					</p>
				</div>
			</div>

			<!-- Projects Grid -->
			<div class="projects-grid" data-testid="projects-grid">
				{#each filteredProjects as project (project.id)}
					<article class="project-card" data-testid="project-overview-card">
						<div class="project-card-content" on:click={() => handleProjectClick(project.id)}>
							{#if project.imageUrl}
								<div class="project-image">
									<img src={project.imageUrl} alt="{project.title} screenshot" loading="lazy" />
								</div>
							{/if}

							<div class="project-info">
								<header class="project-card-header">
									<h2 class="project-title">{project.title}</h2>
									<div class="project-meta">
										<span
											class="project-status status-{project.status}"
											data-testid="project-status"
										>
											{project.status}
										</span>
										{#if project.featured}
											<span class="featured-badge" data-testid="featured-badge">Featured</span>
										{/if}
									</div>
								</header>

								<p class="project-description">{project.description}</p>

								<div class="project-technologies" data-testid="project-technologies">
									{#each project.technologies as tech}
										<span class="tech-tag" data-testid="tech-tag">{tech}</span>
									{/each}
								</div>

								<div class="project-links">
									{#if project.demoUrl}
										<a
											href={project.demoUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="project-link demo-link"
											data-testid="demo-link"
											on:click|stopPropagation
										>
											View Demo
										</a>
									{/if}
									{#if project.githubUrl}
										<a
											href={project.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="project-link github-link"
											data-testid="github-link"
											on:click|stopPropagation
										>
											View Code
										</a>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{:else}
					<div class="no-projects" data-testid="no-projects-found">
						<h2>No Projects Found</h2>
						<p>
							No projects match your current filters. Try adjusting your search or clearing the
							filters.
						</p>
						<button type="button" on:click={clearFilters} class="clear-filters-btn">
							Clear Filters
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '$lib/styles/variables.scss';

	.projects-overview {
		min-height: 100vh;
		padding: 2rem 0;
		background: $color-bg-secondary;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.projects-header {
		text-align: center;
		margin-bottom: 3rem;

		h1 {
			font-size: 3rem;
			color: $color-primary;
			margin-bottom: 1rem;
		}

		.projects-subtitle {
			font-size: 1.2rem;
			color: $color-text-secondary;
			max-width: 600px;
			margin: 0 auto;
		}
	}

	.loading-section,
	.error-section {
		text-align: center;
		padding: 3rem 0;

		.loading-spinner {
			width: 3rem;
			height: 3rem;
			border: 3px solid $color-border;
			border-top: 3px solid $color-primary;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin: 0 auto 1rem;
		}
	}

	.filters-section {
		background: $color-bg-primary;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 1px solid $color-border;

		.filter-controls {
			display: grid;
			grid-template-columns: 1fr auto auto;
			gap: 1rem;
			align-items: end;
			margin-bottom: 1rem;

			@media (max-width: 768px) {
				grid-template-columns: 1fr;
			}
		}

		label {
			display: block;
			margin-bottom: 0.5rem;
			font-weight: 500;
			color: $color-text-primary;
		}

		input,
		select {
			width: 100%;
			padding: 0.75rem;
			border: 1px solid $color-border;
			border-radius: 8px;
			background: $color-bg-primary;
			color: $color-text-primary;
			font-size: 1rem;

			&:focus {
				outline: none;
				border-color: $color-primary;
				box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
			}
		}

		.clear-filters-btn {
			padding: 0.75rem 1.5rem;
			background: $color-secondary;
			color: white;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			font-size: 0.9rem;
			transition: background-color 0.2s ease;

			&:hover {
				background: color.adjust($color-secondary, $lightness: -10%);
			}
		}

		.filter-results {
			color: $color-text-secondary;
			font-size: 0.9rem;
		}
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.project-card {
		background: $color-bg-primary;
		border-radius: 8px;
		border: 1px solid $color-border;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		cursor: pointer;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}
	}

	.project-card-content {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.project-image {
		height: 200px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.project-info {
		padding: 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.project-card-header {
		margin-bottom: 1rem;

		.project-title {
			font-size: 1.5rem;
			color: $color-primary;
			margin-bottom: 0.5rem;
		}

		.project-meta {
			display: flex;
			gap: 0.5rem;
			align-items: center;

			.project-status {
				padding: 0.25rem 0.75rem;
				border-radius: 1rem;
				font-size: 0.8rem;
				font-weight: 500;
				text-transform: capitalize;

				&.status-completed {
					background: rgba(34, 197, 94, 0.1);
					color: rgb(34, 197, 94);
				}

				&.status-development {
					background: rgba(251, 191, 36, 0.1);
					color: rgb(251, 191, 36);
				}

				&.status-planning {
					background: rgba(168, 85, 247, 0.1);
					color: rgb(168, 85, 247);
				}
			}

			.featured-badge {
				padding: 0.25rem 0.75rem;
				background: rgba(59, 130, 246, 0.1);
				color: $color-primary;
				border-radius: 1rem;
				font-size: 0.8rem;
				font-weight: 500;
			}
		}
	}

	.project-description {
		color: $color-text-secondary;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		flex: 1;
	}

	.project-technologies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;

		.tech-tag {
			padding: 0.25rem 0.75rem;
			background: rgba(59, 130, 246, 0.1);
			color: $color-primary;
			border-radius: 1rem;
			font-size: 0.8rem;
			font-weight: 500;
		}
	}

	.project-links {
		display: flex;
		gap: 1rem;

		.project-link {
			padding: 0.5rem 1rem;
			border-radius: 8px;
			text-decoration: none;
			font-size: 0.9rem;
			font-weight: 500;
			transition: all 0.2s ease;

			&.demo-link {
				background: $color-primary;
				color: white;

				&:hover {
					background: color.adjust($color-primary, $lightness: -10%);
				}
			}

			&.github-link {
				background: transparent;
				color: $color-text-primary;
				border: 1px solid $color-border;

				&:hover {
					background: $color-bg-secondary;
				}
			}
		}
	}

	.no-projects {
		grid-column: 1 / -1;
		text-align: center;
		padding: 3rem;

		h2 {
			color: $color-text-primary;
			margin-bottom: 1rem;
		}

		p {
			color: $color-text-secondary;
			margin-bottom: 2rem;
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
