-- =============================================================================
-- Portfolio Website Database Schema
-- =============================================================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- =============================================================================
-- Core Content Tables
-- =============================================================================

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Leechy',
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    meta_description TEXT,
    meta_keywords TEXT,
    reading_time INTEGER, -- in minutes
    view_count INTEGER DEFAULT 0
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    github_url TEXT,
    demo_url TEXT,
    status TEXT CHECK(status IN ('planning', 'in-progress', 'completed', 'archived')) DEFAULT 'planning',
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE,
    meta_description TEXT,
    image_url TEXT
);

-- Skills/Technologies
CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- e.g., 'frontend', 'backend', 'database', 'tool'
    proficiency INTEGER CHECK(proficiency >= 1 AND proficiency <= 5), -- 1-5 scale
    description TEXT,
    icon_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Relationship Tables
-- =============================================================================

-- Project-Skill relationships (many-to-many)
CREATE TABLE IF NOT EXISTS project_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(project_id, skill_id)
);

-- Blog Post Tags (many-to-many)
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(post_id, tag_id)
);

-- =============================================================================
-- Portfolio Metadata
-- =============================================================================

-- Site configuration and metadata
CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY CHECK(id = 1), -- Ensure only one row
    site_title TEXT DEFAULT 'Leechy.dev',
    site_description TEXT DEFAULT 'Portfolio of a passionate developer',
    site_url TEXT DEFAULT 'https://leechy.dev',
    author_name TEXT DEFAULT 'Leechy',
    author_email TEXT,
    author_bio TEXT,
    social_github TEXT,
    social_linkedin TEXT,
    social_twitter TEXT,
    analytics_id TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT CHECK(status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Indexes for Performance
-- =============================================================================

-- Blog post indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Skill indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- Tag indexes
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);

-- =============================================================================
-- Triggers for Updated Timestamps
-- =============================================================================

-- Blog posts updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_blog_posts_updated_at 
    AFTER UPDATE ON blog_posts
    FOR EACH ROW
BEGIN
    UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Projects updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_projects_updated_at 
    AFTER UPDATE ON projects
    FOR EACH ROW
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Site config updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_site_config_updated_at 
    AFTER UPDATE ON site_config
    FOR EACH ROW
BEGIN
    UPDATE site_config SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Contact submissions updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_contact_submissions_updated_at 
    AFTER UPDATE ON contact_submissions
    FOR EACH ROW
BEGIN
    UPDATE contact_submissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;