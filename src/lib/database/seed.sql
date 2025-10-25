-- =============================================================================
-- Portfolio Website Seed Data
-- =============================================================================

-- Initialize site configuration
INSERT OR IGNORE INTO site_config (
    id, 
    site_title, 
    site_description, 
    site_url, 
    author_name, 
    author_email, 
    author_bio,
    social_github,
    social_linkedin,
    social_twitter
) VALUES (
    1,
    'Leechy.dev',
    'Portfolio of a passionate full-stack developer creating innovative web solutions',
    'https://leechy.dev',
    'Leechy',
    'contact@leechy.dev',
    'Passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable applications that solve real-world problems.',
    'https://github.com/leechy',
    'https://linkedin.com/in/leechy-dev',
    'https://twitter.com/leechy_dev'
);

-- =============================================================================
-- Skills Seed Data
-- =============================================================================

-- Frontend Technologies
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('JavaScript', 'frontend', 5, 'Expert in modern JavaScript (ES6+), async/await, modules, and advanced concepts', '/icons/javascript.svg'),
('TypeScript', 'frontend', 5, 'Strong typing for scalable applications with advanced type system knowledge', '/icons/typescript.svg'),
('Svelte', 'frontend', 4, 'Modern reactive framework with excellent performance and developer experience', '/icons/svelte.svg'),
('SvelteKit', 'frontend', 4, 'Full-stack Svelte framework for building fast, efficient web applications', '/icons/sveltekit.svg'),
('React', 'frontend', 4, 'Component-based UI library with hooks, context, and modern patterns', '/icons/react.svg'),
('Vue.js', 'frontend', 3, 'Progressive framework for building user interfaces with reactive data', '/icons/vue.svg'),
('HTML5', 'frontend', 5, 'Semantic markup, accessibility best practices, and modern HTML features', '/icons/html5.svg'),
('CSS3', 'frontend', 5, 'Advanced styling, animations, flexbox, grid, and responsive design', '/icons/css3.svg'),
('Sass/SCSS', 'frontend', 4, 'CSS preprocessing with variables, mixins, and advanced features', '/icons/sass.svg'),
('Tailwind CSS', 'frontend', 4, 'Utility-first CSS framework for rapid UI development', '/icons/tailwind.svg');

-- Backend Technologies
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('Node.js', 'backend', 5, 'Server-side JavaScript runtime with npm ecosystem and async programming', '/icons/nodejs.svg'),
('Express.js', 'backend', 4, 'Fast, minimalist web framework for Node.js applications', '/icons/express.svg'),
('Python', 'backend', 4, 'Versatile programming language for web development and automation', '/icons/python.svg'),
('FastAPI', 'backend', 3, 'Modern Python web framework for building APIs with automatic documentation', '/icons/fastapi.svg'),
('PHP', 'backend', 3, 'Server-side scripting language for web development', '/icons/php.svg'),
('REST APIs', 'backend', 5, 'Design and implementation of RESTful web services', '/icons/api.svg'),
('GraphQL', 'backend', 3, 'Query language and runtime for APIs with flexible data fetching', '/icons/graphql.svg');

-- Database Technologies
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('SQLite', 'database', 4, 'Lightweight, serverless database engine perfect for applications', '/icons/sqlite.svg'),
('PostgreSQL', 'database', 4, 'Advanced open-source relational database with rich feature set', '/icons/postgresql.svg'),
('MongoDB', 'database', 3, 'NoSQL document database for flexible, scalable data storage', '/icons/mongodb.svg'),
('MySQL', 'database', 3, 'Popular open-source relational database management system', '/icons/mysql.svg'),
('Redis', 'database', 3, 'In-memory data store for caching and real-time applications', '/icons/redis.svg');

