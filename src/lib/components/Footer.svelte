<script lang="ts">
	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: 'GitHub',
			url: 'https://github.com/leechy',
			icon: 'github'
		},
		{
			name: 'LinkedIn',
			url: 'https://linkedin.com/in/leechy',
			icon: 'linkedin'
		},
		{
			name: 'Twitter',
			url: 'https://twitter.com/leechy',
			icon: 'twitter'
		}
	];

	const footerLinks = [
		{
			title: 'Navigation',
			links: [
				{ label: 'Home', href: '/' },
				{ label: 'Projects', href: '/projects' },
				{ label: 'Blog', href: '/blog' },
				{ label: 'About', href: '/about' },
				{ label: 'Contact', href: '/contact' }
			]
		},
		{
			title: 'Projects',
			links: [
				{ label: 'Featured Work', href: '/projects?featured=true' },
				{ label: 'Open Source', href: '/projects?type=opensource' },
				{ label: 'Web Development', href: '/projects?category=web' },
				{ label: 'All Projects', href: '/projects' }
			]
		}
	];
</script>

<div class="footer">
	<div class="container">
		<div class="footer-content">
			<!-- Brand and Description -->
			<div class="footer-brand">
				<h3 class="footer-logo">
					<span class="logo-text">Andrey Lechev</span>
				</h3>
				<p class="footer-description">
					Passionate developer creating innovative web solutions with modern technologies. Always
					learning, always building.
				</p>

				<!-- Social Links -->
				<div class="social-links">
					{#each socialLinks as social}
						<a
							href={social.url}
							class="social-link"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.name}
						>
							<span class="social-icon" data-icon={social.icon}></span>
							<span class="social-name">{social.name}</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Footer Navigation -->
			<div class="footer-nav">
				{#each footerLinks as section}
					<div class="nav-section">
						<h4 class="nav-title">{section.title}</h4>
						<ul class="nav-list">
							{#each section.links as link}
								<li>
									<a href={link.href} class="nav-link">{link.label}</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer Bottom -->
		<div class="footer-bottom">
			<div class="footer-bottom-content">
				<p class="copyright">
					© {currentYear} Leechy.dev. All rights reserved.
				</p>
				<div class="footer-bottom-links">
					<a href="/privacy" class="bottom-link">Privacy Policy</a>
					<a href="/terms" class="bottom-link">Terms of Service</a>
					<a href="/sitemap" class="bottom-link">Sitemap</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../app.scss';

	.footer {
		padding: $spacing-3xl 0 $spacing-xl;
	}

	.footer-content {
		display: grid;
		grid-template-columns: 1fr;
		gap: $spacing-2xl;

		@media (min-width: $breakpoint-md) {
			grid-template-columns: 1.5fr 1fr;
			gap: $spacing-3xl;
		}
	}

	.footer-brand {
		.footer-logo {
			font-size: $font-size-2xl;
			font-weight: 600;
			margin-bottom: $spacing-md;
			color: $color-text-primary;

			.logo-accent {
				color: $color-primary;
			}
		}

		.footer-description {
			color: $color-text-secondary;
			line-height: 1.6;
			margin-bottom: $spacing-xl;
			max-width: 400px;
		}
	}

	.social-links {
		display: flex;
		gap: $spacing-lg;
		flex-wrap: wrap;
	}

	.social-link {
		display: flex;
		align-items: center;
		gap: $spacing-sm;
		color: $color-text-secondary;
		text-decoration: none;
		padding: $spacing-sm;
		border-radius: 6px;
		transition: all $transition-fast;

		&:hover {
			color: $color-primary;
			background-color: rgba($color-primary, 0.1);
		}

		.social-icon {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;

			// Simple icon placeholders - replace with actual icons later
			&[data-icon='github']::before {
				content: '⚡';
			}
			&[data-icon='linkedin']::before {
				content: '💼';
			}
			&[data-icon='twitter']::before {
				content: '🐦';
			}
		}

		.social-name {
			font-size: $font-size-sm;
			font-weight: 500;
		}
	}

	.footer-nav {
		display: grid;
		grid-template-columns: 1fr;
		gap: $spacing-xl;

		@media (min-width: $breakpoint-sm) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.nav-section {
		.nav-title {
			color: $color-text-primary;
			font-size: $font-size-lg;
			font-weight: 600;
			margin-bottom: $spacing-md;
		}

		.nav-list {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.nav-link {
			display: inline-block;
			color: $color-text-secondary;
			text-decoration: none;
			padding: $spacing-xs 0;
			font-size: $font-size-sm;
			transition: color $transition-fast;

			&:hover {
				color: $color-primary;
			}
		}
	}

	.footer-bottom {
		margin-top: $spacing-2xl;
		padding-top: $spacing-xl;
		border-top: 1px solid $color-border;
	}

	.footer-bottom-content {
		display: flex;
		flex-direction: column;
		gap: $spacing-md;
		align-items: center;
		text-align: center;

		@media (min-width: $breakpoint-md) {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
		}
	}

	.copyright {
		color: $color-text-muted;
		font-size: $font-size-sm;
		margin: 0;
	}

	.footer-bottom-links {
		display: flex;
		gap: $spacing-lg;
		flex-wrap: wrap;
		justify-content: center;

		@media (min-width: $breakpoint-md) {
			justify-content: flex-end;
		}
	}

	.bottom-link {
		color: $color-text-muted;
		text-decoration: none;
		font-size: $font-size-sm;
		transition: color $transition-fast;

		&:hover {
			color: $color-primary;
		}
	}
</style>
