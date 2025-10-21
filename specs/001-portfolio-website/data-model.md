# Data Model: Web Developer Portfolio Website

**Created**: 2025-10-21  
**Feature**: Portfolio Website Data Structure  
**Purpose**: Define database schema and data relationships for portfolio content

## Database Schema (SQLite)

### Skills Table

```sql
CREATE TABLE skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_path TEXT,
  description TEXT,
  category TEXT, -- e.g., 'frontend', 'backend', 'tools', 'languages'
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store technical skills displayed on homepage and used for project filtering  
**Key Fields**:

- `slug`: URL-friendly identifier for filtering
- `icon_path`: Path to skill icon in `/static/icons/`
- `category`: Groups skills for better organization
- `display_order`: Controls homepage display sequence

### Projects Table

```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  content_file_path TEXT, -- Path to markdown file with full content
  featured BOOLEAN DEFAULT FALSE,
  demo_url TEXT,
  repository_url TEXT,
  image_path TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'draft'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store project metadata and references to detailed content  
**Key Fields**:

- `content_file_path`: Points to markdown file with challenges, solutions, detailed description
- `featured`: Controls homepage display
- `status`: Allows draft/archived projects

### Project_Skills Junction Table

```sql
CREATE TABLE project_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  relevance_level TEXT DEFAULT 'primary', -- 'primary', 'secondary', 'tools'
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(project_id, skill_id)
);
```

**Purpose**: Many-to-many relationship between projects and skills  
**Key Fields**:

- `relevance_level`: Indicates how central the skill was to the project

### Blog_Posts Table

```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- Full markdown content stored directly
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  published_date DATETIME,
  read_time_minutes INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store blog posts with full content in database for search and filtering  
**Key Fields**:

- `excerpt`: Short preview for blog listing pages
- `published`: Allows draft posts
- `read_time_minutes`: Calculated reading time

### Blog_Post_Tags Junction Table

```sql
CREATE TABLE blog_post_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_post_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

**Purpose**: Flexible tagging system for blog posts  
**Key Fields**:

- `tag`: String-based tags for easy management

### Contact_Submissions Table

```sql
CREATE TABLE contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store contact form submissions for follow-up  
**Key Fields**:

- `status`: Tracks response workflow
- `ip_address`, `user_agent`: Basic spam prevention

## Indexes for Performance

```sql
-- Skills indexes
CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_skills_category ON skills(category);

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_status ON projects(status);

-- Project-Skills indexes
CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- Blog indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_date ON blog_posts(published_date);

-- Full-text search for blog posts
CREATE VIRTUAL TABLE blog_posts_fts USING fts5(
  title, excerpt, content,
  content='blog_posts', content_rowid='id'
);
```

## Data Validation Rules

### Skills Validation

- Name: Required, 1-50 characters
- Slug: Required, lowercase, alphanumeric + hyphens only
- Category: Must be one of predefined categories
- Icon path: Must exist in static/icons/ directory

### Projects Validation

- Title: Required, 1-100 characters
- Slug: Required, URL-safe format
- Short description: Required, 50-200 characters
- Content file path: Must point to existing markdown file
- URLs: Valid HTTP/HTTPS format when provided

### Blog Posts Validation

- Title: Required, 1-100 characters
- Slug: Required, URL-safe format
- Excerpt: Required, 100-300 characters
- Content: Required, minimum 500 characters
- Published date: Required when published=true

### Contact Submissions Validation

- Name: Required, 1-100 characters
- Email: Required, valid email format
- Message: Required, 10-5000 characters
- Rate limiting: Max 3 submissions per IP per hour

## Content File Structure

### Project Markdown Files

Location: `/src/lib/content/projects/[slug].md`

```markdown
---
challenges:
  - 'Challenge description 1'
  - 'Challenge description 2'
solutions:
  - 'Solution description 1'
  - 'Solution description 2'
technologies:
  - 'Technology 1'
  - 'Technology 2'
skills_demonstrated:
  - 'Skill 1'
  - 'Skill 2'
---

# Project Detailed Description

Full project description with implementation details, architecture decisions, and lessons learned.

## Screenshots

![Screenshot 1](path/to/image1.jpg)
![Screenshot 2](path/to/image2.jpg)
```

## Data Access Patterns

### Homepage Queries

1. Get featured projects (max 6)
2. Get recent blog posts (max 3)
3. Get all skills grouped by category
4. Get project counts by skill for filtering

### Project Filtering

1. Filter projects by skill(s) with AND/OR logic
2. Search projects by title/description
3. Get related projects by shared skills

### Blog Operations

1. Paginated blog post listing
2. Full-text search across title/content
3. Filter by tags
4. Get related posts by shared tags

## Migration Strategy

### Initial Data Population

1. Create database schema with all tables and indexes
2. Populate skills table with predefined skill set
3. Import existing project data if available
4. Create initial blog post entries

### Content Migration

1. Convert existing project documentation to markdown format
2. Extract project metadata to database
3. Establish project-skill relationships
4. Optimize images for web display

## Backup and Recovery

### Regular Backups

- Daily SQLite database dumps
- Version control for markdown content files
- Image asset backups to cloud storage

### Recovery Procedures

- Point-in-time recovery from daily dumps
- Content file recovery from git history
- Asset recovery from cloud backups
