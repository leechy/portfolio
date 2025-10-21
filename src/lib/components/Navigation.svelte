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

<nav class="navigation" class:scrolled aria-label="Main navigation">
	<div class="container">
		<div class="nav-content">
			<!-- Logo/Brand -->
			<a href="/" class="logo" onclick={() => handleNavigation('/')}>
				<span class="logo-text">Leechy<span class="logo-accent">.dev</span></span>
			</a>

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
		padding: 0.5rem 0;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		text-decoration: none;
		color: #1e293b;
		font-weight: 600;
		font-size: 1.25rem;
		transition: color 0.15s ease-in-out;
	}

	.logo:hover {
		color: #3b82f6;
	}

	.logo-accent {
		color: #3b82f6;
	}

	.nav-links {
		display: flex;
		list-style: none;
		gap: 2rem;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		color: #64748b;
		text-decoration: none;
		font-weight: 500;
		font-size: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		transition: all 0.15s ease-in-out;
		position: relative;
	}

	.nav-link:hover {
		color: #3b82f6;
		background-color: rgba(59, 130, 246, 0.1);
	}

	.nav-link.active {
		color: #3b82f6;
		background-color: rgba(59, 130, 246, 0.15);
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
		background-color: #1e293b;
		transition: all 0.25s ease-in-out;
		transform-origin: center;
	}

	.hamburger-line.active:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.hamburger-line.active:nth-child(2) {
		opacity: 0;
	}

	.hamburger-line.active:nth-child(3) {
		transform: rotate(-45deg) translate(7px, -6px);
	}

	.mobile-nav {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e2e8f0;
		padding: 1.5rem 0;
		animation: slideDown 0.3s ease-out;
	}

	.mobile-nav-links {
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
