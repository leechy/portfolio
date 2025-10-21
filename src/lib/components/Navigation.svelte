<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleNavigation(href: string) {
		mobileMenuOpen = false;
		goto(href);
	}

	function isActiveRoute(href: string): boolean {
		if (href === '/') {
			return $page.url.pathname === '/';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<nav class="navigation" class:scrolled>
	<div class="container">
		<div class="nav-content">
			<!-- Logo/Brand -->
			<a href="/" class="logo" onclick={() => handleNavigation('/')}>
				<span class="logo-text">Leechy<span class="logo-accent">.dev</span></span>
			</a>

			<!-- Desktop Navigation -->
			<ul class="nav-links desktop-only">
				{#each navItems as item}
					<li>
						<a 
							href={item.href}
							class="nav-link"
							class:active={isActiveRoute(item.href)}
							onclick={() => handleNavigation(item.href)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<!-- Mobile Menu Button -->
			<button 
				class="mobile-menu-button mobile-only"
				onclick={toggleMobileMenu}
				aria-label="Toggle mobile menu"
				aria-expanded={mobileMenuOpen}
			>
				<span class="hamburger-line" class:active={mobileMenuOpen}></span>
				<span class="hamburger-line" class:active={mobileMenuOpen}></span>
				<span class="hamburger-line" class:active={mobileMenuOpen}></span>
			</button>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="mobile-nav mobile-only">
				<ul class="mobile-nav-links">
					{#each navItems as item}
						<li>
							<a 
								href={item.href}
								class="mobile-nav-link"
								class:active={isActiveRoute(item.href)}
								onclick={() => handleNavigation(item.href)}
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</nav>

<style lang="scss">
	.navigation {
		padding: $spacing-md 0;
		transition: all $transition-base;
		
		&.scrolled {
			padding: $spacing-sm 0;
		}
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		text-decoration: none;
		color: $color-text-primary;
		font-weight: 600;
		font-size: $font-size-xl;
		transition: color $transition-fast;

		&:hover {
			color: $color-primary;
		}
	}

	.logo-text {
		.logo-accent {
			color: $color-primary;
		}
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: $spacing-xl;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		color: $color-text-secondary;
		text-decoration: none;
		font-weight: 500;
		font-size: $font-size-base;
		padding: $spacing-sm $spacing-md;
		border-radius: 6px;
		transition: all $transition-fast;
		position: relative;

		&:hover {
			color: $color-primary;
			background-color: rgba($color-primary, 0.1);
		}

		&.active {
			color: $color-primary;
			background-color: rgba($color-primary, 0.15);
		}
	}

	.mobile-menu-button {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		gap: 4px;
	}

	.hamburger-line {
		width: 100%;
		height: 2px;
		background-color: $color-text-primary;
		transition: all $transition-base;
		transform-origin: center;

		&.active {
			&:nth-child(1) {
				transform: rotate(45deg) translate(5px, 5px);
			}
			&:nth-child(2) {
				opacity: 0;
			}
			&:nth-child(3) {
				transform: rotate(-45deg) translate(7px, -6px);
			}
		}
	}

	.mobile-nav {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: rgba($color-bg-primary, 0.98);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid $color-border;
		padding: $spacing-lg 0;
		animation: slideDown 0.3s ease-out;
	}

	.mobile-nav-links {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: $spacing-sm;
	}

	.mobile-nav-link {
		display: block;
		color: $color-text-secondary;
		text-decoration: none;
		font-weight: 500;
		font-size: $font-size-lg;
		padding: $spacing-md $spacing-lg;
		margin: 0 $spacing-md;
		border-radius: 8px;
		transition: all $transition-fast;

		&:hover {
			color: $color-primary;
			background-color: rgba($color-primary, 0.1);
		}

		&.active {
			color: $color-primary;
			background-color: rgba($color-primary, 0.15);
		}
	}

	// Responsive utilities
	.desktop-only {
		@media (max-width: $breakpoint-md) {
			display: none;
		}
	}

	.mobile-only {
		display: none;
		
		@media (max-width: $breakpoint-md) {
			display: flex;
		}
	}

	// Animations
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>