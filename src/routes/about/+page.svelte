<script lang="ts">
  import { onMount } from 'svelte';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

  // Sample data - you can update this with your actual information
  const personalInfo = {
    name: 'Andrey Lechev',
    title: 'Software Architect, Developer, and Team Lead',
    location: 'Olm, Luxembourg',
    email: 'andrey@lechev.me',
    bio: "I'm a passionate full-stack developer with over 25 years of experience creating innovative web applications and software solutions. I specialize in modern JavaScript frameworks, backend development, and building scalable systems that deliver exceptional user experiences.",
    skills: [
      'TypeScript/JavaScript',
      'React/Angular/Svelte',
      'Node.js',
      'Nest.js/Express/Koa',
      'SQL/NoSQL Databases',
      'UI/UX Design',
      'Agile Development',
      'CI/CD Pipelines',
      'GCP/AWS',
      'Python/Django',
      'PHP/WordPress',
      'Team Lead and Mentoring'
    ]
  };

  const workExperience = [
    {
      id: 1,
      position: 'Senior Software Developer — Frontend',
      company: 'Byborg',
      duration: '2025',
      location: 'Luxembourg',
      description: `
* Contributed to the JasminCam project, a streaming application built with React, TypeScript, Redux Saga, WebRTC, and WebSockets.
* Refactored significant portions of the legacy JavaScript codebase to TypeScript, enhancing code quality and maintainability.
* Implemented new features and resolved bugs while ensuring a consistent user experience by collaborating with the design team.
* Managed the deployment process and synchronised releases across different divisions of the LiveJasmin project.
      `,
      technologies: ['React', 'Redux Saga', 'TypeScript', 'WebRTC', 'WebSockets'],
      projects: [
        {
          name: 'JasminCam',
          description: 'A live streaming platform for adult content creators and viewers.',
          link: 'https://cam.jasmin.com'
        }
      ]
    },
    {
      id: 2,
      position: 'Senior Developer and Application Architect',
      company: 'Reborn / Movify',
      duration: '2018 – 2025',
      location: 'Luxembourg',
      description:
        'Developed responsive web applications and e-commerce platforms. Collaborated with design teams to create pixel-perfect user interfaces.',
      technologies: ['Vue.js', 'JavaScript', 'SCSS', 'WordPress', 'PHP'],
      projects: [
        {
          name: 'KanbanTool',
          description:
            'Internal staffing system based on Bullhorn CRM, build with React.js, Redux Saga, and Firebase.',
          link: 'https://movify-kanban.web.app'
        },
        {
          name: 'Echo.lu',
          description:
            'Culture Events Portal for Luxembourg. Developed entire platform with Stencil.js, and Firebase.',
          link: 'https://echo.lu'
        },
        {
          name: 'i-Hub',
          description:
            'KYC/AML platform for financial institutions in Luxembourg. Developed a white-label client application using Angular and Java Spring Boot on the backend.',
          link: 'https://www.i-hub.com'
        },
        {
          name: 'Alken Fund',
          description:
            'Website for Alken Asset Management, a Luxembourg-based investment fund manager. Built with Next.js and Strapi.',
          link: 'https://www.alken-fund.com'
        },
        {
          name: 'Inreg Portal',
          description:
            'Market analysis and advisory platform for investors. Now owned by Acolin. Vue.js and Firebase backend.',
          link: 'https://portal.inreg.eu'
        }
      ]
    },
    {
      id: 3,
      position: 'Head of the Frontend Development',
      company: 'Innova Co.',
      duration: '2011 – 2017',
      location: 'Moscow / Luxembourg',
      description: `* Led a team of up to 9 frontend developers on 4Game Platform and Ayyo Movies' Web and Smart TV App.
* Developed a component-based architecture using PHP's Twig templates and Backbone.js — an SSR with client-side hydration - [Chercitecture](https://github.com/InnovaCo/che).
* 
`,
      technologies: [
        'HTML',
        'CSS / LESS',
        'CoffeeScript',
        'Backbone.js',
        'PHP',
        'Twig',
        'Chercitecture',
        'React'
      ],
      projects: [
        {
          name: '4game.com',
          description: 'Multiple responsive websites for small businesses',
          link: '#'
        },
        {
          name: 'AYYO',
          description: 'Smart TV video streaming application.',
          link: '#'
        }
      ]
    },
    {
      id: 4,
      position: 'Technical Director',
      company: 'Art Lebedev Studio',
      duration: '2008 – 2011',
      location: 'Moscow'
    },
    {
      id: 5,
      position: 'SERP Interface Manager',
      company: 'Yandex',
      duration: '2006 – 2008',
      location: 'Moscow'
    },
    {
      id: 6,
      position: 'Senior Fullstack Developer',
      company: 'Inquatrum',
      duration: '2006',
      location: 'Moscow'
    },
    {
      id: 7,
      position: 'Fullstack Developer',
      company: 'Art Lebedev Studio',
      duration: '1999 – 2006',
      location: 'Moscow'
    }
  ];

  let activeExperience: number | null = null;

  function toggleExperience(id: number) {
    activeExperience = activeExperience === id ? null : id;
  }

  onMount(() => {
    // Add scroll animations or other interactive features here
  });