-- Development Tools
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('Git', 'tool', 5, 'Version control system with branching, merging, and collaboration workflows', '/icons/git.svg'),
('GitHub', 'tool', 5, 'Code hosting platform with CI/CD, issue tracking, and collaboration', '/icons/github.svg'),
('VS Code', 'tool', 5, 'Powerful code editor with extensions and integrated development features', '/icons/vscode.svg'),
('Vite', 'tool', 4, 'Fast build tool and development server for modern web projects', '/icons/vite.svg'),
('Webpack', 'tool', 3, 'Module bundler for JavaScript applications with advanced configuration', '/icons/webpack.svg'),
('ESLint', 'tool', 4, 'Linting utility for identifying and fixing JavaScript code issues', '/icons/eslint.svg'),
('Prettier', 'tool', 4, 'Code formatter for consistent code styling across projects', '/icons/prettier.svg'),
('npm', 'tool', 5, 'Package manager for Node.js with dependency management', '/icons/npm.svg'),
('Yarn', 'tool', 4, 'Fast, reliable package manager with improved dependency resolution', '/icons/yarn.svg');

-- Cloud & DevOps
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('Docker', 'devops', 3, 'Containerization platform for consistent application deployment', '/icons/docker.svg'),
('Vercel', 'devops', 4, 'Deployment platform optimized for frontend frameworks and serverless', '/icons/vercel.svg'),
('Netlify', 'devops', 4, 'Web development platform for deploying modern web applications', '/icons/netlify.svg'),
('GitHub Actions', 'devops', 3, 'CI/CD platform for automating build, test, and deployment workflows', '/icons/github-actions.svg'),
('Linux', 'devops', 3, 'Unix-like operating system for server administration and development', '/icons/linux.svg');

-- Testing & Quality Assurance
INSERT OR IGNORE INTO skills (name, category, proficiency, description, icon_url) VALUES
('Vitest', 'testing', 4, 'Fast unit testing framework powered by Vite', '/icons/vitest.svg'),
('Jest', 'testing', 4, 'JavaScript testing framework with built-in assertions and mocking', '/icons/jest.svg'),
('Playwright', 'testing', 3, 'End-to-end testing framework for modern web applications', '/icons/playwright.svg'),
('Cypress', 'testing', 3, 'JavaScript testing framework for integration and E2E testing', '/icons/cypress.svg');

-- =============================================================================
-- Sample Tags for Blog Posts
-- =============================================================================

INSERT OR IGNORE INTO tags (name, slug, description) VALUES
('JavaScript', 'javascript', 'Articles about JavaScript programming and best practices'),
('TypeScript', 'typescript', 'Content related to TypeScript development and type safety'),
('Svelte', 'svelte', 'Posts about Svelte framework and reactive programming'),
('SvelteKit', 'sveltekit', 'Tutorials and insights about SvelteKit full-stack development'),
('Web Development', 'web-development', 'General web development topics and trends'),
('Frontend', 'frontend', 'Frontend development techniques and technologies'),
('Backend', 'backend', 'Server-side development and API design'),
('Database', 'database', 'Database design, optimization, and best practices'),
('Performance', 'performance', 'Web performance optimization and monitoring'),
('Accessibility', 'accessibility', 'Web accessibility and inclusive design practices'),
('Testing', 'testing', 'Software testing methodologies and frameworks'),
('DevOps', 'devops', 'Development operations, CI/CD, and deployment strategies'),
('Career', 'career', 'Professional development and career advice for developers'),
('Tutorial', 'tutorial', 'Step-by-step tutorials and how-to guides'),
('Tips', 'tips', 'Quick tips and tricks for developers'),
('Tools', 'tools', 'Development tools and workflow optimization'),
('Open Source', 'open-source', 'Open source projects and contributions');

-- =============================================================================
-- Sample Blog Post (Welcome Post)
-- =============================================================================

