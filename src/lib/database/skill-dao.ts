import { getDatabase } from './db.js';
import type { CreateSkillInput, Skill, SkillFilters, UpdateSkillInput } from './types.js';

/**
 * Skill Data Access Object
 */
export class SkillDAO {
	private db = getDatabase();

	/**
	 * Get all skills with optional filters
	 */
	getAll(filters: SkillFilters = {}): Skill[] {
		const {
			category,
			min_proficiency,
			search,
			order_by = 'name',
			order_direction = 'ASC'
		} = filters;

		let whereClause = '1=1';
		const params: (string | number)[] = [];

		if (category) {
			whereClause += ' AND category = ?';
			params.push(category);
		}

		if (min_proficiency) {
			whereClause += ' AND proficiency >= ?';
			params.push(min_proficiency);
		}

		if (search) {
			whereClause += ' AND (name LIKE ? OR description LIKE ?)';
			const searchPattern = `%${search}%`;
			params.push(searchPattern, searchPattern);
		}

		const query = `
			SELECT * FROM skills
			WHERE ${whereClause}
			ORDER BY ${order_by} ${order_direction}
		`;

		return this.db.prepare(query).all(...params) as Skill[];
	}

	/**
	 * Get skill by ID
	 */
	getById(id: number): Skill | null {
		const skill = this.db.prepare('SELECT * FROM skills WHERE id = ?').get(id) as Skill | undefined;
		return skill || null;
	}

	/**
	 * Get skill by name
	 */
	getByName(name: string): Skill | null {
		const skill = this.db.prepare('SELECT * FROM skills WHERE name = ?').get(name) as
			| Skill
			| undefined;
		return skill || null;
	}

	/**
	 * Create new skill
	 */
	create(input: CreateSkillInput): Skill {
		const { name, category, proficiency, description, icon_url } = input;

		const insertSkill = this.db.prepare(`
			INSERT INTO skills (name, category, proficiency, description, icon_url)
			VALUES (?, ?, ?, ?, ?)
		`);

		const result = insertSkill.run(name, category, proficiency, description, icon_url);
		const skillId = result.lastInsertRowid as number;

		return this.getById(skillId)!;
	}

	/**
	 * Update skill
	 */
	update(input: UpdateSkillInput): Skill | null {
		const { id, ...updateData } = input;

		const fields = Object.keys(updateData).filter(
			key => updateData[key as keyof typeof updateData] !== undefined
		);
		if (fields.length === 0) {
			return this.getById(id);
		}

		const setClause = fields.map(field => `${field} = ?`).join(', ');
		const values = fields.map(field => updateData[field as keyof typeof updateData]);

		const updateQuery = `UPDATE skills SET ${setClause} WHERE id = ?`;
		this.db.prepare(updateQuery).run(...values, id);

		return this.getById(id);
	}

	/**
	 * Delete skill
	 */
	delete(id: number): boolean {
		const result = this.db.prepare('DELETE FROM skills WHERE id = ?').run(id);
		return result.changes > 0;
	}

	/**
	 * Get skills by category
	 */
	getByCategory(category: string): Skill[] {
		return this.db
			.prepare(
				`
			SELECT * FROM skills 
			WHERE category = ? 
			ORDER BY proficiency DESC, name ASC
		`
			)
			.all(category) as Skill[];
	}

	/**
	 * Get all categories
	 */
	getCategories(): string[] {
		const result = this.db
			.prepare(
				`
			SELECT DISTINCT category FROM skills 
			ORDER BY category
		`
			)
			.all() as { category: string }[];

		return result.map(row => row.category);
	}

	/**
	 * Get top skills by proficiency
	 */
	getTopSkills(limit = 5): Skill[] {
		return this.db
			.prepare(
				`
			SELECT * FROM skills 
			ORDER BY proficiency DESC, name ASC 
			LIMIT ?
		`
			)
			.all(limit) as Skill[];
	}
}
