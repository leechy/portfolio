<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore, logout } from '$lib/auth/auth';
  import { redirect } from '@sveltejs/kit';

  export let data;

  function handleLogout() {
    logout();
    goto('/admin/login');
  }

  // Get current page for active navigation styling
  $: currentPath = $page.url.pathname;
  $: isLoginPage = data?.isLoginPage || currentPath === '/admin/login';
</script>

<svelte:head>
  <title>Admin Panel - Leechy Dev</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !isLoginPage && $authStore.loading}
  <div class="auth-loading">
    <div class="loading-spinner">
      <svg class="spinner" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
    <p>Loading...</p>
  </div>
{:else if !isLoginPage && $authStore.isAuthenticated}
  <div class="admin-layout">
    <!-- Admin Navigation Sidebar -->
    <nav class="admin-sidebar" data-testid="admin-nav">
      <div class="admin-header">
        <h1>Admin Panel</h1>
        <div class="user-info">
          <span class="user-name">{$authStore.user?.name}</span>
          <button class="logout-btn" on:click={handleLogout} data-testid="logout-btn">Logout</button
          >
        </div>
      </div>

      <div class="nav-links">
        <a
          href="/admin/dashboard"
          class="nav-link"
          class:active={currentPath === '/admin/dashboard'}
        >
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"
            />
          </svg>
          Dashboard
        </a>

        <a
          href="/admin/projects"
          class="nav-link"
          class:active={currentPath.startsWith('/admin/projects')}
        >
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Projects
        </a>

        <a href="/admin/blog" class="nav-link" class:active={currentPath.startsWith('/admin/blog')}>
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Blog
        </a>

        <a
          href="/admin/media"
          class="nav-link"
          class:active={currentPath.startsWith('/admin/media')}
        >
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Media
        </a>

        <div class="nav-divider"></div>

        <a href="/" class="nav-link back-to-site">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Site
        </a>
      </div>
    </nav>

    <!-- Main Admin Content -->
    <main class="admin-content">
      <slot />
    </main>
  </div>
{:else}
  <!-- Login page or not authenticated - let the page component handle the display -->
  <slot />
{/if}

<style lang="scss">
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
  }

  .admin-sidebar {
    width: 250px;
    background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
    color: white;
    flex-shrink: 0;
    border-right: 1px solid #e2e8f0;
  }

  .admin-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid #475569;

    h1 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #f1f5f9;
    }

    .user-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;

      .user-name {
        color: #cbd5e1;
      }

      .logout-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #dc2626;
        }
      }
    }
  }

  .nav-links {
    padding: 1rem 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.2s;
    border-left: 3px solid transparent;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
    }

    &.active {
      background-color: rgba(59, 130, 246, 0.1);
      border-left-color: #3b82f6;
      color: #60a5fa;
    }

    &.back-to-site {
      margin-top: 1rem;
      border-top: 1px solid #475569;
      color: #94a3b8;

      &:hover {
        color: #f1f5f9;
      }
    }
  }

  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .nav-divider {
    height: 1px;
    background-color: #475569;
    margin: 1rem;
  }

  .admin-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .auth-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.125rem;
    color: #64748b;
    gap: 1rem;

    .loading-spinner {
      .spinner {
        width: 2rem;
        height: 2rem;
        animation: spin 1s linear infinite;
        color: #3b82f6;
      }
    }

    p {
      margin: 0;
      font-weight: 500;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .admin-layout {
      flex-direction: column;
    }

    .admin-sidebar {
      width: 100%;
      height: auto;
    }

    .nav-links {
      display: flex;
      overflow-x: auto;
      padding: 0.5rem;
    }

    .nav-link {
      flex-direction: column;
      min-width: 80px;
      text-align: center;
      font-size: 0.75rem;
      gap: 0.25rem;
    }

    .admin-content {
      padding: 1rem;
    }
  }
</style>
