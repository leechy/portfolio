<script lang="ts">
	import '../app.scss';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app">
	<header class="header">
		<Navigation />
	</header>

	<main class="main">
		{@render children?.()}
	</main>

	<footer class="footer">
		<Footer />
	</footer>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #ffffff;
		color: #1e293b;
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 1020;
		background-color: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #e2e8f0;
	}

	.main {
		flex: 1;
		width: 100%;
	}

	.footer {
		border-top: 1px solid #e2e8f0;
		background-color: #f8fafc;
	}
</style>