</script>

<svelte:head>
  <title>About - {personalInfo.name}</title>
  <meta
    name="description"
    content="Learn more about {personalInfo.name}, a passionate full-stack developer with expertise in modern web technologies."
  />
</svelte:head>

<main class="about-page">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1>{personalInfo.name}</h1>
          <h2>{personalInfo.title}</h2>
          <p class="location">{personalInfo.location}</p>
          <p class="bio">{personalInfo.bio}</p>
          <a href="mailto:{personalInfo.email}" class="contact-btn">Get in Touch</a>
        </div>
        <div class="hero-image">
          <div class="profile-placeholder">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="35" r="12" />
              <path d="M25 75 C25 65, 35 55, 50 55 C65 55, 75 65, 75 75 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Skills Section -->
  <section class="skills-section">
    <div class="container">
      <h2>Technical Skills</h2>
      <div class="skills-grid">
        {#each personalInfo.skills as skill}
          <div class="skill-tag">{skill}</div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Experience Timeline -->
  <section class="experience-section">
    <div class="container">
      <h2>Professional Experience</h2>
      <div class="timeline">
        {#each workExperience as experience}
          <div class="timeline-item" class:active={activeExperience === experience.id}>
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div
                class="experience-header"
                on:click={() => toggleExperience(experience.id)}
                on:keydown={e => e.key === 'Enter' && toggleExperience(experience.id)}
                tabindex="0"
                role="button"
                aria-expanded={activeExperience === experience.id}
              >
                <div class="experience-main">
                  <h3>{experience.position}</h3>
                  <h4>{experience.company}</h4>
                  <p class="duration">{experience.duration} • {experience.location}</p>
                </div>
                <div class="expand-icon" class:rotated={activeExperience === experience.id}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </div>

              {#if activeExperience === experience.id}
                <div class="experience-details">
                  <MarkdownRenderer content={experience.description} />

                  <div class="technologies">
                    <h5>Technologies Used:</h5>
                    <div class="tech-tags">
                      {#each experience.technologies as tech}
                        <span class="tech-tag">{tech}</span>
                      {/each}
                    </div>
                  </div>

                  {#if (experience.projects?.length || 0) > 0}
                    <div class="projects">
                      <h5>
                        {#if (experience.projects?.length || 0) === 1}
                          Project:
                        {:else}
                          Key Projects:
                        {/if}
                      </h5>
                      {#each experience.projects as project}
                        <div class="project-item">
                          <div class="project-info">
                            <strong>{project.name}</strong>
                            <p>{project.description}</p>
                          </div>
                          {#if project.link !== '#'}
                            <a
                              href={project.link}
                              class="project-link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {project.link.replace(/^https?:\/\//, '')}
                            </a>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="cta-section">
    <div class="container">
      <h2>Let's Work Together</h2>
      <p>
        I'm always interested in new opportunities and exciting projects. Let's discuss how we can
        bring your ideas to life.
      </p>
      <div class="cta-buttons">
        <a href="mailto:{personalInfo.email}" class="btn-primary">Contact Me</a>
        <a href="/projects" class="btn-secondary">View My Work</a>
      </div>
    </div>
  </section>
</main>

<style lang="scss">
  .about-page {
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  // Hero Section
  .hero-section {
    padding: 4rem 0;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary), transparent 80%) 0%,
      color-mix(in srgb, var(--color-secondary), transparent 80%) 100%
    );
  }

  .hero-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: center;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }
  }

  .hero-text {
    h1 {
      font-size: var(--font-size-5xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);

      @media (max-width: $breakpoint-md) {
        font-size: var(--font-size-4xl);
      }
    }

    h2 {
      font-size: 1.5rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
    }

    .location {
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
      font-size: 1.1rem;
    }

    .bio {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--color-text-primary);
      margin-bottom: 2rem;
    }

    .contact-btn {
      display: inline-block;
      background: var(--color-primary);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: color-mix(in srgb, var(--color-primary), black 20%);
        transform: translateY(-2px);
      }
    }
  }

  .hero-image {
    display: flex;
    justify-content: center;
  }

  .profile-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;

    svg {
      width: 80px;
      height: 80px;
    }
  }

  // Skills Section
  .skills-section {
    padding: 4rem 0;
    background: var(--color-bg-secondary);

    h2 {
      margin-bottom: var(--spacing-2xl);
      font-size: var(--font-size-4xl);
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
    max-width: 1024px;
    margin: 0;
  }

  .skill-tag {
    color: var(--color-text-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
  }

  // Experience Section
  .experience-section {
    padding: 4rem 0;

    h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: var(--color-text-primary);
    }
  }

  .timeline {
    position: relative;
    max-width: 900px;
    margin: 0 auto;

    &::before {
      content: '';
      position: absolute;
      left: 30px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));

      @media (max-width: $breakpoint-md) {
        left: 15px;
      }
    }
  }

  .timeline-item {
    position: relative;
    margin-bottom: 2rem;
    padding-left: 4rem;

    @media (max-width: $breakpoint-md) {
      padding-left: 2.5rem;
    }
  }

  .timeline-marker {
    position: absolute;
    left: -4px;
    top: 0;
    width: 12px;
    height: 12px;
    background: var(--color-primary);
    border-radius: 50%;
    border: 3px solid var(--color-bg-primary);

    @media (max-width: $breakpoint-md) {
      left: -11px;
    }
  }

  .timeline-content {
    background: var(--color-bg-primary);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .active & {
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
    }
  }

  .experience-header {
    padding: var(--spacing-lg);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;

    &:hover {
      background: color-mix(in srgb, var(--color-primary), transparent 90%);
    }
  }

  .experience-main {
    h3 {
      font-size: 1.3rem;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    h4 {
      font-size: 1.1rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
    }

    .duration {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  }

  .expand-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
    color: var(--color-primary);

    &.rotated {
      transform: rotate(180deg);
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .experience-details {
    padding: 0 var(--spacing-lg) var(--spacing-md);
    animation: slideDown 0.3s ease;

    .description {
      margin: var(--spacing-md) 0;
      line-height: 1.6;
      color: var(--color-text-primary);
    }

    h5 {
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .technologies {
      margin-bottom: 1.5rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-tag {
      background: color-mix(in srgb, var(--color-tertiary), transparent 85%);
      color: var(--color-tertiary);
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .projects {
      .project-item {
        display: flex;
        justify-content: space-between;
        gap: var(--spacing-xl);
        align-items: center;
        padding: var(--spacing-md);
        background: color-mix(in srgb, var(--color-primary), transparent 95%);
        border-radius: 8px;
        margin-bottom: 1rem;

        @media (max-width: $breakpoint-md) {
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .project-info {
          flex: 1;

          strong {
            color: var(--color-text-primary);
            display: block;
            margin-bottom: 0.5rem;
          }

          p {
            color: var(--color-text-secondary);
            margin: 0;
            line-height: 1.5;
          }
        }

        .project-link {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-primary);
          border-radius: 6px;
          transition: all 0.3s ease;

          &:hover {
            background: var(--color-primary);
            color: white;
          }
        }
      }
    }
  }

  // CTA Section
  .cta-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        align-items: center;
      }
    }

    .btn-primary,
    .btn-secondary {
      display: inline-block;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: white;
      color: var(--color-primary);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
      }
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;

      &:hover {
        background: white;
        color: var(--color-primary);
        transform: translateY(-2px);
      }
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
