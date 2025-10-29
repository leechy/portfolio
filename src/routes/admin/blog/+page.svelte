<script lang="ts">
  import { onMount } from 'svelte';
  import { type BlogPost } from '$lib/server/database.js';

  export let data;

  let postList: BlogPost[] = [];
  let filteredPosts: BlogPost[] = [];
  let searchTerm = '';
  const statusFilter = 'all';
  let tagFilter = 'all';
  let sortBy = 'date';

  // Calculate reading time from content (rough estimate: 200 words per minute)
  function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  onMount(() => {
    postList = data.posts.map(post => ({
      ...post,
      reading_time: calculateReadingTime(post.content)
    }));
    filterAndSortPosts();
  });

  function filterAndSortPosts() {
    let filtered = postList;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply tag filter (using first tag as category)
    if (tagFilter !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(tagFilter));
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        filtered.sort((a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || ''));
        break;
      case 'readTime':
        filtered.sort((a, b) => (a.reading_time || 100) - (b.reading_time || 100));
        break;
      case 'date':
      default:
        filtered.sort((a, b) =>
          new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime() > 0
            ? 1
            : -1
        );
        break;
    }

    filteredPosts = filtered;
  }

  async function deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/blogs/${postId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete blog post');
        }

        // Remove from local list on successful deletion
        postList = postList.filter(p => p.id !== postId);
        filterAndSortPosts();
      } catch (error: any) {
        console.error('Error deleting blog post: ' + error.message);
      }
    }
  }

  function getCategoryColor(tag: string) {
    const colors: { [key: string]: string } = {
      SvelteKit: 'bg-blue-100 text-blue-800',
      CSS: 'bg-green-100 text-green-800',
      TypeScript: 'bg-purple-100 text-purple-800',
      React: 'bg-pink-100 text-pink-800',
      Performance: 'bg-orange-100 text-orange-800',
      Accessibility: 'bg-indigo-100 text-indigo-800'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  }

  // Get unique tags for filter
  $: tags = [...new Set(postList.flatMap(post => post.tags))];

  // Reactive statements
  $: if (
    searchTerm !== undefined ||
    statusFilter !== undefined ||
    tagFilter !== undefined ||
    sortBy !== undefined
  ) {
    filterAndSortPosts();
  }
</script>

<svelte:head>
  <title>Admin - Blog</title>
</svelte:head>

<div class="blog-admin" data-testid="admin-blog">
  <header class="page-header">
    <div class="header-content">
      <h1>Manage Blog Posts</h1>
      <p>Create, edit, and organize your blog content</p>
    </div>
    <a href="/admin/blog/new" class="btn btn-primary" data-testid="add-blog-post-btn">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New Post
    </a>
  </header>

  <!-- Filters and Search -->
  <div class="controls">
    <div class="search-box">
      <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search blog posts..."
        bind:value={searchTerm}
        data-testid="search-input"
      />
    </div>

    <div class="filters">
      <select bind:value={tagFilter} data-testid="category-filter">
        <option value="all">All Tags</option>
        {#each tags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>

      <select bind:value={sortBy} data-testid="sort-select">
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
        <option value="category">Sort by Category</option>
        <option value="readTime">Sort by Read Time</option>
      </select>
    </div>
  </div>

  <!-- Blog Posts List -->
  <div class="posts-list" data-testid="blog-posts-list">
    {#if filteredPosts.length === 0}
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3>No blog posts found</h3>
        <p>Try adjusting your search or filters, or create a new post.</p>
        <a href="/admin/blog/new" class="btn btn-primary">Create First Post</a>
      </div>
    {:else}
      {#each filteredPosts as post (post.id)}
        <div class="post-card" data-testid="blog-post-item">
          <div class="post-image">
            {#if post.featured_image}
              <img src={post.featured_image} alt={post.title} />
            {:else}
              <div class="placeholder-image">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            {/if}
          </div>

          <div class="post-content">
            <div class="post-header">
              <h3 class="post-title">{post.title}</h3>
              <span class="category-badge {getCategoryColor(post.tags[0] || '')}">
                {post.tags[0] || 'General'}
              </span>
            </div>

            <p class="post-excerpt">{post.excerpt}</p>

            <div class="post-meta">
              <div class="tags">
                {#each post.tags.slice(0, 3) as tag}
                  <span class="tag">{tag}</span>
                {/each}
                {#if post.tags.length > 3}
                  <span class="tag more">+{post.tags.length - 3} more</span>
                {/if}
              </div>
              <div class="meta-info">
                <span class="read-time">{post.reading_time} min read</span>
                <span class="post-date"
                  >{new Date(post.published_at || post.created_at).toLocaleDateString()}</span
                >
              </div>
            </div>

            <div class="post-actions">
              <a href="/blog/{post.slug}" class="btn btn-secondary" target="_blank">
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
                View
              </a>
              <a
                href="/admin/blog/{post.id}/edit"
                class="btn btn-secondary"
                data-testid="edit-blog-post-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </a>
              <button
                class="btn btn-danger"
                on:click={() => deletePost(post.id)}
                data-testid="delete-blog-post-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Results Count -->
  <div class="results-count">
    Showing {filteredPosts.length} of {postList.length} blog posts
  </div>
</div>

<style lang="scss">
  .blog-admin {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 1rem;

    .header-content {
      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: #64748b;
        margin: 0;
      }
    }
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-box {
    position: relative;
    flex: 1;
    min-width: 200px;

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: #9ca3af;
    }

    input {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
  }

  .filters {
    display: flex;
    gap: 0.5rem;

    select {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
  }

  .posts-list {
    display: grid;
    gap: 1.5rem;
  }

  .post-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  }

  .post-image {
    aspect-ratio: 16 / 10;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder-image {
      color: #94a3b8;

      svg {
        width: 3rem;
        height: 3rem;
      }
    }
  }

  .post-content {
    padding: 1.5rem 1.5rem 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
  }

  // Category colors using Tailwind-style classes
  :global(.bg-blue-100) {
    background-color: #dbeafe;
  }
  :global(.text-blue-800) {
    color: #1e40af;
  }
  :global(.bg-green-100) {
    background-color: #dcfce7;
  }
  :global(.text-green-800) {
    color: #166534;
  }
  :global(.bg-purple-100) {
    background-color: #f3e8ff;
  }
  :global(.text-purple-800) {
    color: #5b21b6;
  }
  :global(.bg-pink-100) {
    background-color: #fce7f3;
  }
  :global(.text-pink-800) {
    color: #9d174d;
  }
  :global(.bg-orange-100) {
    background-color: #fed7aa;
  }
  :global(.text-orange-800) {
    color: #9a3412;
  }
  :global(.bg-indigo-100) {
    background-color: #e0e7ff;
  }
  :global(.text-indigo-800) {
    color: #3730a3;
  }
  :global(.bg-gray-100) {
    background-color: #f3f4f6;
  }
  :global(.text-gray-800) {
    color: #1f2937;
  }

  .post-excerpt {
    color: #64748b;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag {
    background: #f1f5f9;
    color: #475569;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;

    &.more {
      background: #e2e8f0;
      color: #64748b;
    }
  }

  .meta-info {
    display: flex;
    gap: 1rem;
    align-items: center;
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .read-time::before {
    content: '📖 ';
  }

  .post-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #64748b;

    svg {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      color: #cbd5e1;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
    }

    p {
      margin: 0 0 1.5rem 0;
    }
  }

  .results-count {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 0.875rem;
    text-align: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    svg {
      width: 1rem;
      height: 1rem;
    }

    &.btn-primary {
      background: #3b82f6;
      color: white;

      &:hover {
        background: #2563eb;
      }
    }

    &.btn-secondary {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;

      &:hover {
        background: #f1f5f9;
      }
    }

    &.btn-danger {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;

      &:hover {
        background: #fee2e2;
      }
    }
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .controls {
      flex-direction: column;
    }

    .post-card {
      grid-template-columns: 1fr;
    }

    .post-image {
      height: 150px;
    }

    .post-content {
      padding: 1rem;
    }

    .post-actions {
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      justify-content: center;
    }

    .meta-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }
</style>
