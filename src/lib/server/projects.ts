import type Database from 'better-sqlite3';
import { type Project, getDatabase } from './database.js';

// Database row interface
interface ProjectRow {
  id: number;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image_url?: string;
  technologies: string; // JSON string
  github_url?: string;
  demo_url?: string;
  repository_url?: string;
  status: string;
  featured: number; // SQLite boolean as integer
  start_date?: string;
  completion_date?: string;
  challenges?: string; // JSON string
  solutions?: string; // JSON string
  skills_demonstrated?: string; // JSON string
  meta_description?: string;
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
			SELECT id, title, slug, description, content, image_url, technologies, 
			       github_url, demo_url, repository_url, status, featured, 
			       start_date, completion_date, challenges, solutions, skills_demonstrated,
			       meta_description, created_at, updated_at
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
			SELECT id, title, slug, description, content, image_url, technologies, 
			       github_url, demo_url, repository_url, status, featured, 
			       start_date, completion_date, challenges, solutions, skills_demonstrated,
			       meta_description, created_at, updated_at
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
			SELECT id, title, slug, description, content, image_url, technologies, 
			       github_url, demo_url, repository_url, status, featured, 
			       start_date, completion_date, challenges, solutions, skills_demonstrated,
			       meta_description, created_at, updated_at
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
			INSERT INTO projects (
				title, slug, description, content, image_url, technologies, 
				github_url, demo_url, repository_url, status, featured,
				start_date, completion_date, challenges, solutions, skills_demonstrated,
				meta_description
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

    const result = stmt.run(
      projectData.title,
      projectData.slug,
      projectData.description,
      projectData.content || null,
      projectData.image_url || null,
      JSON.stringify(projectData.technologies),
      projectData.github_url || null,
      projectData.demo_url || null,
      projectData.repository_url || null,
      projectData.status,
      projectData.featured ? 1 : 0,
      projectData.start_date || null,
      projectData.completion_date || null,
      projectData.challenges ? JSON.stringify(projectData.challenges) : null,
      projectData.solutions ? JSON.stringify(projectData.solutions) : null,
      projectData.skills_demonstrated ? JSON.stringify(projectData.skills_demonstrated) : null,
      projectData.meta_description || null
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
      throw new Error(`Project with id ${id} not found`);
    }

    const stmt = this.db.prepare(`
			UPDATE projects 
			SET title = ?, slug = ?, description = ?, content = ?, image_url = ?, 
			    technologies = ?, github_url = ?, demo_url = ?, repository_url = ?, 
			    status = ?, featured = ?, start_date = ?, completion_date = ?,
			    challenges = ?, solutions = ?, skills_demonstrated = ?, meta_description = ?
			WHERE id = ?
		`);

    stmt.run(
      projectData.title ?? currentProject.title,
      projectData.slug ?? currentProject.slug,
      projectData.description ?? currentProject.description,
      projectData.content ?? currentProject.content,
      projectData.image_url ?? currentProject.image_url,
      JSON.stringify(projectData.technologies ?? currentProject.technologies),
      projectData.github_url ?? currentProject.github_url,
      projectData.demo_url ?? currentProject.demo_url,
      projectData.repository_url ?? currentProject.repository_url,
      projectData.status ?? currentProject.status,
      (projectData.featured ?? currentProject.featured) ? 1 : 0,
      projectData.start_date ?? currentProject.start_date,
      projectData.completion_date ?? currentProject.completion_date,
      projectData.challenges
        ? JSON.stringify(projectData.challenges)
        : currentProject.challenges
          ? JSON.stringify(currentProject.challenges)
          : null,
      projectData.solutions
        ? JSON.stringify(projectData.solutions)
        : currentProject.solutions
          ? JSON.stringify(currentProject.solutions)
          : null,
      projectData.skills_demonstrated
        ? JSON.stringify(projectData.skills_demonstrated)
        : currentProject.skills_demonstrated
          ? JSON.stringify(currentProject.skills_demonstrated)
          : null,
      projectData.meta_description ?? currentProject.meta_description,
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
			SELECT id, title, slug, description, content, image_url, technologies, 
			       github_url, demo_url, repository_url, status, featured, 
			       start_date, completion_date, challenges, solutions, skills_demonstrated,
			       meta_description, created_at, updated_at
			FROM projects 
			WHERE title LIKE ? OR description LIKE ? OR technologies LIKE ? OR challenges LIKE ? OR solutions LIKE ?
			ORDER BY created_at DESC
		`);

    const searchTerm = `%${query}%`;
    const rows = stmt.all(
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm
    ) as ProjectRow[];
    return rows.map(this.parseProject);
  }

  /**
   * Get projects by status
   */
  getProjectsByStatus(status: Project['status']): Project[] {
    const stmt = this.db.prepare(`
			SELECT id, title, slug, description, content, image_url, technologies, 
			       github_url, demo_url, repository_url, status, featured, 
			       start_date, completion_date, challenges, solutions, skills_demonstrated,
			       meta_description, created_at, updated_at
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
    const project: Project = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      content: row.content || undefined,
      image_url: row.image_url || undefined,
      technologies: JSON.parse(row.technologies || '[]'),
      github_url: row.github_url || undefined,
      demo_url: row.demo_url || undefined,
      repository_url: row.repository_url || undefined,
      status: row.status as Project['status'],
      featured: Boolean(row.featured),
      start_date: row.start_date || undefined,
      completion_date: row.completion_date || undefined,
      challenges: row.challenges ? JSON.parse(row.challenges) : undefined,
      solutions: row.solutions ? JSON.parse(row.solutions) : undefined,
      skills_demonstrated: row.skills_demonstrated
        ? JSON.parse(row.skills_demonstrated)
        : undefined,
      meta_description: row.meta_description || undefined,
      created_at: row.created_at,
      updated_at: row.updated_at
    };

    // Add computed properties for backward compatibility
    project.imageUrl = project.image_url;
    project.githubUrl = project.github_url;
    project.demoUrl = project.demo_url;
    project.skillsDemonstrated = project.skills_demonstrated;
    project.startDate = project.start_date ? new Date(project.start_date) : undefined;
    project.completionDate = project.completion_date
      ? new Date(project.completion_date)
      : undefined;

    return project;
  }
}

// Export singleton instance
export const projectService = new ProjectService();
