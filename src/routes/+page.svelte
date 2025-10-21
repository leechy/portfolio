<script lang="ts">
	import { onMount } from 'svelte';
	import { skillsStore, loadSkills } from '$lib/stores/skills';
	import { projectsStore, loadProjects } from '$lib/stores/projects';

	let mounted = $state(false);

	// Reactive data from stores
	const skills = $derived($skillsStore);
	const projects = $derived($projectsStore);

	onMount(async () => {
		mounted = true;

		// Load data from stores
		await Promise.all([loadSkills(), loadProjects()]);
	});
</script>

<svelte:head>
	<title>Leechy.dev - Portfolio & Blog</title>
	<meta
		name="description"
		content="Portfolio of a passionate developer building innovative web solutions with modern technologies."
	/>
</svelte:head>

<div class="homepage">
	<!-- Hero Section -->
	<section class="hero" data-testid="hero-section">
		<div class="container">
			<div class="hero-content" class:animate={mounted}>
				<h1 class="hero-title">
					Hi, I'm <span class="name-highlight">Leechy</span>
				</h1>
				<p class="hero-subtitle">A passionate developer building innovative web solutions</p>
				<p class="hero-description">
					I create modern, responsive web applications using cutting-edge technologies. From concept
					to deployment, I focus on clean code, great user experience, and performance.
				</p>
				<div class="hero-actions">
					<a href="/projects" class="btn btn-primary">View My Work</a>
					<a href="/contact" class="btn btn-secondary">Get In Touch</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Skills Section -->
	<section class="skills-section" data-testid="skills-section">
		<div class="container">
			<h2>Skills & Technologies</h2>

			{#if skills.loading}
				<div class="loading-state">Loading skills...</div>
			{:else if skills.error}
				<div class="error-state" data-testid="error-message">Error: {skills.error}</div>
			{:else}
				{#each skills.categories as category}
					<div
						class="skill-category"
						data-testid="skill-category"
						data-category={category.name === 'Frontend Development'
							? 'frontend'
							: category.name === 'Backend Development'
								? 'backend'
								: 'tool'}
					>
						<h3>
							{#if category.icon}<span class="category-icon">{category.icon}</span>{/if}
							{category.name}
						</h3>
						<div class="skills-grid">
							{#each category.skills as skill}
								<div class="skill-card" data-testid="skill-card">
									<div class="skill-name" data-testid="skill-name">{skill.name}</div>
									<div class="skill-proficiency" data-testid="skill-proficiency">
										{skill.proficiency}
									</div>
									{#if skill.description}
										<div class="skill-description">{skill.description}</div>
									{/if}
									{#if skill.yearsExperience}
										<div class="skill-experience">{skill.yearsExperience} years</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>
	<!-- Featured Projects Section -->
	<section class="featured-projects" data-testid="featured-projects-section">
		<div class="container">
			<h2>Featured Projects</h2>

			{#if projects.loading}
				<div class="loading-state">Loading projects...</div>
			{:else if projects.error}
				<div class="error-state" data-testid="error-message">Error: {projects.error}</div>
			{:else}
				<div class="projects-grid">
					{#each projects.featured as project}
						<div class="project-card" data-testid="project-card">
							<h3 class="project-title" data-testid="project-title">{project.title}</h3>
							<p class="project-description" data-testid="project-description">
								{project.description}
							</p>
							<div class="project-technologies" data-testid="project-technologies">
								{#each project.technologies as tech}
									<span class="tech-tag">{tech}</span>
								{/each}
							</div>
							<div class="project-links">
								{#if project.demoUrl}
									<a
										href={project.demoUrl}
										class="project-link"
										target="_blank"
										rel="noopener noreferrer"
									>
										View Demo
									</a>
								{/if}
								{#if project.githubUrl}
									<a
										href={project.githubUrl}
										class="project-link"
										target="_blank"
										rel="noopener noreferrer"
									>
										GitHub
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Contact Section -->
	<section class="contact-section" data-testid="contact-section">
		<div class="container">
			<h2>Get In Touch</h2>
			<div class="contact-content">
				<div class="contact-info" data-testid="contact-info">
					<p>Let's work together to build something amazing!</p>
					<div class="contact-methods">
						<a href="mailto:hello@leechy.dev" class="contact-method">
							<span class="method-label">Email:</span>
							<span class="method-value">hello@leechy.dev</span>
						</a>
					</div>
				</div>
				<div class="social-links">
					<a href="https://github.com/leechy" class="social-link" data-testid="social-link-github">
						GitHub
					</a>
					<a
						href="https://linkedin.com/in/leechy"
						class="social-link"
						data-testid="social-link-linkedin"
					>
						LinkedIn
					</a>
					<a
						href="https://twitter.com/leechy"
						class="social-link"
						data-testid="social-link-twitter"
					>
						Twitter
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.homepage {
		min-height: 80vh;
	}

	.hero {
		padding: 4rem 0;
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0.1) 0%,
			transparent 50%,
			rgba(99, 102, 241, 0.05) 100%
		);
	}

	.hero-content {
		max-width: 600px;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s ease-out;
	}

	.hero-content.animate {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-title {
		font-size: clamp(2.25rem, 5vw, 3rem);
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.1;
	}

	.name-highlight {
		color: #3b82f6;
		position: relative;
	}

	.name-highlight::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, #3b82f6, #6366f1);
		border-radius: 2px;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: #64748b;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.hero-description {
		font-size: 1.125rem;
		color: #64748b;
		line-height: 1.6;
		margin-bottom: 3rem;
	}

	.hero-actions {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	/* Skills Section */
	.skills-section {
		padding: $spacing-xl 0;
		background: #f8fafc;
	}

	.skills-section h2 {
		text-align: center;
		margin-bottom: $spacing-lg;
		color: $color-text-primary;
		font-size: 2rem;
	}

	.skill-category {
		margin-bottom: $spacing-lg;
	}

	.skill-category h3 {
		color: $color-primary;
		font-size: 1.5rem;
		margin-bottom: $spacing-md;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: $spacing-md;
		margin-bottom: $spacing-lg;
	}

	.skill-card {
		background: white;
		padding: $spacing-md;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.skill-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.skill-name {
		font-weight: 600;
		color: $color-text-primary;
		margin-bottom: $spacing-sm;
	}

	.skill-proficiency {
		font-size: 0.875rem;
		color: $color-text-secondary;
		background: rgba(59, 130, 246, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		display: inline-block;
	}

	/* Featured Projects Section */
	.featured-projects {
		padding: $spacing-xl 0;
	}

	.featured-projects h2 {
		text-align: center;
		margin-bottom: $spacing-lg;
		color: $color-text-primary;
		font-size: 2rem;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: $spacing-lg;
	}

	.project-card {
		background: white;
		padding: $spacing-lg;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.project-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
	}

	.project-title {
		color: $color-primary;
		font-size: 1.25rem;
		margin-bottom: $spacing-sm;
		font-weight: 600;
	}

	.project-description {
		color: $color-text-secondary;
		line-height: 1.6;
		margin-bottom: $spacing-md;
	}

	.project-technologies {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-sm;
	}

	.tech-tag {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Contact Section */
	.contact-section {
		padding: $spacing-xl 0;
		background: #f8fafc;
	}

	.contact-section h2 {
		text-align: center;
		margin-bottom: $spacing-lg;
		color: $color-text-primary;
		font-size: 2rem;
	}

	.contact-content {
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}

	.contact-info p {
		font-size: 1.125rem;
		color: $color-text-secondary;
		margin-bottom: $spacing-md;
	}

	.contact-methods {
		margin-bottom: $spacing-lg;
	}

	.contact-method {
		display: inline-flex;
		align-items: center;
		gap: $spacing-sm;
		color: $color-primary;
		text-decoration: none;
		font-size: 1.1rem;
		transition: color 0.2s ease;
	}

	.contact-method:hover {
		color: darken($color-primary, 10%);
	}

	.method-label {
		font-weight: 600;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: $spacing-md;
		flex-wrap: wrap;
	}

	.social-link {
		display: inline-block;
		padding: $spacing-sm $spacing-md;
		background: white;
		color: $color-primary;
		text-decoration: none;
		border-radius: 8px;
		border: 2px solid $color-primary;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.social-link:hover {
		background: $color-primary;
		color: white;
	}

	/* Loading and Error States */
	.loading-state,
	.error-state {
		text-align: center;
		padding: $spacing-lg;
		border-radius: 8px;
		margin: $spacing-md 0;
	}

	.loading-state {
		background: rgba(59, 130, 246, 0.1);
		color: $color-primary;
		font-style: italic;
	}

	.error-state {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	/* Enhanced Skill Cards */
	.category-icon {
		margin-right: $spacing-sm;
		font-size: 1.2rem;
	}

	.skill-description {
		font-size: 0.875rem;
		color: $color-text-secondary;
		margin-top: $spacing-xs;
		line-height: 1.4;
	}

	.skill-experience {
		font-size: 0.75rem;
		color: $color-text-tertiary;
		margin-top: $spacing-xs;
		font-style: italic;
	}

	/* Project Links */
	.project-links {
		display: flex;
		gap: $spacing-sm;
		margin-top: $spacing-md;
		flex-wrap: wrap;
	}

	.project-link {
		display: inline-block;
		padding: $spacing-xs $spacing-sm;
		background: $color-primary;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.project-link:hover {
		background: darken($color-primary, 10%);
		transform: translateY(-1px);
	}
</style>
