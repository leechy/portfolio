/* eslint-disable no-console */
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Initialize database with schema and seed data
 */
export async function initializeDatabase(dbPath = 'portfolio.db'): Promise<Database.Database> {
	try {
		// Create database connection
		const db = new Database(dbPath);

		// Enable foreign keys
		db.pragma('foreign_keys = ON');

		console.log('📚 Initializing database schema...');

		// Read and execute schema
		const schemaPath = join(__dirname, 'schema.sql');
		const schema = readFileSync(schemaPath, 'utf8');
		db.exec(schema);

		console.log('✅ Database schema created successfully');

		// Check if we need to seed data (only if no site_config exists)
		const siteConfigCheck = db.prepare('SELECT COUNT(*) as count FROM site_config').get() as {
			count: number;
		};

		if (siteConfigCheck.count === 0) {
			console.log('🌱 Seeding initial data...');

			// Read and execute seed data
			const seedPath = join(__dirname, 'seed.sql');
			const seedData = readFileSync(seedPath, 'utf8');
			db.exec(seedData);

			console.log('✅ Database seeded successfully');
		} else {
			console.log('ℹ️ Database already contains data, skipping seed');
		}

		// Verify database structure
		const tables = db
			.prepare(
				`
			SELECT name FROM sqlite_master 
			WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
			ORDER BY name
		`
			)
			.all() as Array<{ name: string }>;

		console.log('📋 Database tables:', tables.map(t => t.name).join(', '));

		// Get some basic stats
		const stats = {
			skills: db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number },
			projects: db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number },
			blog_posts: db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number },
			tags: db.prepare('SELECT COUNT(*) as count FROM tags').get() as { count: number }
		};

		console.log('📊 Database stats:', {
			skills: stats.skills.count,
			projects: stats.projects.count,
			blog_posts: stats.blog_posts.count,
			tags: stats.tags.count
		});

		return db;
	} catch (error) {
		console.error('❌ Database initialization failed:', error);
		throw error;
	}
}

/**
 * Reset database (drop all tables and recreate)
 */
export async function resetDatabase(dbPath = 'portfolio.db'): Promise<Database.Database> {
	try {
		console.log('🔄 Resetting database...');

		const db = new Database(dbPath);

		// Get all tables
		const tables = db
			.prepare(
				`
			SELECT name FROM sqlite_master 
			WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
		`
			)
			.all() as Array<{ name: string }>;

		// Drop all tables
		for (const table of tables) {
			db.exec(`DROP TABLE IF EXISTS ${table.name}`);
		}

		console.log('🗑️ Dropped existing tables');

		// Reinitialize
		return await initializeDatabase(dbPath);
	} catch (error) {
		console.error('❌ Database reset failed:', error);
		throw error;
	}
}

/**
 * Add additional seed data for development/testing
 */
