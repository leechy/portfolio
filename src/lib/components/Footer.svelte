<script lang="ts">
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/leechy',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/leechy',
      icon: 'linkedin'
    },
    {
      name: 'Twitter (X)',
      url: 'https://x.com/andreykalechev',
      icon: 'twitter'
    }
  ];

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Projects',
      links: [
        { label: 'Featured Work', href: '/projects?featured=true' },
        { label: 'Open Source', href: '/projects?type=opensource' },
        { label: 'Web Development', href: '/projects?category=web' },
        { label: 'All Projects', href: '/projects' }
      ]
    }
  ];
</script>

<div class="footer">
  <div class="container">
    <div class="footer-content">
      <!-- Brand and Description -->
      <div class="footer-brand">
        <h3 class="footer-logo">
          <span class="logo-text">Andrey Lechev</span>
        </h3>
        <p class="footer-description">
          Full-stack developer who loves building beautiful, high-quality, and user-friendly web and
          mobile (and desktop?) applications.
        </p>

        <!-- Social Links -->
        <div class="social-links">
          {#each socialLinks as social}
            <a
              href={social.url}
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <img src="/images/{social.icon}.svg" alt={social.name} class="social-icon" />
              <span class="social-name">{social.name}</span>
            </a>
          {/each}
        </div>
      </div>

      <!-- Footer Navigation -->
      <div class="footer-nav">
        {#each footerLinks as section}
          <div class="nav-section">
            <h4 class="nav-title">{section.title}</h4>
            <ul class="nav-list">
              {#each section.links as link}
                <li>
                  <a href={link.href} class="nav-link">{link.label}</a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">
          © {currentYear} Leechy. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <a href="/privacy" class="bottom-link">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .footer {
    padding: var(--spacing-3xl) 0 var(--spacing-xl);
  }

  .footer-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1.5fr 1fr;
      gap: var(--spacing-3xl);
    }
  }

  .footer-brand {
    .footer-logo {
      font-size: var(--font-size-2xl);
      font-weight: 600;
      margin-bottom: var(--spacing-md);
      color: var(--color-text-primary);

      .logo-accent {
        color: var(--color-primary);
      }
    }

    .footer-description {
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: var(--spacing-xl);
      max-width: 400px;
    }
  }

  .social-links {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: var(--spacing-sm);
    border-radius: 6px;
    transition: all var(--transition-fast);

    &:hover {
      color: var(--color-primary);
      background-color: color-mix(in srgb, var(--color-primary), transparent 80%);
    }

    .social-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      fill: var(--color-text-secondary);
    }

    .social-name {
      font-size: var(--font-size-sm);
      font-weight: 500;
    }
  }

  .footer-nav {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);

    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .nav-section {
    .nav-title {
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-bottom: var(--spacing-md);
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      display: inline-block;
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: var(--spacing-xs) 0;
      font-size: var(--font-size-sm);
      transition: color var(--transition-fast);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .footer-bottom {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
  }

  .footer-bottom-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: center;
    text-align: center;

    @media (min-width: $breakpoint-md) {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  .copyright {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    margin: 0;
  }

  .footer-bottom-links {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    justify-content: center;

    @media (min-width: $breakpoint-md) {
      justify-content: flex-end;
    }
  }

  .bottom-link {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: var(--font-size-sm);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-primary);
    }
  }
</style>
