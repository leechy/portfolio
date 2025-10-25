// =============================================================================
// Database Types and Interfaces
// =============================================================================

export interface BlogPost {
	id: number;
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	author: string;
	published: boolean;
	featured: boolean;
	created_at: string;
	updated_at: string;
	published_at?: string;
	meta_description?: string;
	meta_keywords?: string;
	reading_time?: number;
	view_count: number;
	tags?: Tag[];
}

export interface Project {
	id: number;
	title: string;
	slug: string;
	description?: string;
	long_description?: string;
	github_url?: string;
	demo_url?: string;
	status: 'planning' | 'in-progress' | 'completed' | 'archived';
	featured: boolean;
	created_at: string;
	updated_at: string;
	start_date?: string;
	end_date?: string;
	meta_description?: string;
	image_url?: string;
	skills?: Skill[];
}

export interface Skill {
	id: number;
	name: string;
	category: string;
	proficiency: number; // 1-5 scale
	description?: string;
	icon_url?: string;
	created_at: string;
}

export interface Tag {
	id: number;
	name: string;
	slug: string;
	description?: string;
	created_at: string;
}

export interface SiteConfig {
	id: number;
	site_title: string;
	site_description: string;
	site_url: string;
	author_name: string;
	author_email?: string;
	author_bio?: string;
	social_github?: string;
	social_linkedin?: string;
	social_twitter?: string;
	analytics_id?: string;
	updated_at: string;
}

export interface ContactSubmission {
	id: number;
	name: string;
	email: string;
	subject?: string;
	message: string;
	status: 'new' | 'read' | 'replied' | 'archived';
	ip_address?: string;
	user_agent?: string;
	created_at: string;
	updated_at: string;
}

// =============================================================================
// Input Types for Creating/Updating Records
// =============================================================================

export interface CreateBlogPostInput {
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	author?: string;
	published?: boolean;
	featured?: boolean;
	published_at?: string;
	meta_description?: string;
	meta_keywords?: string;
	reading_time?: number;
	tag_ids?: number[];
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
	id: number;
}

export interface CreateProjectInput {
	title: string;
	slug: string;
	description?: string;
	long_description?: string;
	github_url?: string;
	demo_url?: string;
	status?: Project['status'];
	featured?: boolean;
	start_date?: string;
	end_date?: string;
	meta_description?: string;
	image_url?: string;
	skill_ids?: number[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
	id: number;
}

export interface CreateSkillInput {
	name: string;
	category: string;
	proficiency: number;
	description?: string;
	icon_url?: string;
}

export interface UpdateSkillInput extends Partial<CreateSkillInput> {
	id: number;
}

export interface CreateTagInput {
	name: string;
	slug: string;
	description?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
	id: number;
}

export interface CreateContactSubmissionInput {
	name: string;
	email: string;
	subject?: string;
	message: string;
	ip_address?: string;
	user_agent?: string;
}

export interface UpdateContactSubmissionInput {
	id: number;
	status: ContactSubmission['status'];
}

export interface UpdateSiteConfigInput extends Partial<Omit<SiteConfig, 'id' | 'updated_at'>> {
	id: 1;
}

// =============================================================================
// Query Types and Filters
// =============================================================================

export interface BlogPostFilters {
	published?: boolean;
	featured?: boolean;
	tag_slug?: string;
	search?: string;
	limit?: number;
	offset?: number;
	order_by?: 'created_at' | 'published_at' | 'title' | 'view_count';
	order_direction?: 'ASC' | 'DESC';
}

export interface ProjectFilters {
	status?: Project['status'];
	featured?: boolean;
	skill_slug?: string;
	search?: string;
	limit?: number;
	offset?: number;
	order_by?: 'created_at' | 'title' | 'start_date';
	order_direction?: 'ASC' | 'DESC';
}

export interface SkillFilters {
	category?: string;
	min_proficiency?: number;
	search?: string;
	order_by?: 'name' | 'category' | 'proficiency';
	order_direction?: 'ASC' | 'DESC';
}

export interface ContactSubmissionFilters {
	status?: ContactSubmission['status'];
	limit?: number;
	offset?: number;
	order_by?: 'created_at' | 'name';
	order_direction?: 'ASC' | 'DESC';
}

// =============================================================================
// Response Types
// =============================================================================

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface DatabaseStats {
	blog_posts: {
		total: number;
		published: number;
		drafts: number;
		featured: number;
	};
	projects: {
		total: number;
		completed: number;
		in_progress: number;
		planning: number;
		featured: number;
	};
	skills: {
		total: number;
		by_category: Record<string, number>;
	};
	contact_submissions: {
		total: number;
		unread: number;
	};
}