export function addDevelopmentData(db: Database.Database): void {
	try {
		console.log('🧪 Adding development test data...');

		// Add more sample blog posts
		const samplePosts = [
			{
				title: 'Building Modern Web Applications with SvelteKit',
				slug: 'sveltekit-modern-web-apps',
				excerpt:
					'Exploring the benefits of SvelteKit for building fast, efficient web applications with great developer experience.',
				content:
					'# Building Modern Web Applications with SvelteKit\n\nSvelteKit has revolutionized the way we build web applications...',
				published: true,
				featured: false,
				reading_time: 8
			},
			{
				title: 'TypeScript Best Practices for Large Applications',
				slug: 'typescript-best-practices',
				excerpt:
					'Essential TypeScript patterns and practices for maintaining large, scalable applications.',
				content:
					'# TypeScript Best Practices\n\nWorking with TypeScript in large applications requires...',
				published: true,
				featured: true,
				reading_time: 12
			},
			{
				title: 'Database Design Patterns for Web Applications',
				slug: 'database-design-patterns',
				excerpt: 'Common database design patterns and when to use them in modern web applications.',
				content: '# Database Design Patterns\n\nChoosing the right database design pattern...',
				published: false,
				featured: false,
				reading_time: 15
			}
		];

		const insertPost = db.prepare(`
			INSERT INTO blog_posts (title, slug, excerpt, content, published, featured, reading_time, published_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`);

		for (const post of samplePosts) {
			insertPost.run(
				post.title,
				post.slug,
				post.excerpt,
				post.content,
				post.published ? 1 : 0,
				post.featured ? 1 : 0,
				post.reading_time,
				post.published ? new Date().toISOString() : null
			);
		}

		// Add more sample projects
		const sampleProjects = [
			{
				title: 'Task Management Dashboard',
				slug: 'task-dashboard',
				description: 'React-based task management application with real-time updates',
				status: 'completed',
				featured: true
			},
			{
				title: 'E-commerce API',
				slug: 'ecommerce-api',
				description: 'RESTful API for e-commerce platform built with Node.js and PostgreSQL',
				status: 'completed',
				featured: false
			},
			{
				title: 'Mobile Weather App',
				slug: 'weather-app',
				description: 'Cross-platform weather application with location services',
				status: 'in-progress',
				featured: false
			}
		];

		const insertProject = db.prepare(`
			INSERT INTO projects (title, slug, description, status, featured)
			VALUES (?, ?, ?, ?, ?)
		`);

		for (const project of sampleProjects) {
			insertProject.run(
				project.title,
				project.slug,
				project.description,
				project.status,
				project.featured ? 1 : 0
			);
		}

		console.log('✅ Development data added successfully');
	} catch (error) {
		console.error('❌ Failed to add development data:', error);
		throw error;
	}
}

/**
 * Validate database integrity
 */
export function validateDatabase(db: Database.Database): boolean {
	try {
		console.log('🔍 Validating database integrity...');

		// Check foreign key constraints
		const foreignKeyCheck = db.prepare('PRAGMA foreign_key_check').all();
		if (foreignKeyCheck.length > 0) {
			console.error('❌ Foreign key constraint violations found:', foreignKeyCheck);
			return false;
		}

		// Check database integrity
		const integrityCheck = db.prepare('PRAGMA integrity_check').get() as {
			integrity_check: string;
		};
		if (integrityCheck.integrity_check !== 'ok') {
			console.error('❌ Database integrity check failed:', integrityCheck);
			return false;
		}

		// Verify required tables exist
		const requiredTables = [
			'blog_posts',
			'projects',
			'skills',
			'tags',
			'site_config',
			'project_skills',
			'blog_post_tags',
			'contact_submissions'
		];

		const existingTables = db
			.prepare(
				`
			SELECT name FROM sqlite_master 
			WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
		`
			)
			.all() as Array<{ name: string }>;

		const tableNames = existingTables.map(t => t.name);

		for (const table of requiredTables) {
			if (!tableNames.includes(table)) {
				console.error(`❌ Required table '${table}' not found`);
				return false;
			}
		}

		console.log('✅ Database validation passed');
		return true;
	} catch (error) {
		console.error('❌ Database validation failed:', error);
		return false;
	}
}

// CLI interface for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
	const command = process.argv[2];
	const dbPath = process.argv[3] || 'portfolio.db';

	switch (command) {
		case 'init':
			await initializeDatabase(dbPath);
			break;

		case 'reset':
			await resetDatabase(dbPath);
			break;

		case 'dev-data': {
			const db = new Database(dbPath);
			addDevelopmentData(db);
			db.close();
			break;
		}

		case 'validate': {
			const validateDb = new Database(dbPath);
			const isValid = validateDatabase(validateDb);
			validateDb.close();
			process.exit(isValid ? 0 : 1);
			break;
		}

		default:
			console.log(`
Usage: node init.js <command> [dbPath]

Commands:
  init      Initialize database with schema and seed data
  reset     Reset database (drop and recreate all tables)  
  dev-data  Add additional development/test data
  validate  Validate database integrity

Examples:
  node init.js init
  node init.js init ./data/portfolio.db
  node init.js reset
  node init.js dev-data
  node init.js validate
			`);
			break;
	}
}
