import { ProjectService } from '$lib/server/projects.js';
import { BlogService } from '$lib/server/blogs.js';
import { building } from '$app/environment';
import type { PageServerLoad } from './$types.js';
import type { BlogPost, Project } from '$lib/server/database.js';

export const load: PageServerLoad = async () => {
  // Don't access database during build
  if (building) {
    return {
      stats: {
        totalProjects: 0,
        publishedProjects: 0,
        totalBlogPosts: 0,
        publishedBlogPosts: 0,
        draftPosts: 0,
        totalViews: 0
      },
      recentActivity: []
    };
  }

  try {
    const projectService = new ProjectService();
    const blogService = new BlogService();

    // Get all projects and blog posts for dashboard stats
    const projects = projectService.getAllProjects();
    const blogPosts = blogService.getAllBlogPosts();

    // Calculate project stats
    const totalProjects = projects.length;
    const publishedProjects = projects.filter((p: Project) => p.status === 'completed').length;

    // Calculate blog stats
    const totalBlogPosts = blogPosts.length;
    const publishedBlogPosts = blogPosts.filter((p: BlogPost) => p.status === 'published').length;
    const draftPosts = blogPosts.filter((p: BlogPost) => p.status === 'draft').length;

    // Get recent activity (last 5 items)
    const recentProjects = projects
      .sort(
        (a: Project, b: Project) =>
          new Date(b.created_at || b.updated_at || '').getTime() -
          new Date(a.created_at || a.updated_at || '').getTime()
      )
      .slice(0, 3)
      .map((p: Project) => ({
        type: 'project' as const,
        action: 'updated',
        title: p.title,
        date: p.updated_at || p.created_at || new Date().toISOString().split('T')[0]
      }));

    const recentBlogs = blogPosts
      .sort(
        (a: BlogPost, b: BlogPost) =>
          new Date(b.created_at || b.updated_at || '').getTime() -
          new Date(a.created_at || a.updated_at || '').getTime()
      )
      .slice(0, 2)
      .map((p: BlogPost) => ({
        type: 'blog' as const,
        action: p.status === 'published' ? 'published' : 'updated',
        title: p.title,
        date: p.updated_at || p.created_at || new Date().toISOString().split('T')[0]
      }));

    const recentActivity = [...recentProjects, ...recentBlogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      stats: {
        totalProjects,
        publishedProjects,
        totalBlogPosts,
        publishedBlogPosts,
        draftPosts,
        totalViews: 1247 // Mock data for now
      },
      recentActivity
    };
  } catch {
    // Return default/empty stats on error
    return {
      stats: {
        totalProjects: 0,
        publishedProjects: 0,
        totalBlogPosts: 0,
        publishedBlogPosts: 0,
        draftPosts: 0,
        totalViews: 0
      },
      recentActivity: []
    };
  }
};
