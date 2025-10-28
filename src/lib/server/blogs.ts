import type Database from 'better-sqlite3';
import { type BlogPost, getDatabase } from './database.js';

// Database row interface
interface BlogPostRow {
	id: number;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	featured_image: string | null;
	category: string | null;
	tags: string;
	status: string;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Blog service for database operations
 */
export class BlogService {
	private db: Database.Database;

	constructor() {
		this.db = getDatabase();
	}

	/**
	 * Get all blog posts
	 */
	getAllBlogPosts(): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			ORDER BY created_at DESC
		`);

		const rows = stmt.all() as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Get published blog posts
	 */
	getPublishedBlogPosts(): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE status = 'published' AND published_at <= CURRENT_TIMESTAMP
			ORDER BY published_at DESC
		`);

		const rows = stmt.all() as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Get blog post by ID
	 */
	getBlogPostById(id: number): BlogPost | null {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE id = ?
		`);

		const row = stmt.get(id) as BlogPostRow | undefined;
		return row ? this.parseBlogPost(row) : null;
	}

	/**
	 * Get blog post by slug
	 */
	getBlogPostBySlug(slug: string): BlogPost | null {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE slug = ?
		`);

		const row = stmt.get(slug) as BlogPostRow | undefined;
		return row ? this.parseBlogPost(row) : null;
	}

	/**
	 * Create new blog post
	 */
	createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): BlogPost {
		const stmt = this.db.prepare(`
			INSERT INTO blog_posts (title, category, slug, content, excerpt, featured_image, tags, 
			                       status, published_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const result = stmt.run(
			postData.title,
			postData.category,
			postData.slug,
			postData.content,
			postData.excerpt || null,
			postData.featured_image || null,
			JSON.stringify(postData.tags),
			postData.status,
			postData.published_at || null
		);

		const newPost = this.getBlogPostById(result.lastInsertRowid as number);
		if (!newPost) {
			throw new Error('Failed to create blog post');
		}

		return newPost;
	}

	/**
	 * Update existing blog post
	 */
	updateBlogPost(
		id: number,
		postData: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>
	): BlogPost {
		const currentPost = this.getBlogPostById(id);
		if (!currentPost) {
			throw new Error('Blog post not found');
		}

		const stmt = this.db.prepare(`
			UPDATE blog_posts 
			SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, 
			    category = ?, tags = ?, status = ?, published_at = ?
			WHERE id = ?
		`);

		stmt.run(
			postData.title ?? currentPost.title,
			postData.slug ?? currentPost.slug,
			postData.content ?? currentPost.content,
			postData.excerpt ?? currentPost.excerpt,
			postData.featured_image ?? currentPost.featured_image,
			postData.category ?? currentPost.category,
			JSON.stringify(postData.tags ?? currentPost.tags),
			postData.status ?? currentPost.status,
			postData.published_at ?? currentPost.published_at,
			id
		);

		const updatedPost = this.getBlogPostById(id);
		if (!updatedPost) {
			throw new Error('Failed to update blog post');
		}

		return updatedPost;
	}

	/**
	 * Delete blog post
	 */
	deleteBlogPost(id: number): boolean {
		const stmt = this.db.prepare('DELETE FROM blog_posts WHERE id = ?');
		const result = stmt.run(id);
		return result.changes > 0;
	}

	/**
	 * Search blog posts
	 */
	searchBlogPosts(query: string): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE title LIKE ? OR content LIKE ? OR excerpt LIKE ? OR tags LIKE ?
			ORDER BY created_at DESC
		`);

		const searchTerm = `%${query}%`;
		const rows = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm) as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Get blog posts by status
	 */
	getBlogPostsByStatus(status: BlogPost['status']): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE status = ?
			ORDER BY created_at DESC
		`);

		const rows = stmt.all(status) as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Get blog posts by tag
	 */
	getBlogPostsByTag(tag: string): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE tags LIKE ?
			ORDER BY published_at DESC
		`);

		const rows = stmt.all(`%"${tag}"%`) as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Get recent blog posts
	 */
	getRecentBlogPosts(limit: number = 5): BlogPost[] {
		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at
			FROM blog_posts 
			WHERE status = 'published'
			ORDER BY published_at DESC
			LIMIT ?
		`);

		const rows = stmt.all(limit) as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Check if slug is available
	 */
	isSlugAvailable(slug: string, excludeId?: number): boolean {
		let stmt;
		let result;

		if (excludeId) {
			stmt = this.db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE slug = ? AND id != ?');
			result = stmt.get(slug, excludeId) as { count: number };
		} else {
			stmt = this.db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE slug = ?');
			result = stmt.get(slug) as { count: number };
		}

		return result.count === 0;
	}

	/**
	 * Get related blog posts by shared tags
	 */
	getRelatedBlogPosts(blogId: number, limit = 3): BlogPost[] {
		// First get the current blog post to check its tags
		const currentPost = this.getBlogPostById(blogId);
		if (!currentPost || !currentPost.tags.length) {
			return [];
		}

		// Create placeholders for the tags query
		const tagPlaceholders = currentPost.tags.map(() => '?').join(',');

		const stmt = this.db.prepare(`
			SELECT id, title, slug, content, excerpt, featured_image, category, tags, 
			       status, published_at, created_at, updated_at,
			       (
			         SELECT COUNT(*)
			         FROM json_each(tags) je
			         WHERE je.value IN (${tagPlaceholders})
			       ) as shared_tags_count
			FROM blog_posts 
			WHERE id != ? 
			  AND status = 'published'
			  AND shared_tags_count > 0
			ORDER BY shared_tags_count DESC, published_at DESC
			LIMIT ?
		`);

		const rows = stmt.all(...currentPost.tags, blogId, limit) as BlogPostRow[];
		return rows.map(this.parseBlogPost);
	}

	/**
	 * Generate unique slug from title
	 */
	generateSlug(title: string, excludeId?: number): string {
		const baseSlug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+|-+$/g, '');

		let slug = baseSlug;
		let counter = 1;

		while (!this.isSlugAvailable(slug, excludeId)) {
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		return slug;
	}

	/**
	 * Parse database row to BlogPost object
	 */
	private parseBlogPost(row: BlogPostRow): BlogPost {
		return {
			id: row.id,
			title: row.title,
			slug: row.slug,
			content: row.content,
			excerpt: row.excerpt || undefined,
			featured_image: row.featured_image || undefined,
			category: row.category || undefined,
			tags: JSON.parse(row.tags || '[]'),
			status: row.status as BlogPost['status'],
			published_at: row.published_at || undefined,
			created_at: row.created_at,
			updated_at: row.updated_at
		};
	}
}

// Export singleton instance
export const blogService = new BlogService();
