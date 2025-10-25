import Database from 'better-sqlite3';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

// Database file path
const DB_PATH = process.env.DATABASE_PATH || './data/portfolio.db';

// Initialize database connection
let db: Database.Database | null = null;

/**
 * Get database connection (singleton pattern)
 */
export function getDatabase(): Database.Database {
	if (!db) {
		try {
			// Ensure data directory exists
			const dataDir = dirname(DB_PATH);
			if (!existsSync(dataDir)) {
				mkdirSync(dataDir, { recursive: true });
			}

			// Create database connection
			db = new Database(DB_PATH);

			// Enable WAL mode for better performance
			db.pragma('journal_mode = WAL');

			// Enable foreign keys
			db.pragma('foreign_keys = ON');

			console.log(`Database connected: ${DB_PATH}`);
		} catch (error) {
			console.error('Failed to connect to database:', error);
			throw error;
		}
	}
	return db;
}

/**
 * Initialize database schema
 */
export function initializeDatabase(): void {
	try {
		const db = getDatabase();

		// Read and execute schema
		const schemaPath = join(__dirname, 'schema.sql');
		const schema = readFileSync(schemaPath, 'utf-8');

		// Execute schema (split by semicolon and execute each statement)
		const statements = schema
			.split(';')
			.map(stmt => stmt.trim())
			.filter(stmt => stmt.length > 0);

		for (const statement of statements) {
			db.exec(statement);
		}

		console.log('Database schema initialized successfully');

		// Insert default site configuration if it doesn't exist
		initializeDefaultData();
	} catch (error) {
		console.error('Failed to initialize database:', error);
		throw error;
	}
}

/**
 * Insert default data
 */
function initializeDefaultData(): void {
	const db = getDatabase();

	// Check if site config exists
	const existingConfig = db.prepare('SELECT id FROM site_config WHERE id = 1').get();

	if (!existingConfig) {
		const insertConfig = db.prepare(`
			INSERT INTO site_config (
				id, site_title, site_description, site_url, author_name, author_bio
			) VALUES (
				1, 
				'Leechy.dev', 
				'Portfolio of a passionate developer building innovative web solutions',
				'https://leechy.dev',
				'Leechy',
				'A passionate developer with expertise in modern web technologies, focusing on creating clean, efficient, and user-friendly applications.'
			)
		`);

		insertConfig.run();
		console.log('Default site configuration inserted');
	}

	// Insert some default skills if none exist
	const existingSkills = db.prepare('SELECT COUNT(*) as count FROM skills').get() as {
		count: number;
	};

	if (existingSkills.count === 0) {
		const insertSkill = db.prepare(`
			INSERT INTO skills (name, category, proficiency, description) 
			VALUES (?, ?, ?, ?)
		`);

		const defaultSkills = [
			[
				'JavaScript',
				'frontend',
				5,
				'Modern JavaScript (ES6+) with deep understanding of language features'
			],
			[
				'TypeScript',
				'frontend',
				5,
				'Type-safe JavaScript development with advanced type system knowledge'
			],
			['SvelteKit', 'frontend', 4, 'Full-stack web framework with SSR/SSG capabilities'],
			[
				'Node.js',
				'backend',
				4,
				'Server-side JavaScript runtime for building scalable applications'
			],
			['SQLite', 'database', 4, 'Lightweight, serverless database for web applications'],
			['Git', 'tool', 5, 'Version control system for tracking code changes and collaboration'],
			['CSS/SCSS', 'frontend', 4, 'Modern styling with preprocessors and responsive design'],
			['HTML', 'frontend', 5, 'Semantic markup and web standards']
		];

		for (const skill of defaultSkills) {
			insertSkill.run(...skill);
		}

		console.log('Default skills inserted');
	}
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
	if (db) {
		db.close();
		db = null;
		console.log('Database connection closed');
	}
}

/**
 * Run database migrations (for future use)
 */
export function runMigrations(): void {
	// Placeholder for future migration system
	console.log('No migrations to run');
}

// Graceful shutdown
process.on('SIGINT', () => {
	closeDatabase();
	process.exit(0);
});

process.on('SIGTERM', () => {
	closeDatabase();
	process.exit(0);
});
