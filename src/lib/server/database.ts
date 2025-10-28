import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import bcrypt from 'bcrypt';

// Database configuration
const DB_PATH = dev ? './data/portfolio.db' : './portfolio.db';

let db: Database.Database;

/**
 * Initialize database connection and create tables
 */
export function initDatabase(): Database.Database {
	db = new Database(DB_PATH);

	// Enable foreign keys
	db.pragma('foreign_keys = ON');

	// Create tables
	createTables();

	// Seed initial data if tables are empty
	seedInitialData();

	return db;
}

/**
 * Get database instance
 */
export function getDatabase(): Database.Database {
	if (!db) {
		return initDatabase();
	}
	return db;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
	if (db) {
		db.close();
	}
}

/**
 * Create database tables
 */
function createTables(): void {
	// Projects table
	db.exec(`
		CREATE TABLE IF NOT EXISTS projects (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			content TEXT,
			image TEXT,
			technologies TEXT, -- JSON array as string
			github_url TEXT,
			live_url TEXT,
			status TEXT DEFAULT 'in-progress' CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')),
			featured BOOLEAN DEFAULT FALSE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Blog posts table
	db.exec(`
		CREATE TABLE IF NOT EXISTS blog_posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			slug TEXT UNIQUE NOT NULL,
			content TEXT NOT NULL,
			excerpt TEXT,
			featured_image TEXT,
			category TEXT,
			tags TEXT, -- JSON array as string
			status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
			published_at DATETIME,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Users table for authentication
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			name TEXT NOT NULL,
			role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
			is_active BOOLEAN DEFAULT 1,
			last_login DATETIME,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Media files table
	db.exec(`
		CREATE TABLE IF NOT EXISTS media_files (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			filename TEXT NOT NULL,
			original_filename TEXT NOT NULL,
			file_path TEXT NOT NULL,
			file_url TEXT NOT NULL,
			file_type TEXT NOT NULL,
			file_size INTEGER NOT NULL,
			mime_type TEXT NOT NULL,
			width INTEGER,
			height INTEGER,
			duration INTEGER, -- for videos
			alt_text TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);

	// Create indexes for better query performance
	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
		CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
		CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
		CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
		CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
		CREATE INDEX IF NOT EXISTS idx_media_files_file_type ON media_files(file_type);
		CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);
		CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
		CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
	`); // Create trigger to update updated_at timestamp
	db.exec(`
		CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
		AFTER UPDATE ON projects
		BEGIN
			UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
		
		CREATE TRIGGER IF NOT EXISTS update_blog_posts_timestamp 
		AFTER UPDATE ON blog_posts
		BEGIN
			UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
		
		CREATE TRIGGER IF NOT EXISTS update_media_files_timestamp 
		AFTER UPDATE ON media_files
		BEGIN
			UPDATE media_files SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
		
		CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
		AFTER UPDATE ON users
		BEGIN
			UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
		END;
	`);

	// Migration: Add category column if it doesn't exist
	try {
		db.exec(`ALTER TABLE blog_posts ADD COLUMN category TEXT`);
	} catch {
		// Column already exists, ignore error
	}
}

/**
 * Seed initial data if tables are empty
 */
function seedInitialData(): void {
	// Check if we already have data
	const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as {
		count: number;
	};
	const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as {
		count: number;
	};
	const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as {
		count: number;
	};

	if (projectCount.count === 0) {
		seedProjects();
	}

	if (blogCount.count === 0) {
		seedBlogPosts();
	}

	if (userCount.count === 0) {
		seedUsers();
	}
}

/**
 * Seed initial projects
 */
function seedProjects(): void {
	const insertProject = db.prepare(`
		INSERT INTO projects (title, description, content, technologies, github_url, live_url, status, featured)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`);

	const projects = [
		{
			title: 'E-commerce Dashboard',
			description:
				'A comprehensive admin dashboard for managing e-commerce operations with real-time analytics.',
			content:
				'Built with SvelteKit and TypeScript, this dashboard provides a complete solution for e-commerce management including inventory, orders, customers, and analytics. Features real-time updates, responsive design, and comprehensive reporting.',
			technologies: JSON.stringify([
				'SvelteKit',
				'TypeScript',
				'Tailwind CSS',
				'Chart.js',
				'SQLite'
			]),
			github_url: 'https://github.com/leechy/ecommerce-dashboard',
			live_url: 'https://ecommerce-demo.leechy.dev',
			status: 'completed',
			featured: 1
		},
		{
			title: 'Task Management System',
			description: 'A modern task management application with team collaboration features.',
			content:
				'Full-featured task management system with drag-and-drop interface, team collaboration, file attachments, and project tracking. Built with modern web technologies for optimal performance.',
			technologies: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io']),
			github_url: 'https://github.com/leechy/task-manager',
			live_url: 'https://tasks.leechy.dev',
			status: 'completed',
			featured: 1
		},
		{
			title: 'Weather Analytics Platform',
			description:
				'Advanced weather data visualization and analytics platform with predictive modeling.',
			content:
				'Comprehensive weather analytics platform that aggregates data from multiple sources, provides interactive visualizations, and uses machine learning for weather predictions.',
			technologies: JSON.stringify(['Python', 'FastAPI', 'React', 'D3.js', 'PostgreSQL', 'Docker']),
			github_url: 'https://github.com/leechy/weather-analytics',
			live_url: null,
			status: 'in-progress',
			featured: 0
		},
		{
			title: 'Portfolio Website',
			description: 'Personal portfolio website with blog and admin interface.',
			content:
				'Modern portfolio website built with SvelteKit featuring a blog system, admin interface, and media management. Includes authentication, CRUD operations, and responsive design.',
			technologies: JSON.stringify(['SvelteKit', 'TypeScript', 'SQLite', 'Tailwind CSS']),
			github_url: 'https://github.com/leechy/portfolio',
			live_url: 'https://leechy.dev',
			status: 'completed',
			featured: 1
		}
	];

	projects.forEach(project => {
		insertProject.run(
			project.title,
			project.description,
			project.content,
			project.technologies,
			project.github_url,
			project.live_url,
			project.status,
			project.featured
		);
	});
}

/**
 * Seed initial blog posts
 */
function seedBlogPosts(): void {
	const insertBlogPost = db.prepare(`
		INSERT INTO blog_posts (title, slug, content, excerpt, category, tags, status, published_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`);

	const blogPosts = [
		{
			title: 'Getting Started with SvelteKit',
			slug: 'getting-started-with-sveltekit',
			content: `# Getting Started with SvelteKit

SvelteKit is a powerful framework for building web applications with Svelte. In this post, we'll explore the fundamentals and see why it's becoming increasingly popular among developers.

## What is SvelteKit?

SvelteKit is the official application framework for Svelte, providing everything you need to build a modern web application:

- **File-based routing** - Pages are created by adding files to the \`src/routes\` directory
- **Server-side rendering** - Fast initial page loads with SEO benefits
- **API routes** - Build your backend and frontend in the same codebase
- **Optimized builds** - Automatic code splitting and optimizations

## Key Features

### 1. Zero-config Setup
SvelteKit works out of the box with sensible defaults, but remains highly configurable when needed.

### 2. Full-stack Framework
Build both your frontend and API in the same project with built-in support for various adapters.

### 3. Performance by Default
Svelte compiles to vanilla JavaScript, resulting in smaller bundle sizes and better runtime performance.

## Getting Started

\`\`\`bash
npm create sveltekit@latest my-app
cd my-app
npm install
npm run dev
\`\`\`

That's it! You now have a fully functional SvelteKit application.

## Conclusion

SvelteKit offers a refreshing approach to web development with its compile-time optimizations and intuitive API. Whether you're building a simple website or a complex web application, SvelteKit provides the tools you need to succeed.`,
			excerpt:
				"Discover the fundamentals of SvelteKit and learn why it's becoming the go-to framework for modern web development.",
			category: 'Frontend Development',
			tags: JSON.stringify(['SvelteKit', 'JavaScript', 'Web Development', 'Tutorial']),
			status: 'published',
			published_at: '2024-01-15 10:00:00'
		},
		{
			title: 'Advanced TypeScript Patterns for Better Code',
			slug: 'advanced-typescript-patterns',
			content: `# Advanced TypeScript Patterns for Better Code

TypeScript has evolved significantly, introducing powerful patterns that can make your code more robust, maintainable, and type-safe. Let's explore some advanced patterns that every TypeScript developer should know.

## 1. Conditional Types

Conditional types allow you to create types that depend on conditions:

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

// Usage
type StringResponse = ApiResponse<string>; // { message: string }
type UserResponse = ApiResponse<User>; // { data: User }
\`\`\`

## 2. Template Literal Types

Create string literal types with interpolation:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type MouseEvents = EventName<'click' | 'hover'>; // 'onClick' | 'onHover'
\`\`\`

## 3. Mapped Types

Transform existing types:

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
\`\`\`

## 4. Utility Types in Practice

Combine utility types for powerful transformations:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
type CreateUser = Omit<User, 'id'>;
type UpdateUser = Partial<CreateUser>;
\`\`\`

## Best Practices

1. **Use strict mode** - Enable strict TypeScript settings
2. **Leverage type guards** - Create runtime type checking
3. **Prefer interfaces over types** - For object shapes
4. **Use const assertions** - For immutable data structures

## Conclusion

These advanced TypeScript patterns can significantly improve your code quality and developer experience. Start incorporating them into your projects to write more robust and maintainable code.`,
			excerpt:
				'Explore advanced TypeScript patterns including conditional types, template literals, and mapped types to write better, more type-safe code.',
			category: 'Programming Languages',
			tags: JSON.stringify(['TypeScript', 'Programming', 'Best Practices', 'Advanced']),
			status: 'published',
			published_at: '2024-01-10 14:30:00'
		},
		{
			title: 'Building Scalable Web Applications',
			slug: 'building-scalable-web-applications',
			content: `# Building Scalable Web Applications

Scalability is crucial for modern web applications. As your user base grows, your application needs to handle increased traffic, data, and complexity. Here's how to build applications that scale.

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: Focus on user experience and presentation
- **Backend**: Handle business logic and data processing  
- **Database**: Optimize for data storage and retrieval

### 2. Microservices vs Monolith
Choose the right architecture for your needs:

**Monolith Benefits:**
- Simpler deployment
- Easier testing
- Lower operational overhead

**Microservices Benefits:**
- Independent scaling
- Technology diversity
- Team autonomy

## Performance Optimization

### Frontend Optimization
- **Code splitting** - Load only what's needed
- **Lazy loading** - Defer non-critical resources
- **Caching strategies** - Reduce server requests
- **Image optimization** - Use modern formats (WebP, AVIF)

### Backend Optimization
- **Database indexing** - Speed up queries
- **Connection pooling** - Manage database connections
- **Caching layers** - Redis, Memcached
- **Load balancing** - Distribute traffic

## Monitoring and Observability

Implement comprehensive monitoring:

\`\`\`javascript
// Example: Performance monitoring
function trackPerformance(operation, duration) {
  analytics.track('performance', {
    operation,
    duration,
    timestamp: Date.now()
  });
}
\`\`\`

## Database Scaling Strategies

1. **Vertical Scaling** - Upgrade hardware
2. **Horizontal Scaling** - Add more servers
3. **Read Replicas** - Separate read/write operations
4. **Sharding** - Distribute data across databases

## Conclusion

Building scalable applications requires careful planning, the right architecture choices, and continuous optimization. Start with solid foundations and iterate based on real-world usage patterns.`,
			excerpt:
				'Learn the essential principles and strategies for building web applications that can scale to handle growing user bases and increased complexity.',
			category: 'Full Stack Development',
			tags: JSON.stringify(['Architecture', 'Scalability', 'Performance', 'Best Practices']),
			status: 'published',
			published_at: '2024-01-05 09:15:00'
		}
	];

	blogPosts.forEach(post => {
		insertBlogPost.run(
			post.title,
			post.slug,
			post.content,
			post.excerpt,
			post.category,
			post.tags,
			post.status,
			post.published_at
		);
	});
}

/**
 * Seed initial admin user
 */
function seedUsers(): void {
	const saltRounds = 12;

	// Hash the default admin password
	const hashedPassword = bcrypt.hashSync('admin123!', saltRounds);

	const insertUser = db.prepare(`
		INSERT INTO users (email, password_hash, name, role, is_active)
		VALUES (?, ?, ?, ?, ?)
	`);

	// Create default admin user
	insertUser.run('admin@leechy.dev', hashedPassword, 'Admin User', 'admin', 1);
}

// Export types for use in other files
export interface User {
	id: number;
	email: string;
	password_hash: string;
	name: string;
	role: 'admin' | 'editor';
	is_active: boolean;
	last_login?: string;
	created_at: string;
	updated_at: string;
}

export interface Project {
	id: number;
	title: string;
	description: string;
	content?: string;
	image?: string;
	technologies: string[]; // Will be parsed from JSON
	github_url?: string;
	live_url?: string;
	status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
	featured: boolean;
	created_at: string;
	updated_at: string;
}

export interface BlogPost {
	id: number;
	title: string;
	category?: string;
	slug: string;
	content: string; // Raw markdown content
	excerpt?: string;
	featured_image?: string;
	tags: string[]; // Will be parsed from JSON
	status: 'draft' | 'published' | 'archived';
	published_at?: string;
	created_at: string;
	updated_at: string;
}

export interface MediaFile {
	id: number;
	filename: string;
	original_filename: string;
	file_path: string;
	file_url: string;
	file_type: string;
	file_size: number;
	mime_type: string;
	width?: number;
	height?: number;
	duration?: number;
	alt_text?: string;
	created_at: string;
	updated_at: string;
}
