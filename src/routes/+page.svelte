<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
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

			<!-- Frontend Skills Category -->
			<div class="skill-category" data-testid="skill-category-frontend">
				<h3>Frontend Development</h3>
				<div class="skills-grid">
					<div class="skill-card" data-testid="skill-card">
						<div class="skill-name" data-testid="skill-name">TypeScript</div>
						<div class="skill-proficiency" data-testid="skill-proficiency">Advanced</div>
					</div>
					<div class="skill-card" data-testid="skill-card">
						<div class="skill-name" data-testid="skill-name">SvelteKit</div>
						<div class="skill-proficiency" data-testid="skill-proficiency">Advanced</div>
					</div>
					<div class="skill-card" data-testid="skill-card">
						<div class="skill-name" data-testid="skill-name">React</div>
						<div class="skill-proficiency" data-testid="skill-proficiency">Intermediate</div>
					</div>
				</div>
			</div>

			<!-- Backend Skills Category -->
			<div class="skill-category" data-testid="skill-category-backend">
				<h3>Backend Development</h3>
				<div class="skills-grid">
					<div class="skill-card" data-testid="skill-card">
						<div class="skill-name" data-testid="skill-name">Node.js</div>
						<div class="skill-proficiency" data-testid="skill-proficiency">Advanced</div>
					</div>
					<div class="skill-card" data-testid="skill-card">
						<div class="skill-name" data-testid="skill-name">SQLite</div>
						<div class="skill-proficiency" data-testid="skill-proficiency">Intermediate</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Projects Section -->
	<section class="featured-projects" data-testid="featured-projects-section">
		<div class="container">
			<h2>Featured Projects</h2>
			<div class="projects-grid">
				<div class="project-card" data-testid="project-card">
					<h3 class="project-title" data-testid="project-title">Portfolio Website</h3>
					<p class="project-description" data-testid="project-description">
						A modern portfolio website built with SvelteKit, featuring responsive design and
						optimized performance.
					</p>
					<div class="project-technologies" data-testid="project-technologies">
						<span class="tech-tag">SvelteKit</span>
						<span class="tech-tag">TypeScript</span>
						<span class="tech-tag">Tailwind CSS</span>
					</div>
				</div>
				<div class="project-card" data-testid="project-card">
					<h3 class="project-title" data-testid="project-title">Task Management App</h3>
					<p class="project-description" data-testid="project-description">
						A collaborative task management application with real-time updates and team
						collaboration features.
					</p>
					<div class="project-technologies" data-testid="project-technologies">
						<span class="tech-tag">Node.js</span>
						<span class="tech-tag">SQLite</span>
						<span class="tech-tag">WebSocket</span>
					</div>
				</div>
			</div>
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
</style>
