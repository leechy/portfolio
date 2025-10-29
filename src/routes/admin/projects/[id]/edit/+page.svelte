<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data;

  // Get project ID from URL params
  $: projectId = $page.params.id;
  $: project = data.project;

  // Form state - initialize with server data
  let formData: {
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl: string;
    technologies: string[];
    githubUrl: string;
    demoUrl: string;
    repositoryUrl: string;
    status: string;
    featured: boolean;
    startDate: string;
    completionDate: string;
    challenges: string[];
    solutions: string[];
    skillsDemonstrated: string[];
    metaDescription: string;
  } = {
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    repositoryUrl: '',
    status: 'planning',
    featured: false,
    startDate: '',
    completionDate: '',
    challenges: [],
    solutions: [],
    skillsDemonstrated: [],
    metaDescription: ''
  };

  // UI state
  let isLoading = false;
  let errors: { [key: string]: string } = {};
  let currentTech = '';
  let currentChallenge = '';
  let currentSolution = '';
  let currentSkill = '';

  // Initialize form data when project loads
  $: if (project) {
    formData = {
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      content: project.content || '',
      imageUrl: project.imageUrl || project.image_url || '',
      technologies: project.technologies || [],
      githubUrl: project.githubUrl || project.github_url || '',
      demoUrl: project.demoUrl || project.demo_url || '',
      repositoryUrl: project.repository_url || '',
      status: project.status || 'planning',
      featured: project.featured || false,
      startDate: formatDateForInput(project.startDate || project.start_date),
      completionDate: formatDateForInput(project.completionDate || project.completion_date),
      challenges: project.challenges || [],
      solutions: project.solutions || [],
      skillsDemonstrated: project.skills_demonstrated || [],
      metaDescription: project.meta_description || ''
    };
  }

  // Available technologies for autocomplete
  const availableTechnologies = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Svelte',
    'SvelteKit',
    'Node.js',
    'Express',
    'FastAPI',
    'Django',
    'Flask',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'SCSS',
    'Bootstrap',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'SQLite',
    'Redis',
    'Docker',
    'AWS',
    'Vercel',
    'Netlify',
    'Firebase',
    'Git',
    'GitHub Actions',
    'Jest',
    'Cypress',
    'Playwright',
    'Webpack',
    'Vite',
    'Rollup',
    'ESLint',
    'Prettier'
  ];

  // Format Date object for date input
  function formatDateForInput(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date.split('T')[0];
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return '';
  }

  // Generate slug from title
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Auto-generate slug when title changes
  $: if (formData.title) {
    formData.slug = generateSlug(formData.title);
  }

  // Add technology to the list
  function addTechnology() {
    if (currentTech.trim() && !formData.technologies.includes(currentTech.trim())) {
      formData.technologies = [...formData.technologies, currentTech.trim()];
      currentTech = '';
    }
  }

  // Remove technology from the list
  function removeTechnology(tech: string) {
    formData.technologies = formData.technologies.filter(t => t !== tech);
  }

  // Challenge management
  function addChallenge() {
    if (currentChallenge.trim() && !formData.challenges.includes(currentChallenge.trim())) {
      formData.challenges = [...formData.challenges, currentChallenge.trim()];
      currentChallenge = '';
    }
  }

  function removeChallenge(challenge: string) {
    formData.challenges = formData.challenges.filter(c => c !== challenge);
  }

  // Solution management
  function addSolution() {
    if (currentSolution.trim() && !formData.solutions.includes(currentSolution.trim())) {
      formData.solutions = [...formData.solutions, currentSolution.trim()];
      currentSolution = '';
    }
  }

  function removeSolution(solution: string) {
    formData.solutions = formData.solutions.filter(s => s !== solution);
  }

  // Skills demonstrated management
  function addSkill() {
    if (currentSkill.trim() && !formData.skillsDemonstrated.includes(currentSkill.trim())) {
      formData.skillsDemonstrated = [...formData.skillsDemonstrated, currentSkill.trim()];
      currentSkill = '';
    }
  }

  function removeSkill(skill: string) {
    formData.skillsDemonstrated = formData.skillsDemonstrated.filter(s => s !== skill);
  }

  // Form validation
  function validateForm() {
    errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    }

    if (formData.technologies.length === 0) {
      errors.technologies = 'At least one technology is required';
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      errors.githubUrl = 'Please enter a valid GitHub URL';
    }

    if (formData.demoUrl && !isValidUrl(formData.demoUrl)) {
      errors.demoUrl = 'Please enter a valid demo URL';
    }

    if (formData.repositoryUrl && !isValidUrl(formData.repositoryUrl)) {
      errors.repositoryUrl = 'Please enter a valid repository URL';
    }

    return Object.keys(errors).length === 0;
  }

  // URL validation helper
  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Handle Enter key in input fields
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTechnology();
    }
  }

  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    isLoading = true;

    try {
      // Prepare project data for database (map form fields to database schema)
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content || null,
        image_url: formData.imageUrl || null,
        technologies: formData.technologies,
        github_url: formData.githubUrl || null,
        demo_url: formData.demoUrl || null,
        repository_url: formData.repositoryUrl || null,
        status: formData.status,
        featured: formData.featured,
        start_date: formData.startDate || null,
        completion_date: formData.completionDate || null,
        challenges: formData.challenges,
        solutions: formData.solutions,
        skills_demonstrated: formData.skillsDemonstrated,
        meta_description: formData.metaDescription || null
      };

      // Update project via API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      // Show success message and redirect
      console.log('Project updated successfully!');
      goto('/admin/projects');
    } catch (error: any) {
      console.error('Error updating project:', error);
      errors.general = error?.message || 'Failed to update project. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // Handle project deletion
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete project via API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      console.log('Project deleted successfully!');
      goto('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      console.error('Failed to delete project. Please try again.');
    }
  }
