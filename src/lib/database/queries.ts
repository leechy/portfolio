import { getDatabase } from './db.js';
import type {
  BlogPost,
  ContactSubmission,
  DatabaseStats,
  Project,
  SiteConfig,
  Skill,
  Tag
} from './types.js';

/**
 * Common database query functions used across the application
 */

/**
 * Get site configuration
 */
export function getSiteConfig(): SiteConfig | null {
  const db = getDatabase();
  return db.prepare('SELECT * FROM site_config WHERE id = 1').get() as SiteConfig | null;
}

/**
 * Update site configuration
 */
export function updateSiteConfig(config: Partial<SiteConfig>): void {
  const db = getDatabase();
  const fields = Object.keys(config).filter(key => config[key as keyof SiteConfig] !== undefined);

  if (fields.length > 0) {
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => config[field as keyof SiteConfig]);

    db.prepare(`UPDATE site_config SET ${setClause} WHERE id = 1`).run(...values);
  }
}

/**
 * Get all published blog posts (for homepage, RSS, etc.)
 */
export function getPublishedBlogPosts(limit?: number): BlogPost[] {
  const db = getDatabase();
  const query = limit
    ? 'SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC LIMIT ?'
    : 'SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_at DESC';

  const params = limit ? [limit] : [];
  return db.prepare(query).all(...params) as BlogPost[];
}

/**
 * Get featured blog posts
 */
export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT * FROM blog_posts 
		WHERE published = 1 AND featured = 1 
		ORDER BY published_at DESC 
		LIMIT ?
	`
    )
    .all(limit) as BlogPost[];
}

/**
 * Get all featured projects
 */
export function getFeaturedProjects(limit = 3): Project[] {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT * FROM projects 
		WHERE featured = 1 
		ORDER BY created_at DESC 
		LIMIT ?
	`
    )
    .all(limit) as Project[];
}

/**
 * Get all completed projects
 */
export function getCompletedProjects(limit?: number): Project[] {
  const db = getDatabase();
  const query = limit
    ? 'SELECT * FROM projects WHERE status = "completed" ORDER BY end_date DESC, created_at DESC LIMIT ?'
    : 'SELECT * FROM projects WHERE status = "completed" ORDER BY end_date DESC, created_at DESC';

  const params = limit ? [limit] : [];
  return db.prepare(query).all(...params) as Project[];
}

/**
 * Get all skills grouped by category
 */
export function getSkillsByCategory(): Record<string, Skill[]> {
  const db = getDatabase();
  const skills = db
    .prepare(
      `
		SELECT * FROM skills 
		ORDER BY category, proficiency DESC, name
	`
    )
    .all() as Skill[];

  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );
}

/**
 * Get top skills by proficiency level
 */
export function getTopSkills(minProficiency = 4, limit = 10): Skill[] {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT * FROM skills 
		WHERE proficiency >= ? 
		ORDER BY proficiency DESC, name 
		LIMIT ?
	`
    )
    .all(minProficiency, limit) as Skill[];
}

/**
 * Get all tags with post counts
 */
export function getTagsWithCounts(): Array<Tag & { post_count: number }> {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT t.*, COUNT(bpt.post_id) as post_count
		FROM tags t
		LEFT JOIN blog_post_tags bpt ON t.id = bpt.tag_id
		LEFT JOIN blog_posts bp ON bpt.post_id = bp.id AND bp.published = 1
		GROUP BY t.id
		HAVING post_count > 0
		ORDER BY post_count DESC, t.name
	`
    )
    .all() as Array<Tag & { post_count: number }>;
}

/**
 * Get recent contact submissions
 */
