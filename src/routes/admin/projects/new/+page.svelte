<script lang="ts">
  import { goto } from '$app/navigation';

  // Form state
  let formData = {
    title: '',
    slug: '',
    description: '',
    content: '',
    technologies: [] as string[],
    status: 'planning',
    featured: false,
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    startDate: '',
    completionDate: '',
    challenges: [] as string[],
    solutions: [] as string[],
    skillsDemonstrated: [] as string[],
    metaDescription: ''
  };

  // UI state
  let isLoading = false;
  let errors: { [key: string]: string } = {};
  let currentTech = '';

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

  // Add technology to the list
  function addTechnology() {
    if (currentTech?.trim() && !formData.technologies?.includes(currentTech.trim())) {
      formData.technologies = [...(formData.technologies || []), currentTech.trim()];
      currentTech = '';
    }
  }

  // Remove technology from the list
  function removeTechnology(tech: string) {
    formData.technologies = formData.technologies?.filter(t => t !== tech) || [];
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

    return Object.keys(errors).length === 0;
  }

  // URL validation helper
  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Generate slug from title
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Handle form submission
  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    isLoading = true;

    try {
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);

      // Prepare project data for database (map form fields to database schema)
      const projectData = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content || null,
        image_url: formData.imageUrl || null,
        technologies: formData.technologies,
        github_url: formData.githubUrl || null,
        demo_url: formData.demoUrl || null,
        repository_url: formData.githubUrl || null, // Use same as github_url for now
        status: formData.status,
        featured: formData.featured,
        start_date: formData.startDate || null,
        completion_date: formData.completionDate || null,
        challenges: formData.challenges.length > 0 ? formData.challenges : null,
        solutions: formData.solutions.length > 0 ? formData.solutions : null,
        skills_demonstrated:
          formData.skillsDemonstrated.length > 0 ? formData.skillsDemonstrated : null,
        meta_description: formData.metaDescription || null
      };

      // Create project via API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      // Show success message and redirect
      console.log('Project created successfully!');
      goto('/admin/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      errors.general = error.message || 'Failed to create project. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // Handle Enter key in input fields
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTechnology();
    }
  }
</script>

