import { getDatabase } from './db.js';
import type {
	CreateProjectInput,
	PaginatedResponse,
	Project,
	ProjectFilters,
	Skill,
	UpdateProjectInput
} from './types.js';

/**
 * Project Data Access Object
 */
export class ProjectDAO {
	private db = getDatabase();

	/**
	 * Get all projects with optional filters
	 */
	getAll(filters: ProjectFilters = {}): PaginatedResponse<Project> {
		const {
			status,
			featured,
			skill_slug,
			search,
			limit = 10,
			offset = 0,
			order_by = 'created_at',
			order_direction = 'DESC'
		} = filters;

		let whereClause = '1=1';
		const params: (string | number)[] = [];

		if (status) {
			whereClause += ' AND p.status = ?';
			params.push(status);
		}

		if (featured !== undefined) {
			whereClause += ' AND p.featured = ?';
			params.push(featured ? 1 : 0);
		}

		if (skill_slug) {
			whereClause += ` AND EXISTS (
				SELECT 1 FROM project_skills ps 
				JOIN skills s ON ps.skill_id = s.id 
				WHERE ps.project_id = p.id AND s.name = ?
			)`;
			params.push(skill_slug);
		}

		if (search) {
			whereClause += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.long_description LIKE ?)';
			const searchPattern = `%${search}%`;
			params.push(searchPattern, searchPattern, searchPattern);
		}

		// Get total count
		const countQuery = `
			SELECT COUNT(*) as total
			FROM projects p
			WHERE ${whereClause}
		`;
		const { total } = this.db.prepare(countQuery).get(...params) as { total: number };

		// Get projects
		const query = `
			SELECT p.*
			FROM projects p
			WHERE ${whereClause}
			ORDER BY p.${order_by} ${order_direction}
			LIMIT ? OFFSET ?
		`;

		const projects = this.db.prepare(query).all(...params, limit, offset) as Project[];

		// Attach skills to each project
		for (const project of projects) {
			project.skills = this.getProjectSkills(project.id);
		}

		const page = Math.floor(offset / limit) + 1;
		const total_pages = Math.ceil(total / limit);

		return {
			data: projects,
			total,
			page,
			per_page: limit,
			total_pages,
			has_next: page < total_pages,
			has_prev: page > 1
		};
	}

	/**
	 * Get project by ID
	 */
	getById(id: number): Project | null {
		const project = this.db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as
			| Project
			| undefined;
		if (project) {
			project.skills = this.getProjectSkills(project.id);
		}
		return project || null;
	}

	/**
	 * Get project by slug
	 */
	getBySlug(slug: string): Project | null {
		const project = this.db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as
			| Project
			| undefined;
		if (project) {
			project.skills = this.getProjectSkills(project.id);
		}
		return project || null;
	}

	/**
	 * Create new project
	 */
	create(input: CreateProjectInput): Project {
		const {
			title,
			slug,
			description,
			long_description,
			github_url,
			demo_url,
			status = 'planning',
			featured = false,
			start_date,
			end_date,
			meta_description,
			image_url,
			skill_ids = []
		} = input;

		const insertProject = this.db.prepare(`
			INSERT INTO projects (
				title, slug, description, long_description, github_url, demo_url,
				status, featured, start_date, end_date, meta_description, image_url
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const result = insertProject.run(
			title,
			slug,
			description,
			long_description,
			github_url,
			demo_url,
			status,
			featured ? 1 : 0,
			start_date,
			end_date,
			meta_description,
			image_url
		);

		const projectId = result.lastInsertRowid as number;

		// Associate skills
		if (skill_ids.length > 0) {
			this.updateProjectSkills(projectId, skill_ids);
		}

		return this.getById(projectId)!;
	}

	/**
	 * Update project
	 */
	update(input: UpdateProjectInput): Project | null {
		const { id, skill_ids, ...updateData } = input;

		const fields = Object.keys(updateData).filter(
			key => updateData[key as keyof typeof updateData] !== undefined
		);
		if (fields.length === 0 && !skill_ids) {
			return this.getById(id);
		}

		if (fields.length > 0) {
			const setClause = fields.map(field => `${field} = ?`).join(', ');
			const values = fields.map(field => updateData[field as keyof typeof updateData]);

			const updateQuery = `UPDATE projects SET ${setClause} WHERE id = ?`;
			this.db.prepare(updateQuery).run(...values, id);
		}

		// Update skills if provided
		if (skill_ids) {
			this.updateProjectSkills(id, skill_ids);
		}

		return this.getById(id);
	}

	/**
	 * Delete project
	 */
	delete(id: number): boolean {
		const result = this.db.prepare('DELETE FROM projects WHERE id = ?').run(id);
		return result.changes > 0;
	}

	/**
	 * Get featured projects
	 */
	getFeatured(limit = 3): Project[] {
		const projects = this.db
			.prepare(
				`
			SELECT * FROM projects 
			WHERE featured = 1 
			ORDER BY created_at DESC 
			LIMIT ?
		`
			)
			.all(limit) as Project[];

		for (const project of projects) {
			project.skills = this.getProjectSkills(project.id);
		}

		return projects;
	}

	/**
	 * Get projects by status
	 */
	getByStatus(status: Project['status'], limit?: number): Project[] {
		const query = limit
			? 'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC LIMIT ?'
			: 'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC';

		const params = limit ? [status, limit] : [status];
		const projects = this.db.prepare(query).all(...params) as Project[];

		for (const project of projects) {
			project.skills = this.getProjectSkills(project.id);
		}

		return projects;
	}

	/**
	 * Get skills for a specific project
	 */
	private getProjectSkills(projectId: number): Skill[] {
		return this.db
			.prepare(
				`
			SELECT s.* 
			FROM skills s
			JOIN project_skills ps ON s.id = ps.skill_id
			WHERE ps.project_id = ?
			ORDER BY s.name
		`
			)
			.all(projectId) as Skill[];
	}

	/**
	 * Update project skills
	 */
	private updateProjectSkills(projectId: number, skillIds: number[]): void {
		// Remove existing skills
		this.db.prepare('DELETE FROM project_skills WHERE project_id = ?').run(projectId);

		// Add new skills
		if (skillIds.length > 0) {
			const insertSkill = this.db.prepare(
				'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)'
			);
			for (const skillId of skillIds) {
				insertSkill.run(projectId, skillId);
			}
		}
	}
}