INSERT OR IGNORE INTO blog_posts (
    title,
    slug,
    excerpt,
    content,
    author,
    published,
    featured,
    published_at,
    meta_description,
    meta_keywords,
    reading_time
) VALUES (
    'Welcome to My Developer Portfolio',
    'welcome-to-my-portfolio',
    'Introducing my new portfolio website built with SvelteKit, featuring my projects, blog posts, and professional journey as a full-stack developer.',
    '# Welcome to My Developer Portfolio

Hello and welcome to my corner of the web! 🎉

I''m excited to share this new portfolio website with you, built from the ground up using modern web technologies that I''m passionate about.

## What You''ll Find Here

This portfolio is designed to showcase:

- **My Projects**: A collection of applications and tools I''ve built, ranging from web applications to developer utilities
- **Blog Posts**: Insights, tutorials, and thoughts on web development, programming best practices, and technology trends  
- **Skills & Experience**: My technical expertise and professional journey as a full-stack developer
- **Contact Information**: Ways to connect with me for collaborations, opportunities, or just to say hello

## Built With Modern Technology

This website itself is a demonstration of my technical skills, built using:

- **SvelteKit**: For the full-stack framework providing excellent performance and developer experience
- **TypeScript**: Ensuring type safety and better code quality
- **SQLite**: Lightweight database for content management
- **Tailwind CSS**: For responsive, utility-first styling
- **Vite**: Fast development and optimized production builds

## What''s Next?

I''ll be regularly updating this space with:
- New project showcases and case studies
- Technical blog posts and tutorials
- Insights from my development journey
- Resources and tools I find valuable

Whether you''re a fellow developer, potential collaborator, or just curious about my work, I hope you find something interesting here!

Feel free to explore the site and don''t hesitate to reach out if you''d like to connect.

Happy coding! 🚀

---

*This post marks the launch of my portfolio website. Stay tuned for more content!*',
    'Leechy',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP,
    'Welcome to my developer portfolio showcasing projects, blog posts, and technical expertise in modern web development.',
    'portfolio, web development, SvelteKit, TypeScript, developer, programming, blog',
    3
);

-- Add tags to the welcome blog post
INSERT OR IGNORE INTO blog_post_tags (post_id, tag_id)
SELECT bp.id, t.id 
FROM blog_posts bp, tags t 
WHERE bp.slug = 'welcome-to-my-portfolio' 
  AND t.slug IN ('web-development', 'portfolio', 'sveltekit', 'typescript');

-- =============================================================================
-- Sample Project
-- =============================================================================

INSERT OR IGNORE INTO projects (
    title,
    slug,
    description,
    long_description,
    github_url,
    demo_url,
    status,
    featured,
    start_date,
    meta_description,
    image_url
) VALUES (
    'Portfolio Website',
    'portfolio-website',
    'Modern portfolio website built with SvelteKit, TypeScript, and SQLite',
    'A fully-featured portfolio website showcasing projects, blog posts, and professional experience. Built with modern web technologies including SvelteKit for the framework, TypeScript for type safety, SQLite for data storage, and Tailwind CSS for styling.

## Key Features

- **Responsive Design**: Optimized for all device sizes with mobile-first approach
- **Blog System**: Full-featured blog with markdown support and tagging
- **Project Showcase**: Dynamic project gallery with filtering and search
- **Contact Form**: Integrated contact system with form validation
- **Performance Optimized**: Fast loading times and excellent Core Web Vitals scores
- **SEO Friendly**: Proper meta tags, structured data, and search engine optimization

## Technical Implementation

- Built with SvelteKit for excellent performance and developer experience
- TypeScript for type safety and better code maintainability  
- SQLite database with proper indexing and relationships
- Tailwind CSS for consistent, responsive styling
- Vite for fast development and optimized builds
- ESLint and Prettier for code quality and consistency

This project demonstrates full-stack development capabilities, from database design to frontend implementation.',
    'https://github.com/leechy/portfolio',
    'https://leechy.dev',
    'completed',
    TRUE,
    '2024-01-01',
    'Modern developer portfolio built with SvelteKit, TypeScript, and SQLite showcasing projects and blog posts.',
    '/images/projects/portfolio-preview.jpg'
);

-- Add skills to the portfolio project
INSERT OR IGNORE INTO project_skills (project_id, skill_id)
SELECT p.id, s.id 
FROM projects p, skills s 
WHERE p.slug = 'portfolio-website' 
  AND s.name IN (
    'SvelteKit', 'TypeScript', 'JavaScript', 'SQLite', 
    'Tailwind CSS', 'HTML5', 'CSS3', 'Vite', 
    'ESLint', 'Prettier', 'Git', 'GitHub'
  );