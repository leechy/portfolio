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
  <div class="header-container"></div>

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
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }

  .header-container {
    height: 60px;
  }

  .header {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1020;
    background-color: color-mix(in srgb, var(--color-bg-primary), transparent 70%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--color-border);
  }

  .main {
    flex: 1;
    width: 100%;
  }

  .footer {
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-secondary);
  }
</style>
