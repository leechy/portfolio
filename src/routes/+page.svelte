<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Leechy.dev - Portfolio & Blog</title>
	<meta name="description" content="Portfolio of a passionate developer building innovative web solutions with modern technologies." />
</svelte:head>

<div class="homepage">
	<section class="hero">
		<div class="container">
			<div class="hero-content" class:animate={mounted}>
				<h1 class="hero-title">
					Hi, I'm <span class="name-highlight">Leechy</span>
				</h1>
				<p class="hero-subtitle">
					A passionate developer building innovative web solutions
				</p>
				<p class="hero-description">
					I create modern, responsive web applications using cutting-edge technologies.
					From concept to deployment, I focus on clean code, great user experience, and performance.
				</p>
				<div class="hero-actions">
					<a href="/projects" class="btn btn-primary">View My Work</a>
					<a href="/contact" class="btn btn-secondary">Get In Touch</a>
				</div>
			</div>
		</div>
	</section>

	<section class="preview-sections">
		<div class="container">
			<div class="section-grid">
				<!-- Skills Preview -->
				<div class="preview-card">
					<h2>Skills & Technologies</h2>
					<p>Expertise in modern web development technologies</p>
					<div class="skill-tags">
						<span class="skill-tag">TypeScript</span>
						<span class="skill-tag">SvelteKit</span>
						<span class="skill-tag">Node.js</span>
						<span class="skill-tag">SQLite</span>
					</div>
				</div>

				<!-- Projects Preview -->
				<div class="preview-card">
					<h2>Featured Projects</h2>
					<p>Showcasing my latest work and experiments</p>
					<a href="/projects" class="card-link">View All Projects →</a>
				</div>

				<!-- Blog Preview -->
				<div class="preview-card">
					<h2>Latest Articles</h2>
					<p>Thoughts on development, tutorials, and insights</p>
					<a href="/blog" class="card-link">Read More →</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.homepage {
		min-height: 80vh;
	}

	.hero {
		padding: $spacing-3xl 0;
		background: linear-gradient(135deg, 
			rgba($color-primary, 0.1) 0%, 
			transparent 50%, 
			rgba($color-secondary, 0.05) 100%
		);
	}

	.hero-content {
		max-width: 600px;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s ease-out;

		&.animate {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hero-title {
		font-size: clamp($font-size-4xl, 5vw, $font-size-5xl);
		font-weight: 700;
		margin-bottom: $spacing-lg;
		line-height: 1.1;

		.name-highlight {
			color: $color-primary;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: -4px;
				left: 0;
				width: 100%;
				height: 3px;
				background: linear-gradient(90deg, $color-primary, $color-secondary);
				border-radius: 2px;
			}
		}
	}

	.hero-subtitle {
		font-size: $font-size-xl;
		color: $color-text-secondary;
		margin-bottom: $spacing-md;
		font-weight: 500;
	}

	.hero-description {
		font-size: $font-size-lg;
		color: $color-text-secondary;
		line-height: 1.6;
		margin-bottom: $spacing-2xl;
	}

	.hero-actions {
		display: flex;
		gap: $spacing-lg;
		flex-wrap: wrap;
	}

	.preview-sections {
		padding: $spacing-3xl 0;
	}

	.section-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: $spacing-xl;

		@media (min-width: $breakpoint-md) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.preview-card {
		background-color: $color-bg-secondary;
		padding: $spacing-xl;
		border-radius: 12px;
		border: 1px solid $color-border;
		transition: transform $transition-base, box-shadow $transition-base;

		&:hover {
			transform: translateY(-4px);
			box-shadow: $shadow-lg;
		}

		h2 {
			color: $color-primary;
			font-size: $font-size-xl;
			margin-bottom: $spacing-md;
		}

		p {
			color: $color-text-secondary;
			margin-bottom: $spacing-lg;
		}
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: $spacing-sm;
	}

	.skill-tag {
		background-color: rgba($color-primary, 0.2);
		color: $color-primary;
		padding: $spacing-xs $spacing-md;
		border-radius: 20px;
		font-size: $font-size-sm;
		font-weight: 500;
	}

	.card-link {
		color: $color-primary;
		text-decoration: none;
		font-weight: 500;
		transition: color $transition-fast;

		&:hover {
			color: lighten($color-primary, 10%);
		}
	}
</style>