export function getRecentContactSubmissions(limit = 10): ContactSubmission[] {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT * FROM contact_submissions 
		ORDER BY created_at DESC 
		LIMIT ?
	`
    )
    .all(limit) as ContactSubmission[];
}

/**
 * Get unread contact submissions count
 */
export function getUnreadContactCount(): number {
  const db = getDatabase();
  const result = db
    .prepare('SELECT COUNT(*) as count FROM contact_submissions WHERE status = "new"')
    .get() as { count: number };
  return result.count;
}

/**
 * Search across content (blog posts and projects)
 */
export function searchContent(
  query: string,
  limit = 20
): {
  blogPosts: BlogPost[];
  projects: Project[];
} {
  const db = getDatabase();
  const searchPattern = `%${query}%`;

  const blogPosts = db
    .prepare(
      `
		SELECT * FROM blog_posts 
		WHERE published = 1 
		AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
		ORDER BY 
			CASE 
				WHEN title LIKE ? THEN 1
				WHEN excerpt LIKE ? THEN 2
				ELSE 3
			END,
			published_at DESC
		LIMIT ?
	`
    )
    .all(
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      Math.floor(limit * 0.7)
    ) as BlogPost[];

  const projects = db
    .prepare(
      `
		SELECT * FROM projects 
		WHERE title LIKE ? OR description LIKE ? OR long_description LIKE ?
		ORDER BY 
			CASE 
				WHEN title LIKE ? THEN 1
				ELSE 2
			END,
			created_at DESC
		LIMIT ?
	`
    )
    .all(
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      Math.floor(limit * 0.3)
    ) as Project[];

  return { blogPosts, projects };
}

/**
 * Get database statistics for dashboard
 */
export function getDatabaseStats(): DatabaseStats {
  const db = getDatabase();

  // Blog post stats
  const blogStats = db
    .prepare(
      `
		SELECT 
			COUNT(*) as total,
			SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
			SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as drafts,
			SUM(CASE WHEN featured = 1 AND published = 1 THEN 1 ELSE 0 END) as featured
		FROM blog_posts
	`
    )
    .get() as { total: number; published: number; drafts: number; featured: number };

  // Project stats
  const projectStats = db
    .prepare(
      `
		SELECT 
			COUNT(*) as total,
			SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
			SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
			SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as planning,
			SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured
		FROM projects
	`
    )
    .get() as {
    total: number;
    completed: number;
    in_progress: number;
    planning: number;
    featured: number;
  };

  // Skill stats
  const skillStats = db
    .prepare(
      `
		SELECT 
			COUNT(*) as total,
			category,
			COUNT(*) as count
		FROM skills
		GROUP BY category
	`
    )
    .all() as Array<{ total: number; category: string; count: number }>;

  const skillsByCategory = skillStats.reduce(
    (acc, stat) => {
      acc[stat.category] = stat.count;
      return acc;
    },
    {} as Record<string, number>
  );

  // Contact stats
  const contactStats = db
    .prepare(
      `
		SELECT 
			COUNT(*) as total,
			SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as unread
		FROM contact_submissions
	`
    )
    .get() as { total: number; unread: number };

  return {
    blog_posts: {
      total: blogStats.total,
      published: blogStats.published,
      drafts: blogStats.drafts,
      featured: blogStats.featured
    },
    projects: {
      total: projectStats.total,
      completed: projectStats.completed,
      in_progress: projectStats.in_progress,
      planning: projectStats.planning,
      featured: projectStats.featured
    },
    skills: {
      total: skillStats.length > 0 ? skillStats[0].total : 0,
      by_category: skillsByCategory
    },
    contact_submissions: {
      total: contactStats.total,
      unread: contactStats.unread
    }
  };
}

/**
 * Get related content (projects and posts using similar skills/tags)
 */
export function getRelatedContent(
  itemId: number,
  itemType: 'blog' | 'project',
  limit = 3
): {
  relatedPosts: BlogPost[];
  relatedProjects: Project[];
} {
  const db = getDatabase();
  let relatedPosts: BlogPost[] = [];
  let relatedProjects: Project[] = [];

  if (itemType === 'blog') {
    // Get related posts by shared tags
    relatedPosts = db
      .prepare(
        `
			SELECT DISTINCT bp.* 
			FROM blog_posts bp
			JOIN blog_post_tags bpt ON bp.id = bpt.post_id
			WHERE bp.published = 1 
			AND bp.id != ?
			AND bpt.tag_id IN (
				SELECT tag_id FROM blog_post_tags WHERE post_id = ?
			)
			ORDER BY bp.published_at DESC
			LIMIT ?
		`
      )
      .all(itemId, itemId, limit) as BlogPost[];

    // Get related projects (this would need more complex logic with skill matching)
    relatedProjects = db
      .prepare(
        `
			SELECT * FROM projects 
			WHERE id != ? 
			ORDER BY created_at DESC 
			LIMIT ?
		`
      )
      .all(itemId, Math.min(limit, 2)) as Project[];
  } else {
    // Get related projects by shared skills
    relatedProjects = db
      .prepare(
        `
			SELECT DISTINCT p.* 
			FROM projects p
			JOIN project_skills ps ON p.id = ps.project_id
			WHERE p.id != ?
			AND ps.skill_id IN (
				SELECT skill_id FROM project_skills WHERE project_id = ?
			)
			ORDER BY p.created_at DESC
			LIMIT ?
		`
      )
      .all(itemId, itemId, limit) as Project[];

    // Get some recent blog posts
    relatedPosts = db
      .prepare(
        `
			SELECT * FROM blog_posts 
			WHERE published = 1 
			ORDER BY published_at DESC 
			LIMIT ?
		`
      )
      .all(Math.min(limit, 2)) as BlogPost[];
  }

  return { relatedPosts, relatedProjects };
}

/**
 * Increment view count for blog post
 */
export function incrementBlogPostViews(postId: number): void {
  const db = getDatabase();
  db.prepare('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?').run(postId);
}

/**
 * Get most viewed blog posts
 */
export function getMostViewedPosts(limit = 5): BlogPost[] {
  const db = getDatabase();
  return db
    .prepare(
      `
		SELECT * FROM blog_posts 
		WHERE published = 1 
		ORDER BY view_count DESC, published_at DESC 
		LIMIT ?
	`
    )
    .all(limit) as BlogPost[];
}
