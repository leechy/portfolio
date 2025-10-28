<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Page Not Found - Leechy Dev</title>
  <meta name="description" content="The page you're looking for could not be found." />
</svelte:head>

<main class="container mx-auto px-4 py-16 text-center" data-testid="not-found-section">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <div class="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p class="text-gray-600">
        {#if $page.url.pathname.includes('/blog/')}
          The blog post you're looking for doesn't exist or has been moved.
        {:else if $page.url.pathname.includes('/projects/')}
          The project you're looking for doesn't exist or has been moved.
        {:else}
          The page you're looking for doesn't exist or has been moved.
        {/if}
      </p>
    </div>

    <div class="space-y-4">
      <a
        href="/"
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Go Home
      </a>

      {#if $page.url.pathname.includes('/blog/')}
        <a
          href="/blog"
          class="block px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          View All Blog Posts
        </a>
      {:else if $page.url.pathname.includes('/projects/')}
        <a
          href="/projects"
          class="block px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          View All Projects
        </a>
      {/if}
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 1200px;
  }
</style>
