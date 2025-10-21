// =============================================================================
// Database Module Exports
// =============================================================================

// Core database functions
export { getDatabase, initializeDatabase, closeDatabase, runMigrations } from './db.js';

// Data Access Objects
export { BlogPostDAO } from './blog-dao.js';
export { ProjectDAO } from './project-dao.js';
export { SkillDAO } from './skill-dao.js';

// Types
export type * from './types.js';

// Import classes for instantiation
import { BlogPostDAO } from './blog-dao.js';
import { ProjectDAO } from './project-dao.js';
import { SkillDAO } from './skill-dao.js';
import { initializeDatabase } from './db.js';

// =============================================================================
// Convenience Instances
// =============================================================================

// Pre-instantiated DAOs for easy importing
export const blogPostDAO = new BlogPostDAO();
export const projectDAO = new ProjectDAO();
export const skillDAO = new SkillDAO();

// =============================================================================
// Database Initialization Helper
// =============================================================================

/**
 * Initialize the database and return DAO instances
 * Call this once at application startup
 */
export function initializePortfolioDatabase() {
	try {
		initializeDatabase();
		console.log('✅ Portfolio database initialized successfully');

		return {
			blogPostDAO,
			projectDAO,
			skillDAO
		};
	} catch (error) {
		console.error('❌ Failed to initialize portfolio database:', error);
		throw error;
	}
}