</script>

<svelte:head>
  <title>Edit Project - Admin</title>
</svelte:head>

<div class="project-form">
  <header class="form-header">
    <div class="header-content">
      <a href="/admin/projects" class="back-link">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Projects
      </a>

      <h1>Edit Project</h1>
      <p>Update your project details</p>
    </div>
  </header>

  {#if project}
    <form class="form-container" on:submit={handleSubmit}>
      {#if errors.general}
        <div class="error-message" data-testid="form-error">
          {errors.general}
        </div>
      {/if}

      <!-- Basic Information -->
      <section class="form-section">
        <h2>Basic Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="title">Project Title *</label>
            <input
              id="title"
              type="text"
              bind:value={formData.title}
              class:error={errors.title}
              placeholder="Enter project title"
              data-testid="project-title-input"
            />
            {#if errors.title}
              <span class="field-error">{errors.title}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="slug">URL Slug</label>
            <input
              id="slug"
              type="text"
              bind:value={formData.slug}
              class:error={errors.slug}
              placeholder="project-url-slug"
              data-testid="project-slug-input"
            />
            <span class="field-help">Used in the project URL. Auto-generated from title.</span>
            {#if errors.slug}
              <span class="field-error">{errors.slug}</span>
            {/if}
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            bind:value={formData.description}
            class:error={errors.description}
            placeholder="Describe your project..."
            rows="4"
            data-testid="project-description-input"
          ></textarea>
          {#if errors.description}
            <span class="field-error">{errors.description}</span>
          {/if}
        </div>
      </section>

      <!-- Project Details -->
      <section class="form-section">
        <h2>Project Details</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" bind:value={formData.status} data-testid="project-status-select">
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                bind:checked={formData.featured}
                data-testid="project-featured-checkbox"
              />
              Featured Project
            </label>
            <span class="field-help">Featured projects appear prominently on the homepage</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              bind:value={formData.startDate}
              data-testid="project-start-date-input"
            />
          </div>

          <div class="form-group">
            <label for="completion-date">Completion Date</label>
            <input
              id="completion-date"
              type="date"
              bind:value={formData.completionDate}
              data-testid="project-completion-date-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="github-url">GitHub URL</label>
            <input
              id="github-url"
              type="url"
              bind:value={formData.githubUrl}
              class:error={errors.githubUrl}
              placeholder="https://github.com/..."
              data-testid="project-github-input"
            />
            {#if errors.githubUrl}
              <span class="field-error">{errors.githubUrl}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="demo-url">Demo URL</label>
            <input
              id="demo-url"
              type="url"
              bind:value={formData.demoUrl}
              class:error={errors.demoUrl}
              placeholder="https://..."
              data-testid="project-demo-input"
            />
            {#if errors.demoUrl}
              <span class="field-error">{errors.demoUrl}</span>
            {/if}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="repository-url">Repository URL</label>
            <input
              id="repository-url"
              type="url"
              bind:value={formData.repositoryUrl}
              class:error={errors.repositoryUrl}
              placeholder="https://..."
              data-testid="project-repository-input"
            />
            {#if errors.repositoryUrl}
              <span class="field-error">{errors.repositoryUrl}</span>
            {/if}
          </div>

          <div class="form-group">
            <label for="image-url">Project Image URL</label>
            <input
              id="image-url"
              type="url"
              bind:value={formData.imageUrl}
              placeholder="https://..."
              data-testid="project-image-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="meta-description">Meta Description</label>
          <textarea
            id="meta-description"
            bind:value={formData.metaDescription}
            placeholder="SEO meta description for this project page (recommended: 150-160 characters)"
            rows="3"
            data-testid="project-meta-description-input"
          ></textarea>
          <span class="field-help">Used for SEO and social media sharing</span>
        </div>
      </section>

      <!-- Technologies -->
      <section class="form-section">
        <h2>Technologies *</h2>

        <div class="form-group">
          <div class="tech-input-container">
            <input
              type="text"
              bind:value={currentTech}
              placeholder="Add technology (e.g., React, Node.js)"
              list="tech-suggestions"
              on:keypress={handleKeyPress}
              data-testid="tech-input"
            />
            <button type="button" on:click={addTechnology} class="btn-add">Add</button>
          </div>

          <datalist id="tech-suggestions">
            {#each availableTechnologies as tech}
              <option value={tech}></option>
            {/each}
          </datalist>

          {#if formData.technologies.length > 0}
            <div class="tech-list">
              {#each formData.technologies as tech}
                <span class="tech-tag">
                  {tech}
                  <button type="button" on:click={() => removeTechnology(tech)}>×</button>
                </span>
              {/each}
            </div>
          {/if}

          {#if errors.technologies}
            <span class="field-error">{errors.technologies}</span>
          {/if}
        </div>
      </section>

      <!-- Content -->
      <section class="form-section">
        <h2>Project Content</h2>

        <div class="form-group">
          <label for="content">Detailed Description</label>
          <textarea
            id="content"
            bind:value={formData.content}
            placeholder="Write detailed project description, implementation details, etc. (Supports Markdown)"
            rows="10"
            data-testid="project-content-input"
          ></textarea>
          <span class="field-help">You can use Markdown formatting here</span>
        </div>
      </section>

      <!-- Challenges -->
      <section class="form-section">
        <h2>Challenges</h2>
        <p>What challenges did you face while working on this project?</p>

        <div class="form-group">
          <div class="list-input-container">
            <input
              type="text"
              bind:value={currentChallenge}
              placeholder="Describe a challenge you faced..."
              data-testid="challenge-input"
            />
            <button type="button" on:click={addChallenge} class="btn-add">Add</button>
          </div>

          {#if formData.challenges.length > 0}
            <div class="dynamic-list">
              {#each formData.challenges as challenge, index}
                <div class="dynamic-item">
                  <span>{challenge}</span>
                  <button
                    type="button"
                    on:click={() => removeChallenge(challenge)}
                    class="btn-small btn-danger"
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </section>

      <!-- Solutions -->
      <section class="form-section">
        <h2>Solutions</h2>
        <p>How did you solve the challenges mentioned above?</p>

        <div class="form-group">
          <div class="list-input-container">
            <input
              type="text"
              bind:value={currentSolution}
              placeholder="Describe how you solved a challenge..."
              data-testid="solution-input"
            />
            <button type="button" on:click={addSolution} class="btn-add">Add</button>
          </div>

          {#if formData.solutions.length > 0}
            <div class="dynamic-list">
              {#each formData.solutions as solution, index}
                <div class="dynamic-item">
                  <span>{solution}</span>
                  <button
                    type="button"
                    on:click={() => removeSolution(solution)}
                    class="btn-small btn-danger"
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </section>

      <!-- Skills Demonstrated -->
      <section class="form-section">
        <h2>Skills Demonstrated</h2>
        <p>What key skills were demonstrated in this project?</p>

        <div class="form-group">
          <div class="list-input-container">
            <input
              type="text"
              bind:value={currentSkill}
              placeholder="e.g., Problem Solving, API Integration..."
              data-testid="skill-input"
            />
            <button type="button" on:click={addSkill} class="btn-add">Add</button>
          </div>

          {#if formData.skillsDemonstrated.length > 0}
            <div class="dynamic-list">
              {#each formData.skillsDemonstrated as skill, index}
                <div class="dynamic-item">
                  <span>{skill}</span>
                  <button
                    type="button"
                    on:click={() => removeSkill(skill)}
                    class="btn-small btn-danger"
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </section>

      <!-- Form Actions -->
      <section class="form-actions">
        <div class="left-actions">
          <button
            type="button"
            class="btn btn-danger"
            on:click={handleDelete}
            data-testid="delete-project"
          >
            Delete Project
          </button>
        </div>

        <div class="right-actions">
          <button type="button" class="btn btn-secondary" on:click={() => goto('/admin/projects')}>
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            disabled={isLoading}
            data-testid="update-project"
          >
            {#if isLoading}
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
              Updating Project...
            {:else}
              Update Project
            {/if}
          </button>
        </div>
      </section>
    </form>
  {:else}
    <div class="error-message">Project not found or failed to load.</div>
  {/if}
</div>

<style lang="scss">
  .project-form {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .form-header {
    margin-bottom: 2rem;

    .header-content {
      h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin: 1rem 0 0.5rem 0;
      }

      p {
        color: #64748b;
        margin: 0 0 1rem 0;
      }
    }
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;

    &:hover {
      color: #3b82f6;
    }

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  .form-container {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .form-section {
    padding: 2rem;
    border-bottom: 1px solid #f1f5f9;

    &:last-of-type {
      border-bottom: none;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
    cursor: pointer;
  }

  input,
  select,
  textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  input,
  textarea {
    &.error {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .field-error {
    color: #dc2626;
    font-size: 0.75rem;
  }

  .field-help {
    color: #6b7280;
    font-size: 0.75rem;
  }

  .error-message {
    background: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #fecaca;
    margin-bottom: 2rem;
  }

  .tech-input-container,
  .list-input-container {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
    }
  }

  .btn-add {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #2563eb;
    }
  }

  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .tech-tag {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    button {
      background: none;
      border: none;
      color: #1d4ed8;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0;
      width: 1rem;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .form-actions {
    background: #f8fafc;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }

    .left-actions,
    .right-actions {
      display: flex;
      gap: 1rem;

      @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
      }
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &.btn-primary {
      background: #3b82f6;
      color: white;

      &:hover:not(:disabled) {
        background: #2563eb;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    &.btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;

      &:hover {
        background: #f9fafb;
      }
    }

    &.btn-danger {
      background: #ef4444;
      color: white;

      &:hover {
        background: #dc2626;
      }
    }
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }

  .dynamic-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .dynamic-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;

    span {
      flex: 1;
      color: #374151;
    }
  }

  .btn-small {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background 0.2s;

    &.btn-danger {
      background: #ef4444;
      color: white;

      &:hover {
        background: #dc2626;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