<svelte:head>
  <title>New Project - Admin</title>
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
      <h1>Create New Project</h1>
      <p>Add a new project to your portfolio</p>
    </div>
  </header>

  <form class="form-container" on:submit={handleSubmit} data-testid="project-form">
    {#if errors.general}
      <div class="error-message" data-testid="form-error">
        {errors.general}
      </div>
    {/if}

    <!-- Basic Information -->
    <section class="form-section">
      <h2>Basic Information</h2>

      <div class="form-group">
        <label for="title">Project Title *</label>
        <input
          id="title"
          name="title"
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
        <label for="description">Description *</label>
        <textarea
          id="description"
          name="description"
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

      <div class="form-group">
        <label for="slug">URL Slug</label>
        <input
          id="slug"
          name="slug"
          type="text"
          bind:value={formData.slug}
          placeholder="project-url-slug (auto-generated if empty)"
          data-testid="project-slug-input"
        />
        <span class="field-help"
          >Used in the project URL. Leave empty to auto-generate from title.</span
        >
      </div>
    </section>

    <!-- Project Details -->
    <section class="form-section">
      <h2>Project Details</h2>

      <div class="form-row">
        <div class="form-group">
          <label for="status">Status</label>
          <select
            id="status"
            name="status"
            bind:value={formData.status}
            data-testid="project-status-select"
          >
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
              name="featured"
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
          <label for="github-url">GitHub URL</label>
          <input
            id="github-url"
            name="githubUrl"
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
            name="liveUrl"
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

      <div class="form-group">
        <label for="image-url">Project Image URL</label>
        <input
          id="image-url"
          name="imageUrl"
          type="url"
          bind:value={formData.imageUrl}
          placeholder="https://..."
          data-testid="project-image-input"
        />
      </div>
    </section>

    <!-- Project Timeline -->
    <section class="form-section">
      <h2>Timeline</h2>

      <div class="form-row">
        <div class="form-group">
          <label for="start-date">Start Date</label>
          <input
            id="start-date"
            name="startDate"
            type="date"
            bind:value={formData.startDate}
            data-testid="project-start-date-input"
          />
        </div>

        <div class="form-group">
          <label for="completion-date">Completion Date</label>
          <input
            id="completion-date"
            name="completionDate"
            type="date"
            bind:value={formData.completionDate}
            data-testid="project-completion-date-input"
          />
          <span class="field-help">Leave empty if project is still in progress</span>
        </div>
      </div>
    </section>

    <!-- Technologies -->
    <section class="form-section">
      <h2>Technologies *</h2>

      <!-- Simple input for E2E tests -->
      <div class="form-group" style="position: absolute; left: -9999px; opacity: 0;">
        <input
          name="technologies"
          type="text"
          value={formData.technologies.join(', ')}
          readonly
          data-testid="technologies-input"
        />
      </div>

      <div class="form-group">
        <div class="tech-input-container">
          <input
            type="text"
            name="tech-input"
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

    <!-- Project Details -->
    <section class="form-section">
      <h2>Project Challenges & Solutions</h2>

      <div class="form-group">
        <h3>Challenges Faced</h3>
        <div class="dynamic-list">
          {#each formData.challenges as challenge, index}
            <div class="dynamic-item">
              <input
                type="text"
                bind:value={formData.challenges[index]}
                placeholder="Describe a challenge you faced..."
                data-testid="challenge-input"
              />
              <button
                type="button"
                class="btn btn-small btn-danger"
                on:click={() =>
                  (formData.challenges = formData.challenges.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          {/each}
          <button
            type="button"
            class="btn btn-small btn-secondary"
            on:click={() => (formData.challenges = [...(formData.challenges || []), ''])}
          >
            Add Challenge
          </button>
        </div>
      </div>

      <div class="form-group">
        <h3>Solutions Implemented</h3>
        <div class="dynamic-list">
          {#each formData.solutions as solution, index}
            <div class="dynamic-item">
              <input
                type="text"
                bind:value={formData.solutions[index]}
                placeholder="Describe how you solved it..."
                data-testid="solution-input"
              />
              <button
                type="button"
                class="btn btn-small btn-danger"
                on:click={() =>
                  (formData.solutions = formData.solutions.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          {/each}
          <button
            type="button"
            class="btn btn-small btn-secondary"
            on:click={() => (formData.solutions = [...(formData.solutions || []), ''])}
          >
            Add Solution
          </button>
        </div>
      </div>
    </section>

    <!-- Skills Demonstrated -->
    <section class="form-section">
      <h2>Skills Demonstrated</h2>

      <div class="form-group">
        <h3>Skills</h3>
        <div class="dynamic-list">
          {#each formData.skillsDemonstrated as skill, index}
            <div class="dynamic-item">
              <input
                type="text"
                bind:value={formData.skillsDemonstrated[index]}
                placeholder="e.g., Full-stack Development, API Design..."
                data-testid="skill-input"
              />
              <button
                type="button"
                class="btn btn-small btn-danger"
                on:click={() =>
                  (formData.skillsDemonstrated = formData.skillsDemonstrated.filter(
                    (_, i) => i !== index
                  ))}
              >
                Remove
              </button>
            </div>
          {/each}
          <button
            type="button"
            class="btn btn-small btn-secondary"
            on:click={() =>
              (formData.skillsDemonstrated = [...(formData.skillsDemonstrated || []), ''])}
          >
            Add Skill
          </button>
        </div>
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

      <div class="form-group">
        <label for="meta-description">Meta Description</label>
        <textarea
          id="meta-description"
          bind:value={formData.metaDescription}
          placeholder="Brief description for search engines and social media (150-160 characters recommended)"
          rows="3"
          data-testid="project-meta-description-input"
        ></textarea>
        <span class="field-help">Used for SEO and social media previews</span>
      </div>
    </section>

    <!-- Form Actions -->
    <section class="form-actions">
      <button type="button" class="btn btn-secondary" on:click={() => goto('/admin/projects')}>
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        disabled={isLoading}
        data-testid="submit-project"
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
          Creating Project...
        {:else}
          Create Project
        {/if}
      </button>
    </section>
  </form>
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

  label,
  h3 {
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

  .tech-input-container {
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
    gap: 1rem;
    justify-content: flex-end;

    @media (max-width: 768px) {
      flex-direction: column;
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
  }

  .dynamic-list {
    .dynamic-item {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;

      input {
        flex: 1;
      }

      .btn-small {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
      }

      .btn-danger {
        background: #ef4444;
        color: white;
        border: 1px solid #dc2626;

        &:hover {
          background: #dc2626;
        }
      }
    }
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
