<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    // Redirect to admin dashboard
    goto('/admin/dashboard');
  });
</script>

<!-- This page immediately redirects to the dashboard -->
<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p class="mt-4 text-gray-600">Redirecting to admin dashboard...</p>
  </div>
</div>
