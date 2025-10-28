<script>
  export let data;

  // Get stats and recent activity from server-side data
  $: stats = data.stats;
  $: recentActivity = data.recentActivity;
</script>

<svelte:head>
  <title>Admin Dashboard - Leechy Dev</title>
</svelte:head>

<div class="dashboard" data-testid="admin-dashboard">
  <header class="dashboard-header">
    <h1>Dashboard</h1>
    <p class="dashboard-subtitle">Welcome back! Here's what's happening with your portfolio.</p>
  </header>

  <!-- Stats Grid -->
  <div class="stats-grid" data-testid="stats-overview">
    <div class="stat-card" data-testid="total-projects">
      <div class="stat-icon projects">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <div class="stat-content">
        <h3>Projects</h3>
        <p class="stat-number">{stats.totalProjects}</p>
        <p class="stat-detail">{stats.publishedProjects} published</p>
      </div>
    </div>

    <div class="stat-card" data-testid="total-blog-posts">
      <div class="stat-icon blog">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <div class="stat-content">
        <h3>Blog Posts</h3>
        <p class="stat-number">{stats.totalBlogPosts}</p>
        <p class="stat-detail">{stats.draftPosts} drafts</p>
      </div>
    </div>

    <div class="stat-card" data-testid="recent-views">
      <div class="stat-icon views">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>
      <div class="stat-content">
        <h3>Total Views</h3>
        <p class="stat-number">{stats.totalViews.toLocaleString()}</p>
        <p class="stat-detail">This month</p>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon performance">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
      <div class="stat-content">
        <h3>Performance</h3>
        <p class="stat-number">98%</p>
        <p class="stat-detail">Lighthouse score</p>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="quick-actions">
    <h2>Quick Actions</h2>
    <div class="actions-grid">
      <a href="/admin/projects/new" class="action-card" data-testid="new-project-btn">
        <div class="action-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div class="action-content">
          <h3>New Project</h3>
          <p>Add a new project to your portfolio</p>
        </div>
      </a>

      <a href="/admin/blog/new" class="action-card" data-testid="new-blog-post-btn">
        <div class="action-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <div class="action-content">
          <h3>Write Blog Post</h3>
          <p>Create a new blog post</p>
        </div>
      </a>

      <a href="/admin/media" class="action-card">
        <div class="action-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div class="action-content">
          <h3>Upload Media</h3>
          <p>Manage images and files</p>
        </div>
      </a>

      <a href="/" class="action-card">
        <div class="action-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <div class="action-content">
          <h3>View Site</h3>
          <p>Preview your live portfolio</p>
        </div>
      </a>
    </div>
  </div>

  <!-- Recent Activity -->
  <div class="recent-activity" data-testid="recent-activity">
    <h2>Recent Activity</h2>
    <div class="activity-list">
      {#each recentActivity as activity}
        <div class="activity-item">
          <div class="activity-icon {activity.type}">
            {#if activity.type === 'blog'}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            {:else}
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            {/if}
          </div>
          <div class="activity-content">
            <p class="activity-title">{activity.action} "{activity.title}"</p>
            <p class="activity-date">{activity.date}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-subtitle {
      color: #64748b;
      font-size: 1.125rem;
      margin: 0;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    &.projects {
      background: #dbeafe;
      color: #3b82f6;
    }

    &.blog {
      background: #dcfce7;
      color: #22c55e;
    }

    &.views {
      background: #fef3c7;
      color: #f59e0b;
    }

    &.performance {
      background: #e9d5ff;
      color: #8b5cf6;
    }
  }

  .stat-content {
    h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 0.25rem 0;
    }

    .stat-number {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    .stat-detail {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }
  }

  .quick-actions {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .action-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
  }

  .action-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .action-content {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.25rem 0;
    }

    p {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }
  }

  .recent-activity {
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
  }

  .activity-list {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border-bottom: none;
    }
  }

  .activity-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1rem;
      height: 1rem;
    }

    &.blog {
      background: #dcfce7;
      color: #22c55e;
    }

    &.project {
      background: #dbeafe;
      color: #3b82f6;
    }
  }

  .activity-content {
    .activity-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
      margin: 0 0 0.125rem 0;
    }

    .activity-date {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-header h1 {
      font-size: 1.5rem;
    }

    .stat-card,
    .action-card {
      padding: 1rem;
    }
  }
</style>
