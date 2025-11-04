<script lang="ts">
  import type { Project } from '$lib/server/database.js';
  import type { PageData } from './$types';

  export let data: PageData;

  // Extract data from server-side load
  $: project = data.project;
  $: relatedProjects = data.relatedProjects;

  function navigateToProject(projectId: string | number) {
    window.location.href = `/projects/${projectId}`;
  }

  function navigateBack() {
    window.location.href = '/projects';
  }
</script>

<svelte:head>
  <title>{data.meta?.title || 'Project Not Found'}</title>
  <meta name="description" content={data.meta?.description || 'Project details not available'} />
</svelte:head>

{#if project}
  <article class="project-detail">
    <div class="container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb" data-testid="breadcrumb-nav">
        <button
          type="button"
          on:click={navigateBack}
          class="back-link back-button"
          data-testid="back-to-projects"
        >
          ← Back to Projects
        </button>
      </nav>

      <!-- Project Header -->
      <header class="project-header">
        <h1 class="project-title" data-testid="project-detail-title">{project.title}</h1>
        <div class="project-meta">
          <span class="project-status status-{project.status}" data-testid="project-status">
            {project.status}
          </span>
          {#if project.featured}
            <span class="featured-badge">Featured Project</span>
          {/if}
        </div>
        <p class="project-description" data-testid="project-description">{project.description}</p>
      </header>

      <!-- Project Links -->
      <section class="project-links" data-testid="project-links">
        <div class="links-container">
          {#if project.demoUrl}
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="project-link demo-link"
              data-testid="demo-link"
            >
              🚀 View Live Demo
            </a>
          {/if}
          {#if project.githubUrl}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="project-link github-link"
              data-testid="github-link"
            >
              ⚡ View Source Code
            </a>
          {/if}
        </div>
      </section>

      <div class="project-content-grid">
        <!-- Main Content -->
        <main class="project-main-content">
          <!-- Technologies Used -->
          <section class="technologies-section" data-testid="project-technologies">
            <h2>Technologies Used</h2>
            <div class="tech-grid">
              {#each project.technologies as tech}
                <span class="tech-tag" data-testid="tech-tag">{tech}</span>
              {/each}
            </div>
          </section>

          <!-- Project Content -->
          {#if project.content}
            <section class="content-section">
              <h2>Project Overview</h2>
              <div class="content-text">
                {@html project.content.replace(/\n/g, '<br>')}
              </div>
            </section>
          {/if}

          <!-- Skills Demonstrated -->
          {#if project.skillsDemonstrated}
            <section class="skills-section" data-testid="skills-demonstrated">
              <h2>Skills Demonstrated</h2>
              <div class="skills-grid">
                {#each project.skillsDemonstrated as skill}
                  <span class="skill-tag" data-testid="skill-tag">{skill}</span>
                {/each}
              </div>
            </section>
          {/if}
        </main>

        <!-- Sidebar -->
        <aside class="project-sidebar">
          <!-- Project Timeline -->
          {#if project.startDate || project.completionDate}
            <section class="timeline-section">
              <h3>Project Timeline</h3>
              <div class="timeline-info">
                {#if project.startDate}
                  <div class="timeline-item">
                    <strong>Started:</strong>
                    <time>{project.startDate.toLocaleDateString()}</time>
                  </div>
                {/if}
                {#if project.completionDate}
                  <div class="timeline-item">
                    <strong>Completed:</strong>
                    <time>{project.completionDate.toLocaleDateString()}</time>
                  </div>
                {/if}
              </div>
            </section>
          {/if}

          <!-- Related Projects -->
          {#if relatedProjects.length > 0}
            <section class="related-section" data-testid="related-projects">
              <h3>Related Projects</h3>
              <div class="related-projects">
                {#each relatedProjects as relatedProject}
                  <article class="related-project-card" data-testid="related-project-card">
                    <button
                      type="button"
                      on:click={() => navigateToProject(relatedProject.id)}
                      class="related-project-button"
                    >
                      <h4>{relatedProject.title}</h4>
                      <p>{relatedProject.description}</p>
                      <div class="related-tech">
                        {#each relatedProject.technologies.slice(0, 3) as tech}
                          <span class="mini-tech-tag">{tech}</span>
                        {/each}
                      </div>
                    </button>
                  </article>
                {/each}
              </div>
            </section>
          {/if}
        </aside>
      </div>
    </div>
  </article>
{/if}

<style lang="scss">
  .project-detail {
    min-height: 100vh;
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .breadcrumb {
    margin-bottom: 2rem;

    .back-link,
    .back-button {
      background: transparent;
      border: none;
      color: var(--color-primary);
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
      padding: 0.5rem 0;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;

      &:hover {
        color: color-mix(in srgb, var(--color-primary), transparent 50%);
      }
    }
  }

  .project-header {
    margin-bottom: 3rem;

    .project-title {
      font-size: 3rem;
      color: var(--color-primary);
      margin-bottom: 1rem;
      line-height: 1.2;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .project-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;

      .project-status {
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.9rem;
        font-weight: 500;
        text-transform: capitalize;

        &.status-completed {
          background: rgba(34, 197, 94, 0.1);
          color: rgb(34, 197, 94);
        }

        &.status-development {
          background: rgba(251, 191, 36, 0.1);
          color: rgb(251, 191, 36);
        }

        &.status-planning {
          background: rgba(168, 85, 247, 0.1);
          color: rgb(168, 85, 247);
        }
      }

      .featured-badge {
        padding: 0.5rem 1rem;
        background: rgba(59, 130, 246, 0.1);
        color: var(--color-primary);
        border-radius: 2rem;
        font-size: 0.9rem;
        font-weight: 500;
      }
    }

    .project-description {
      font-size: 1.2rem;
      line-height: 1.6;
      color: var(--color-text-secondary);
    }
  }

  .project-links {
    margin-bottom: 3rem;

    .links-container {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .project-link {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;

      &.demo-link {
        background: var(--color-primary);
        color: white;

        &:hover {
          background: color-mix(in srgb, var(--color-primary), transparent 50%);
          transform: translateY(-2px);
        }
      }

      &.github-link {
        background: transparent;
        color: var(--color-text-primary);
        border: 2px solid var(--color-border);

        &:hover {
          background: var(--color-bg-secondary);
          border-color: var(--color-primary);
        }
      }
    }
  }

  .project-content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .project-main-content {
    section {
      margin-bottom: 3rem;

      h2 {
        font-size: 1.8rem;
        color: var(--color-primary);
        margin-bottom: 1.5rem;
        border-bottom: 2px solid var(--color-border);
        padding-bottom: 0.5rem;
      }
    }
  }

  .technologies-section {
    .tech-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .tech-tag {
      padding: 0.5rem 1rem;
      background: rgba(59, 130, 246, 0.1);
      color: var(--color-primary);
      border-radius: 2rem;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
  }

  .content-section {
    .content-text {
      line-height: 1.8;
      color: var(--color-text-primary);
      font-size: 1.1rem;

      :global(h1),
      :global(h2),
      :global(h3) {
        color: var(--color-primary);
        margin-top: 2rem;
        margin-bottom: 1rem;
      }

      :global(p) {
        margin-bottom: 1rem;
      }
    }
  }

  .skills-section {
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .skill-tag {
      padding: 0.5rem 1rem;
      background: rgba(168, 85, 247, 0.1);
      color: rgb(168, 85, 247);
      border-radius: 2rem;
      font-weight: 500;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }
  }

  .project-sidebar {
    section {
      background: var(--color-bg-secondary);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      margin-bottom: 2rem;

      h3 {
        color: var(--color-primary);
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }
    }
  }

  .timeline-section {
    .timeline-info {
      .timeline-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border);

        &:last-child {
          border-bottom: none;
        }

        strong {
          color: var(--color-text-primary);
        }

        time {
          color: var(--color-text-secondary);
        }
      }
    }
  }

  .related-section {
    .related-projects {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .related-project-card {
      .related-project-button {
        width: 100%;
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--color-primary);
          background: var(--color-bg-secondary);
        }

        h4 {
          color: var(--color-primary);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        p {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .related-tech {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;

          .mini-tech-tag {
            padding: 0.25rem 0.5rem;
            background: rgba(59, 130, 246, 0.1);
            color: var(--color-primary);
            border-radius: 1rem;
            font-size: 0.7rem;
          }
        }
      }
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
