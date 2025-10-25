import { getDatabase } from './db.js';
import type {
	BlogPost,
	BlogPostFilters,
	CreateBlogPostInput,
	PaginatedResponse,
	Tag,
	UpdateBlogPostInput
} from './types.js';

/**
 * Blog Post Data Access Object
 */
export class BlogPostDAO {
	private db = getDatabase();

	/**
	 * Get all blog posts with optional filters
	 */
	getAll(filters: BlogPostFilters = {}): PaginatedResponse<BlogPost> {
		const {
			published,
			featured,
			tag_slug,
			search,
			limit = 10,
			offset = 0,
			order_by = 'created_at',
			order_direction = 'DESC'
		} = filters;

		let whereClause = '1=1';
		const params: (string | number)[] = [];

		if (published !== undefined) {
			whereClause += ' AND bp.published = ?';
			params.push(published ? 1 : 0);
		}

		if (featured !== undefined) {
			whereClause += ' AND bp.featured = ?';
			params.push(featured ? 1 : 0);
		}

		if (tag_slug) {
			whereClause +=
				' AND EXISTS (SELECT 1 FROM blog_post_tags bpt JOIN tags t ON bpt.tag_id = t.id WHERE bpt.post_id = bp.id AND t.slug = ?)';
			params.push(tag_slug);
		}

		if (search) {
			whereClause += ' AND (bp.title LIKE ? OR bp.excerpt LIKE ? OR bp.content LIKE ?)';
			const searchPattern = `%${search}%`;
			params.push(searchPattern, searchPattern, searchPattern);
		}

		// Get total count
		const countQuery = `
			SELECT COUNT(*) as total
			FROM blog_posts bp
			WHERE ${whereClause}
		`;
		const { total } = this.db.prepare(countQuery).get(...params) as { total: number };

		// Get posts
		const query = `
			SELECT bp.*
			FROM blog_posts bp
			WHERE ${whereClause}
			ORDER BY bp.${order_by} ${order_direction}
			LIMIT ? OFFSET ?
		`;

		const posts = this.db.prepare(query).all(...params, limit, offset) as BlogPost[];

		// Attach tags to each post
		for (const post of posts) {
			post.tags = this.getPostTags(post.id);
		}

		const page = Math.floor(offset / limit) + 1;
		const total_pages = Math.ceil(total / limit);

		return {
			data: posts,
			total,
			page,
			per_page: limit,
			total_pages,
			has_next: page < total_pages,
			has_prev: page > 1
		};
	}

	/**
	 * Get blog post by ID
	 */
	getById(id: number): BlogPost | null {
		const post = this.db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as
			| BlogPost
			| undefined;
		if (post) {
			post.tags = this.getPostTags(post.id);
		}
		return post || null;
	}

	/**
	 * Get blog post by slug
	 */
	getBySlug(slug: string): BlogPost | null {
		const post = this.db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug) as
			| BlogPost
			| undefined;
		if (post) {
			post.tags = this.getPostTags(post.id);
		}
		return post || null;
	}

	/**
	 * Create new blog post
	 */
	create(input: CreateBlogPostInput): BlogPost {
		const {
			title,
			slug,
			excerpt,
			content,
			author = 'Leechy',
			published = false,
			featured = false,
			published_at,
			meta_description,
			meta_keywords,
			reading_time,
			tag_ids = []
		} = input;

		const insertPost = this.db.prepare(`
			INSERT INTO blog_posts (
				title, slug, excerpt, content, author, published, featured,
				published_at, meta_description, meta_keywords, reading_time
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const result = insertPost.run(
			title,
			slug,
			excerpt,
			content,
			author,
			published ? 1 : 0,
			featured ? 1 : 0,
			published_at,
			meta_description,
			meta_keywords,
			reading_time
		);

		const postId = result.lastInsertRowid as number;

		// Associate tags
		if (tag_ids.length > 0) {
			this.updatePostTags(postId, tag_ids);
		}

		return this.getById(postId)!;
	}

	/**
	 * Update blog post
	 */
	update(input: UpdateBlogPostInput): BlogPost | null {
		const { id, tag_ids, ...updateData } = input;

		const fields = Object.keys(updateData).filter(
			key => updateData[key as keyof typeof updateData] !== undefined
		);
		if (fields.length === 0 && !tag_ids) {
			return this.getById(id);
		}

		if (fields.length > 0) {
			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => updateData[field as keyof typeof updateData]);

			const updateQuery = `UPDATE blog_posts SET ${setClause} WHERE id = ?`;
			this.db.prepare(updateQuery).run(...values, id);
		}

		// Update tags if provided
		if (tag_ids) {
			this.updatePostTags(id, tag_ids);
		}

		return this.getById(id);
	}

	/**
	 * Delete blog post
	 */
	delete(id: number): boolean {
		const result = this.db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
		return result.changes > 0;
	}

	/**
	 * Increment view count
	 */
	incrementViewCount(id: number): void {
		this.db.prepare('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?').run(id);
	}

	/**
	 * Get featured posts
	 */
	getFeatured(limit = 3): BlogPost[] {
		const posts = this.db
			.prepare(
				`
			SELECT * FROM blog_posts 
			WHERE published = 1 AND featured = 1 
			ORDER BY published_at DESC 
			LIMIT ?
		`
			)
			.all(limit) as BlogPost[];

		for (const post of posts) {
			post.tags = this.getPostTags(post.id);
		}

		return posts;
	}

	/**
	 * Get recent posts
	 */
	getRecent(limit = 5): BlogPost[] {
		const posts = this.db
			.prepare(
				`
			SELECT * FROM blog_posts 
			WHERE published = 1 
			ORDER BY published_at DESC 
			LIMIT ?
		`
			)
			.all(limit) as BlogPost[];

		for (const post of posts) {
			post.tags = this.getPostTags(post.id);
		}

		return posts;
	}

	/**
	 * Get tags for a specific post
	 */
	private getPostTags(postId: number): Tag[] {
		return this.db
			.prepare(
				`
			SELECT t.* 
			FROM tags t
			JOIN blog_post_tags bpt ON t.id = bpt.tag_id
			WHERE bpt.post_id = ?
			ORDER BY t.name
		`
			)
			.all(postId) as Tag[];
	}

	/**
	 * Update post tags
	 */
	private updatePostTags(postId: number, tagIds: number[]): void {
		// Remove existing tags
		this.db.prepare('DELETE FROM blog_post_tags WHERE post_id = ?').run(postId);

		// Add new tags
		if (tagIds.length > 0) {
			const insertTag = this.db.prepare(
				'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)'
			);
			for (const tagId of tagIds) {
				insertTag.run(postId, tagId);
			}
		}
	}
}
