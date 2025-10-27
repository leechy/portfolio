import { BlogService } from '$lib/server/blogs.js';
import { ProjectService } from '$lib/server/projects.js';

const SITE_URL = 'https://leechy.dev'; // Replace with your actual domain

export async function GET() {
	try {
		const blogService = new BlogService();
		const projectService = new ProjectService();

		// Get published blog posts
		const allBlogPosts = await blogService.getAllBlogPosts();
		const blogPosts = allBlogPosts.filter(post => post.status === 'published');

		// Get all projects
		const projects = await projectService.getAllProjects();

		// Static pages
		const staticPages = [
			{
				url: `${SITE_URL}/`,
				changefreq: 'monthly',
				priority: 1.0,
				lastmod: new Date().toISOString()
			},
			{
				url: `${SITE_URL}/about`,
				changefreq: 'monthly',
				priority: 0.8,
				lastmod: new Date().toISOString()
			},
			{
				url: `${SITE_URL}/projects`,
				changefreq: 'weekly',
				priority: 0.9,
				lastmod: new Date().toISOString()
			},
			{
				url: `${SITE_URL}/blog`,
				changefreq: 'weekly',
				priority: 0.9,
				lastmod: new Date().toISOString()
			},
			{
				url: `${SITE_URL}/privacy`,
				changefreq: 'yearly',
				priority: 0.3,
				lastmod: new Date().toISOString()
			},
			{
				url: `${SITE_URL}/terms`,
				changefreq: 'yearly',
				priority: 0.3,
				lastmod: new Date().toISOString()
			}
		];

		// Dynamic blog post pages
		const blogPages = blogPosts.map(post => ({
			url: `${SITE_URL}/blog/${post.slug}`,
			changefreq: 'monthly',
			priority: 0.7,
			lastmod: new Date(post.updated_at || post.created_at).toISOString()
		}));

		// Dynamic project pages
		const projectPages = projects.map(project => ({
			url: `${SITE_URL}/projects/${project.id}`,
			changefreq: 'monthly',
			priority: 0.8,
			lastmod: new Date(project.updated_at || project.created_at).toISOString()
		}));

		// Combine all pages
		const allPages = [...staticPages, ...blogPages, ...projectPages];

		// Generate sitemap XML
		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages
	.map(
		page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

		return new Response(sitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=3600' // Cache for 1 hour
			}
		});
	} catch {
		// Return a minimal sitemap if database fails
		const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

		return new Response(fallbackSitemap, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=300' // Shorter cache on error
			}
		});
	}
}
