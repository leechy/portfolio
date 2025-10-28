import type Database from 'better-sqlite3';
import { type Project, getDatabase } from './database.js';

// Database row interface
interface ProjectRow {
  id: number;
  title: string;
  description: string;
  content: string | null;
  image: string | null;
  technologies: string;
  github_url: string | null;
  live_url: string | null;
  status: string;
  featured: number;
  created_at: string;
  updated_at: string;
}

/**
 * Project service for database operations
 */
export class ProjectService {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    const stmt = this.db.prepare(`
			SELECT id, title, description, content, image, technologies, 
			       github_url, live_url, status, featured, created_at, updated_at
			FROM projects 
			ORDER BY created_at DESC
		`);

    const rows = stmt.all() as ProjectRow[];
    return rows.map(this.parseProject);
  }

  /**
   * Get featured projects
   */
  getFeaturedProjects(): Project[] {
    const stmt = this.db.prepare(`
			SELECT id, title, description, content, image, technologies, 
			       github_url, live_url, status, featured, created_at, updated_at
			FROM projects 
			WHERE featured = 1 
			ORDER BY created_at DESC
		`);

    const rows = stmt.all() as ProjectRow[];
    return rows.map(this.parseProject);
  }

  /**
   * Get project by ID
   */
  getProjectById(id: number): Project | null {
    const stmt = this.db.prepare(`
			SELECT id, title, description, content, image, technologies, 
			       github_url, live_url, status, featured, created_at, updated_at
			FROM projects 
			WHERE id = ?
		`);

    const row = stmt.get(id) as ProjectRow | undefined;
    return row ? this.parseProject(row) : null;
  }

  /**
   * Create new project
   */
  createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const stmt = this.db.prepare(`
			INSERT INTO projects (title, description, content, image, technologies, 
			                     github_url, live_url, status, featured)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

    const result = stmt.run(
      projectData.title,
      projectData.description,
      projectData.content || null,
      projectData.image || null,
      JSON.stringify(projectData.technologies),
      projectData.github_url || null,
      projectData.live_url || null,
      projectData.status,
      projectData.featured ? 1 : 0
    );

    const newProject = this.getProjectById(result.lastInsertRowid as number);
    if (!newProject) {
      throw new Error('Failed to create project');
    }

    return newProject;
  }

  /**
   * Update existing project
   */
  updateProject(
    id: number,
    projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
  ): Project {
    const currentProject = this.getProjectById(id);
    if (!currentProject) {
      throw new Error('Project not found');
    }

    const stmt = this.db.prepare(`
			UPDATE projects 
			SET title = ?, description = ?, content = ?, image = ?, technologies = ?, 
			    github_url = ?, live_url = ?, status = ?, featured = ?
			WHERE id = ?
		`);

    stmt.run(
      projectData.title ?? currentProject.title,
      projectData.description ?? currentProject.description,
      projectData.content ?? currentProject.content,
      projectData.image ?? currentProject.image,
      JSON.stringify(projectData.technologies ?? currentProject.technologies),
      projectData.github_url ?? currentProject.github_url,
      projectData.live_url ?? currentProject.live_url,
      projectData.status ?? currentProject.status,
      (projectData.featured ?? currentProject.featured) ? 1 : 0,
      id
    );

    const updatedProject = this.getProjectById(id);
    if (!updatedProject) {
      throw new Error('Failed to update project');
    }

    return updatedProject;
  }

  /**
   * Delete project
   */
  deleteProject(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Search projects
   */
  searchProjects(query: string): Project[] {
    const stmt = this.db.prepare(`
			SELECT id, title, description, content, image, technologies, 
			       github_url, live_url, status, featured, created_at, updated_at
			FROM projects 
			WHERE title LIKE ? OR description LIKE ? OR technologies LIKE ?
			ORDER BY created_at DESC
		`);

    const searchTerm = `%${query}%`;
    const rows = stmt.all(searchTerm, searchTerm, searchTerm) as ProjectRow[];
    return rows.map(this.parseProject);
  }

  /**
   * Get projects by status
   */
  getProjectsByStatus(status: Project['status']): Project[] {
    const stmt = this.db.prepare(`
			SELECT id, title, description, content, image, technologies, 
			       github_url, live_url, status, featured, created_at, updated_at
			FROM projects 
			WHERE status = ?
			ORDER BY created_at DESC
		`);

    const rows = stmt.all(status) as ProjectRow[];
    return rows.map(this.parseProject);
  }

  /**
   * Parse database row to Project object
   */
  private parseProject(row: ProjectRow): Project {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content || undefined,
      image: row.image || undefined,
      technologies: JSON.parse(row.technologies || '[]'),
      github_url: row.github_url || undefined,
      live_url: row.live_url || undefined,
      status: row.status as Project['status'],
      featured: Boolean(row.featured),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

// Export singleton instance
export const projectService = new ProjectService();
