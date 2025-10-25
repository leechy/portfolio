# Quickstart Guide: Portfolio Website Development

**Purpose**: Get the portfolio website running locally and understand the development workflow.
**Estimated Setup Time**: 15-20 minutes
**Prerequisites**: Node.js 18+, Git, SQLite3

## Quick Setup

### 1. Environment Setup

```bash
# Clone repository (replace with actual repo URL)
git clone <repository-url>
cd portfolio-website

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize database
npm run db:setup
```

### 2. Development Server

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### 3. Verify Installation

- ✅ Homepage loads with navigation
- ✅ Skills section displays with icons
- ✅ Projects section shows sample data
- ✅ Blog section loads recent posts
- ✅ Contact form is accessible

## Development Workflow

### Adding a New Project

1. **Create project entry in database:**

```bash
npm run db:seed:project "My New Project" "my-new-project"
```

2. **Create project markdown file:**

```bash
# File: src/lib/content/projects/my-new-project.md
---
challenges:
  - "Main technical challenge"
solutions:
  - "How I solved it"
technologies:
  - "SvelteKit"
  - "TypeScript"
skills_demonstrated:
  - "Frontend Development"
---

# My New Project

Detailed description of the project...
```

3. **Add project images:**

```bash
# Place images in static/images/projects/
static/images/projects/my-new-project/
├── hero.jpg
├── screenshot1.jpg
└── screenshot2.jpg
```

4. **Link project to skills:**

```bash
npm run db:link:project-skill my-new-project sveltekit primary
npm run db:link:project-skill my-new-project typescript secondary
```

### Adding a New Blog Post

1. **Create blog post:**

```bash
npm run blog:create "My Blog Post Title"
# This creates a draft in the database with a generated slug
```

2. **Edit the blog post:**

```bash
# Access at http://localhost:5173/admin/blog/my-blog-post-title
# Or edit directly in database/admin interface
```

3. **Publish when ready:**

```bash
npm run blog:publish my-blog-post-title
```

### Adding a New Skill

1. **Add skill to database:**

```bash
npm run skill:create "New Framework" "new-framework" "frontend"
```

2. **Add skill icon:**

```bash
# Place SVG icon at static/icons/new-framework.svg
```

3. **Link to existing projects:**

```bash
npm run db:link:project-skill existing-project new-framework secondary
```

## File Structure Navigation

### Key Directories

```
src/
├── routes/              # Page routes (SvelteKit file-based routing)
│   ├── +layout.svelte  # Global layout with navigation
│   ├── +page.svelte    # Homepage
│   └── projects/       # Project-related pages
├── lib/
│   ├── components/     # Reusable UI components
│   ├── database/       # Database connection and queries
│   ├── content/        # Markdown project files
│   └── utils/          # Helper functions
└── static/             # Static assets (images, icons)
```

### Important Files

- `src/app.html`: Root HTML template
- `src/lib/database/connection.js`: SQLite connection setup
- `src/lib/database/queries.js`: Database query functions
- `static/images/`: Project screenshots and portfolio images
- `static/icons/`: Skill and technology icons

## Common Development Tasks

### Database Operations

```bash
# Reset database to clean state
npm run db:reset

# Seed with sample data
npm run db:seed

# Create database backup
npm run db:backup

# Run database migrations
npm run db:migrate
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Test with coverage
npm run test:coverage
```

### Building and Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Configuration

### Environment Variables (.env)

```bash
# Database
DATABASE_URL="./data/portfolio.db"

# Contact Form
CONTACT_EMAIL="your-email@example.com"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Performance Monitoring (optional)
SENTRY_DSN="https://your-sentry-dsn"
```

### Customization Options

#### Color Theme

Edit `src/app.css` for global color variables:

```css
:root {
  --color-primary: #your-brand-color;
  --color-background: #your-bg-color;
  --color-text: #your-text-color;
}
```

#### Content Configuration

Edit `src/lib/config.js`:

```javascript
export const config = {
  siteTitle: 'Your Name - Developer Portfolio',
  siteDescription: 'Your portfolio description',
  socialLinks: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile',
    twitter: 'https://twitter.com/yourhandle'
  },
  contactEmail: 'your-email@example.com'
};
```

## Troubleshooting

### Common Issues

**Database connection errors:**

```bash
# Check if database file exists and has correct permissions
ls -la data/portfolio.db
chmod 644 data/portfolio.db
```

**Image not loading:**

- Verify image exists in `static/images/` directory
- Check image path in database matches actual file location
- Ensure image formats are web-compatible (JPG, PNG, WebP)

**Skill icons not showing:**

- Check SVG files exist in `static/icons/`
- Verify icon paths in database match filenames
- Ensure SVG files are properly formatted

**Build errors:**

```bash
# Clear SvelteKit cache
rm -rf .svelte-kit
npm run dev
```

### Development Tools

**Database Admin Interface:**

```bash
# Install SQLite browser (macOS)
brew install --cask db-browser-for-sqlite

# Or use command line
sqlite3 data/portfolio.db
```

**Performance Profiling:**

```bash
# Lighthouse CI for performance testing
npm run lighthouse

# Bundle analyzer for size optimization
npm run analyze
```

## Next Steps

After setup, consider:

1. **Content Creation**: Add your actual projects and blog posts
2. **Styling Customization**: Adapt the design to your brand
3. **Performance Optimization**: Optimize images and implement lazy loading
4. **SEO Setup**: Configure meta tags and structured data
5. **Analytics**: Set up Google Analytics or similar
6. **Deployment**: Configure CI/CD pipeline for automatic deployments

## Getting Help

- **Documentation**: Check `docs/` directory for detailed guides
- **Database Schema**: See `data-model.md` for complete schema
- **API Reference**: See `contracts/api.md` for endpoint documentation
- **Issues**: Report bugs in the project issue tracker
