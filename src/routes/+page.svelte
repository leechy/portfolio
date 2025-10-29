<script lang="ts">
  import { onMount } from 'svelte';
  import { skillsStore, loadSkills } from '$lib/stores/skills';
  import { projectsStore, loadProjects } from '$lib/stores/projects';

  let mounted = $state(false);

  // Reactive data from stores
  const skills = $derived($skillsStore);
  const projects = $derived($projectsStore);

  onMount(async () => {
    mounted = true;

    // Load data from stores
    await Promise.all([loadSkills(), loadProjects()]);
  });
</script>

<svelte:head>
  <title>Andrey Lechev • Leechy</title>
  <meta
    name="description"
    content="Portfolio of a passionate developer building innovative web solutions with modern technologies."
  />
</svelte:head>

<div class="homepage">
  <!-- Hero Section -->
  <section class="hero" data-testid="hero-section">
    <div class="container">
      <div class="hero-content" class:animate={mounted}>
        <h1 class="hero-title">
          <span class="name-highlight">Leechy</span>

          <!--
          will update the shape of your buttons for free.
          can create for you a cohesive design system.
          creates a mobile MVP in record time.
          -->
        </h1>
        <p class="hero-subtitle">
          For more than 25 years, I've been crafting experiences that bring joy and solve users'
          problems.
        </p>
        <p class="hero-description">
          And I've tried many times to start writing about the stuff I do. This time, I have no
          other option but to just start writing.
        </p>
        <div class="hero-actions">
          <a href="/projects" class="btn btn-primary">View My Work</a>
          <a href="/contact" class="btn btn-secondary">Get In Touch</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Skills Section -->
  <section class="skills-section" data-testid="skills-section">
    <div class="container">
      <h2>Skills & Technologies</h2>

      {#if skills.loading}
        <div class="loading-state">Loading skills...</div>
      {:else if skills.error}
        <div class="error-state" data-testid="error-message">Error: {skills.error}</div>
      {:else}
        {#each skills.categories as category}
          <div
            class="skill-category"
            data-testid="skill-category"
            data-category={category.name === 'Frontend Development'
              ? 'frontend'
              : category.name === 'Backend Development'
                ? 'backend'
                : 'tool'}
          >
            <h3>
              {#if category.icon}<span class="category-icon">{category.icon}</span>{/if}
              {category.name}
            </h3>
            <div class="skills-grid">
              {#each category.skills as skill}
                <div class="skill-card" data-testid="skill-card">
                  <div class="skill-name" data-testid="skill-name">{skill.name}</div>
                  <div
                    class="skill-proficiency"
                    data-testid="skill-proficiency"
                    data-level={skill.proficiency === 'Expert'
                      ? 5
                      : skill.proficiency === 'Advanced'
                        ? 4
                        : skill.proficiency === 'Intermediate'
                          ? 3
                          : skill.proficiency === 'Beginner'
                            ? 2
                            : 1}
                  >
                    {skill.proficiency}
                  </div>
                  {#if skill.description}
                    <div class="skill-description">{skill.description}</div>
                  {/if}
                  {#if skill.yearsExperience}
                    <div class="skill-experience">{skill.yearsExperience} years</div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </section>
  <!-- Featured Projects Section -->
  <section class="featured-projects projects-section" data-testid="projects-section">
    <div class="container">
      <h2>Featured Projects</h2>

      {#if projects.loading}
        <div class="loading-state">Loading projects...</div>
      {:else if projects.error}
        <div class="error-state" data-testid="error-message">Error: {projects.error}</div>
      {:else}
        <div class="projects-grid">
          {#each projects.featured as project}
            <article class="project-card" data-testid="project-card">
              <div
                class="project-card-content"
                onclick={() => (window.location.href = `/projects/${project.id}`)}
                role="button"
                tabindex="0"
                onkeydown={e =>
                  e.key === 'Enter' && (window.location.href = `/projects/${project.id}`)}
                data-testid="project-card-content"
              >
                <h3 class="project-title" data-testid="project-title">{project.title}</h3>
                <p class="project-description" data-testid="project-description">
                  {project.description}
                </p>
                <div class="project-technologies" data-testid="project-technologies">
                  {#each project.technologies as tech}
                    <span class="tech-tag">{tech}</span>
                  {/each}
                </div>
                <div class="project-links">
                  {#if project.demoUrl}
                    <a
                      href={project.demoUrl}
                      class="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick={e => e.stopPropagation()}
                    >
                      View Demo
                    </a>
                  {/if}
                  {#if project.githubUrl}
                    <a
                      href={project.githubUrl}
                      class="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick={e => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                  {/if}
                  <a href="/projects/{project.id}" class="project-link project-detail-link">
                    View Details
                  </a>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>

<style>
  .homepage {
    min-height: 80vh;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary), transparent 70%) 0%,
      transparent 50%,
      color-mix(in srgb, var(--color-tertiary), transparent 90%) 100%
    );
  }

  .hero {
    padding: var(--spacing-3xl) 0;
  }

  .hero-content {
    max-width: 600px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
  }

  .hero-content.animate {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-title {
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.1;
  }

  .name-highlight {
    color: var(--color-secondary);
    position: relative;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--color-primary-soft);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .hero-description {
    font-size: 1.125rem;
    color: var(--color-primary-soft);
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .hero-actions {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  /* Skills Section */
  .skills-section {
    padding: var(--spacing-xl) 0;
  }

  .skills-section h2 {
    margin-bottom: var(--spacing-lg);
    color: var(--color-text-primary);
    font-size: 2rem;
  }

  .skill-category {
    margin-bottom: var(--spacing-lg);
  }

  .skill-category h3 {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .skill-card {
    background: var(--color-bg-secondary);
    padding: var(--spacing-md);
    border-radius: 8px;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--color-secondary), transparent 90%);
    transition:
      transform 0.4s ease,
      box-shadow 0.8s ease;
  }

  .skill-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 2px 16px color-mix(in srgb, var(--color-secondary), transparent 60%);
  }

  .skill-name {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  .skill-proficiency {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    background: color-mix(in srgb, var(--color-primary), transparent 80%);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: 4px;
    display: inline-block;
    margin: 0 0.5rem var(--spacing-sm) calc(var(--spacing-sm) * -1);
  }

  /* Featured Projects Section */
  .featured-projects {
    padding: var(--spacing-xl) 0;
  }

  .featured-projects h2 {
    margin-bottom: var(--spacing-lg);
    color: var(--color-text-primary);
    font-size: 2rem;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-lg);
  }

  .project-card {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 8px -1px color-mix(in srgb, var(--color-secondary), transparent 90%);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 16px color-mix(in srgb, var(--color-secondary), transparent 60%);
  }

  .project-card-content {
    padding: var(--spacing-lg);
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-card-content:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .project-title {
    color: var(--color-primary);
    font-size: 1.25rem;
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
  }

  .project-description {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }

  .project-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .tech-tag {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Loading and Error States */
  .loading-state,
  .error-state {
    text-align: center;
    padding: var(--spacing-lg);
    border-radius: 8px;
    margin: var(--spacing-md) 0;
  }

  .loading-state {
    background: rgba(59, 130, 246, 0.1);
    color: var(--color-primary);
    font-style: italic;
  }

  .error-state {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  /* Enhanced Skill Cards */
  .category-icon {
    margin-right: var(--spacing-sm);
    font-size: 1.2rem;
  }

  .skill-description {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-top: var(--spacing-xs);
    line-height: 1.4;
  }

  .skill-experience {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin-top: var(--spacing-xs);
    font-style: italic;
  }

  /* Project Links */
  .project-links {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
    flex-wrap: wrap;
  }

  .project-link {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .project-link:hover {
    background: color-mix(in srgb, var(--color-primary-dark), black 10%);
    transform: translateY(-1px);
  }

  .project-detail-link {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }

  .project-detail-link:hover {
    background: var(--color-primary);
    color: white;
  }
</style>
