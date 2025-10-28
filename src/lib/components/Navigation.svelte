<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	// Navigation items
	const navItems = [
		// { href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 36;
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

<nav class="navigation" class:scrolled aria-label="Main navigation">
	<div class="container">
		<div class="nav-content">
			<!-- Logo/Brand -->
			{#if $page.url.pathname === '/'}
				<span class="logo logo-active">
					<span class="logo-text">Index of /</span>
				</span>
			{:else}
				<a href="/" class="logo" onclick={() => handleNavigation('/')}>
					<span class="logo-text">Index of /</span>
				</a>
			{/if}

			<!-- Desktop Navigation -->
			<ul class="nav-links desktop-only" data-testid="main-nav-links">
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
				data-testid="mobile-menu-toggle"
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
			<div class="mobile-nav mobile-only" data-testid="mobile-navigation">
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

<style>
	.navigation {
		padding: 1rem 0;
		transition: all 0.25s ease-in-out;
	}

	.navigation.scrolled {
		padding: var(--spacing-xs) 0;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		text-decoration: none;
		color: var(--color-primary);
		font-weight: 600;
		font-size: 1.25rem;
		transition: color 0.15s ease-in-out;
		opacity: 0.6;
	}

	.logo:hover,
	.logo-active {
		opacity: 1;
	}

	.logo-active {
		color: var(--color-text-primary);
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: 2rem;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		color: var(--color-primary-soft);
		text-decoration: none;
		font-weight: 500;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		transition: all 0.15s ease-in-out;
		position: relative;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--color-primary);
		background-color: color-mix(in srgb, var(--color-primary), transparent 80%);
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
		background-color: var(--color-primary-soft);
		transition: all 0.25s ease-in-out;
		transform-origin: center;
	}

	.hamburger-line.active:nth-child(1) {
		transform: rotate(45deg) translate(3px, 3px);
	}

	.hamburger-line.active:nth-child(2) {
		opacity: 0;
	}

	.hamburger-line.active:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -6px);
	}

	.mobile-nav {
		margin: 1rem -1rem -1rem -1rem;
		border-top: 1px solid var(--color-border);
		padding: 1.5rem 0;
		animation: slideDown 0.3s ease-out;
	}

	.mobile-nav-links {
		width: 100%;
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 0.5rem;
	}

	.mobile-nav-link {
		display: block;
		color: #64748b;
		text-decoration: none;
		font-weight: 500;
		font-size: 1.125rem;
		padding: 1rem 1.5rem;
		margin: 0 1rem;
		border-radius: 8px;
		transition: all 0.15s ease-in-out;
	}

	.mobile-nav-link:hover {
		color: #3b82f6;
		background-color: rgba(59, 130, 246, 0.1);
	}

	.mobile-nav-link.active {
		color: #3b82f6;
		background-color: rgba(59, 130, 246, 0.15);
	}

	/* Responsive utilities */
	@media (max-width: 768px) {
		.desktop-only {
			display: none;
		}
	}

	.mobile-only {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-only {
			display: flex;
		}
	}

	/* Animations */
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
