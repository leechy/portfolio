/**
 * SEO utilities for dynamic meta tags, structured data, and search engine optimization
 */

import type { MetaTags } from '../types.js';

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface SeoConfig {
	title: string;
	description: string;
	keywords?: string[];
	author?: string;
	siteUrl?: string;
	image?: string;
	imageAlt?: string;
	type?: 'website' | 'article' | 'profile';
	locale?: string;
	siteName?: string;
	twitterHandle?: string;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
	canonical?: string;
}

export interface StructuredData {
	'@context': string;
	'@type': string;
	[key: string]: unknown;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export interface BlogPostSeo extends SeoConfig {
	slug: string;
	excerpt?: string;
	readingTime?: number;
	wordCount?: number;
	category?: string;
	tags?: string[];
	publishedTime: string;
	modifiedTime?: string;
}

export interface ProjectSeo extends SeoConfig {
	slug: string;
	status?: string;
	technologies?: string[];
	githubUrl?: string;
	demoUrl?: string;
}

// =============================================================================
// Default Configuration
// =============================================================================

export const DEFAULT_SEO: Required<
	Pick<SeoConfig, 'title' | 'description' | 'siteName' | 'type' | 'locale'>
> = {
	title: 'Leechy.dev - Full-Stack Developer Portfolio',
	description:
		'Portfolio of a passionate full-stack developer creating innovative web solutions with modern technologies.',
	siteName: 'Leechy.dev',
	type: 'website',
	locale: 'en_US'
};

export const SEO_LIMITS = {
	title: { min: 30, max: 60 },
	description: { min: 120, max: 160 },
	keywords: { max: 10 }
} as const;

// =============================================================================
// Meta Tag Generation
// =============================================================================

/**
 * Generate complete meta tags for a page
 */
export function generateMetaTags(config: SeoConfig): MetaTags {
	const {
		title,
		description,
		keywords,
		author,
		siteUrl,
		image,
		imageAlt,
		type = 'website',
		locale = 'en_US',
		siteName = DEFAULT_SEO.siteName,
		twitterHandle,
		publishedTime,
		modifiedTime,
		canonical
	} = config;

	const fullTitle = formatPageTitle(title, siteName);
	const metaDescription = truncateDescription(description);
	const imageUrl = image ? resolveImageUrl(image, siteUrl) : undefined;
	const canonicalUrl = canonical || siteUrl;

	const metaTags: MetaTags = {
		title: fullTitle,
		description: metaDescription,
		keywords: keywords?.join(', '),
		author: author || 'Leechy',
		canonical: canonicalUrl,

		// Open Graph
		'og:type': type,
		'og:title': title,
		'og:description': metaDescription,
		'og:site_name': siteName,
		'og:locale': locale,

		// Twitter Card
		'twitter:card': 'summary_large_image',
		'twitter:title': title,
		'twitter:description': metaDescription
	};

	// Add URL if provided
	if (canonicalUrl) {
		metaTags['og:url'] = canonicalUrl;
		metaTags['twitter:url'] = canonicalUrl;
	}

	// Add image meta tags
	if (imageUrl) {
		metaTags['og:image'] = imageUrl;
		metaTags['twitter:image'] = imageUrl;

		if (imageAlt) {
			metaTags['og:image:alt'] = imageAlt;
			metaTags['twitter:image:alt'] = imageAlt;
		}
	}

	// Add Twitter handle
	if (twitterHandle) {
		metaTags['twitter:creator'] = twitterHandle.startsWith('@')
			? twitterHandle
			: `@${twitterHandle}`;
		metaTags['twitter:site'] = metaTags['twitter:creator'];
	}

	// Add article-specific meta tags
	if (type === 'article') {
		if (publishedTime) {
			metaTags['article:published_time'] = publishedTime;
		}
		if (modifiedTime) {
			metaTags['article:modified_time'] = modifiedTime;
		}
		if (author) {
			metaTags['article:author'] = author;
		}
	}

	return metaTags;
}

/**
 * Generate blog post specific meta tags
 */
export function generateBlogPostMeta(post: BlogPostSeo, siteUrl?: string): MetaTags {
	const postUrl = siteUrl ? `${siteUrl}/blog/${post.slug}` : undefined;

	return generateMetaTags({
		...post,
		type: 'article',
		siteUrl: postUrl,
		canonical: postUrl,
		keywords: post.tags || post.keywords
	});
}

/**
 * Generate project specific meta tags
 */
export function generateProjectMeta(project: ProjectSeo, siteUrl?: string): MetaTags {
	const projectUrl = siteUrl ? `${siteUrl}/projects/${project.slug}` : undefined;

	return generateMetaTags({
		...project,
		type: 'website',
		siteUrl: projectUrl,
		canonical: projectUrl,
		keywords: project.technologies || project.keywords
	});
}

// =============================================================================
// Title and Description Helpers
// =============================================================================

/**
 * Format page title with site name
 */
export function formatPageTitle(pageTitle: string, siteName = DEFAULT_SEO.siteName): string {
	if (!pageTitle) {
		return siteName;
	}
	if (pageTitle === siteName) {
		return pageTitle;
	}

	// Avoid duplication if pageTitle already contains siteName
	if (pageTitle.includes(siteName)) {
		return pageTitle;
	}

	return `${pageTitle} | ${siteName}`;
}

/**
 * Generate SEO-friendly title from content
 */
export function generateSeoTitle(
	content: string,
	maxLength = SEO_LIMITS.title.max,
	suffix?: string
): string {
	let title = content.trim();

	// Remove markdown formatting
	title = title.replace(/[#*_`~]/g, '');

	// Truncate if too long
	if (title.length > maxLength) {
		title = title.substring(0, maxLength).trim();

		// Try to break at word boundary
		const lastSpace = title.lastIndexOf(' ');
		if (lastSpace > maxLength * 0.8) {
			title = title.substring(0, lastSpace);
		}
	}

	// Add suffix if provided and fits
	if (suffix && title.length + suffix.length + 3 <= maxLength) {
		title += ` | ${suffix}`;
	}

	return title;
}

/**
 * Truncate description to SEO limits
 */
export function truncateDescription(
	description: string,
	maxLength = SEO_LIMITS.description.max
): string {
	if (!description) {
		return '';
	}

	let truncated = description.trim();

	// Remove markdown formatting
	truncated = truncated.replace(/[#*_`~[\]]/g, '');

	if (truncated.length <= maxLength) {
		return truncated;
	}

	// Truncate and try to end at sentence boundary
	truncated = truncated.substring(0, maxLength);

	const lastSentence = truncated.lastIndexOf('.');
	const lastSpace = truncated.lastIndexOf(' ');

	if (lastSentence > maxLength * 0.8) {
		return truncated.substring(0, lastSentence + 1);
	} else if (lastSpace > maxLength * 0.8) {
		return truncated.substring(0, lastSpace) + '...';
	}

	return truncated + '...';
}

/**
 * Extract excerpt from content for meta description
 */
export function extractExcerpt(content: string, maxLength = SEO_LIMITS.description.max): string {
	// Remove markdown headers and formatting
	let excerpt = content
		.replace(/^#{1,6}\s+/gm, '') // Remove headers
		.replace(/\*\*(.*?)\*\*/g, '$1') // Bold
		.replace(/\*(.*?)\*/g, '$1') // Italic
		.replace(/`(.*?)`/g, '$1') // Inline code
		.replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
		.trim();

	// Get first paragraph
	const firstParagraph = excerpt.split('\n\n')[0];
	if (firstParagraph) {
		excerpt = firstParagraph;
	}

	return truncateDescription(excerpt, maxLength);
}

// =============================================================================
// Structured Data Generation
// =============================================================================

/**
 * Generate website structured data
 */
export function generateWebsiteStructuredData(config: {
	name: string;
	url: string;
	description: string;
	author?: string;
	logo?: string;
	sameAs?: string[];
}): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: config.name,
		url: config.url,
		description: config.description,
		author: config.author
			? {
					'@type': 'Person',
					name: config.author
				}
			: undefined,
		logo: config.logo,
		sameAs: config.sameAs
	};
}

/**
 * Generate person/author structured data
 */
export function generatePersonStructuredData(config: {
	name: string;
	jobTitle?: string;
	url?: string;
	email?: string;
	sameAs?: string[];
	worksFor?: string;
	description?: string;
}): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: config.name,
		jobTitle: config.jobTitle,
		url: config.url,
		email: config.email,
		sameAs: config.sameAs,
		worksFor: config.worksFor
			? {
					'@type': 'Organization',
					name: config.worksFor
				}
			: undefined,
		description: config.description
	};
}

/**
 * Generate blog post structured data
 */
export function generateBlogPostStructuredData(post: {
	title: string;
	description: string;
	url: string;
	author: string;
	publishedTime: string;
	modifiedTime?: string;
	image?: string;
	tags?: string[];
	wordCount?: number;
}): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		url: post.url,
		datePublished: post.publishedTime,
		dateModified: post.modifiedTime || post.publishedTime,
		author: {
			'@type': 'Person',
			name: post.author
		},
		image: post.image,
		keywords: post.tags,
		wordCount: post.wordCount
	};
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
}

// =============================================================================
// URL and Image Helpers
// =============================================================================

/**
 * Resolve relative image URL to absolute
 */
export function resolveImageUrl(imagePath: string, baseUrl?: string): string {
	if (!imagePath) {
		return '';
	}

	// Already absolute URL
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}

	// No base URL provided
	if (!baseUrl) {
		return imagePath;
	}

	// Ensure baseUrl doesn't end with slash and imagePath starts with slash
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

	return `${cleanBaseUrl}${cleanImagePath}`;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string, baseUrl: string): string {
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const cleanPath = path.startsWith('/') ? path : `/${path}`;

	return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Generate social sharing URLs
 */
export function generateSocialShareUrls(config: {
	url: string;
	title: string;
	description?: string;
	via?: string;
}): Record<string, string> {
	const { url, title, description, via } = config;

	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedDescription = encodeURIComponent(description || '');

	return {
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${via ? `&via=${via}` : ''}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
		reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
		hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
		email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
	};
}

// =============================================================================
// SEO Validation and Analysis
// =============================================================================

/**
 * Validate SEO configuration
 */
export function validateSeoConfig(config: SeoConfig): {
	valid: boolean;
	warnings: string[];
	errors: string[];
} {
	const warnings: string[] = [];
	const errors: string[] = [];

	// Title validation
	if (!config.title) {
		errors.push('Title is required');
	} else {
		if (config.title.length < SEO_LIMITS.title.min) {
			warnings.push(
				`Title is too short (${config.title.length} chars, minimum ${SEO_LIMITS.title.min})`
			);
		}
		if (config.title.length > SEO_LIMITS.title.max) {
			warnings.push(
				`Title is too long (${config.title.length} chars, maximum ${SEO_LIMITS.title.max})`
			);
		}
	}

	// Description validation
	if (!config.description) {
		errors.push('Description is required');
	} else {
		if (config.description.length < SEO_LIMITS.description.min) {
			warnings.push(
				`Description is too short (${config.description.length} chars, minimum ${SEO_LIMITS.description.min})`
			);
		}
		if (config.description.length > SEO_LIMITS.description.max) {
			warnings.push(
				`Description is too long (${config.description.length} chars, maximum ${SEO_LIMITS.description.max})`
			);
		}
	}

	// Keywords validation
	if (config.keywords && config.keywords.length > SEO_LIMITS.keywords.max) {
		warnings.push(
			`Too many keywords (${config.keywords.length}, maximum ${SEO_LIMITS.keywords.max})`
		);
	}

	// Image validation
	if (config.image && !config.imageAlt) {
		warnings.push('Image provided without alt text');
	}

	return {
		valid: errors.length === 0,
		warnings,
		errors
	};
}

/**
 * Analyze content for SEO recommendations
 */
export function analyzeSeoContent(content: string): {
	wordCount: number;
	readingTime: number; // in minutes
	headingStructure: Array<{ level: number; text: string }>;
	recommendations: string[];
} {
	const recommendations: string[] = [];

	// Word count
	const wordCount = content.trim().split(/\s+/).length;

	// Reading time (average 200 words per minute)
	const readingTime = Math.ceil(wordCount / 200);

	// Extract headings
	const headingMatches = content.match(/^#{1,6}\s+(.+)$/gm) || [];
	const headingStructure = headingMatches.map(heading => {
		const level = (heading.match(/^#+/) || [''])[0].length;
		const text = heading.replace(/^#+\s+/, '');
		return { level, text };
	});

	// Generate recommendations
	if (wordCount < 300) {
		recommendations.push('Content is quite short. Consider adding more valuable information.');
	}

	if (headingStructure.length === 0) {
		recommendations.push('No headings found. Add headings to improve content structure.');
	} else {
		const h1Count = headingStructure.filter(h => h.level === 1).length;
		if (h1Count > 1) {
			recommendations.push('Multiple H1 headings found. Use only one H1 per page.');
		}
		if (h1Count === 0) {
			recommendations.push('No H1 heading found. Add a main heading to your content.');
		}
	}

	// Check for internal/external links
	const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
	if (linkMatches.length === 0) {
		recommendations.push('No links found. Consider adding relevant internal and external links.');
	}

	return {
		wordCount,
		readingTime,
		headingStructure,
		recommendations
	};
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create meta tag HTML string
 */
export function createMetaTagHtml(metaTags: MetaTags): string {
	const tags: string[] = [];

	Object.entries(metaTags).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return;
		}

		if (key === 'title') {
			tags.push(`<title>${escapeHtml(String(value))}</title>`);
		} else if (key === 'canonical') {
			tags.push(`<link rel="canonical" href="${escapeHtml(String(value))}">`);
		} else if (key.startsWith('og:') || key.startsWith('twitter:') || key.startsWith('article:')) {
			tags.push(`<meta property="${key}" content="${escapeHtml(String(value))}">`);
		} else {
			tags.push(`<meta name="${key}" content="${escapeHtml(String(value))}">`);
		}
	});

	return tags.join('\n');
}

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
	const div = document?.createElement('div');
	if (div) {
		div.textContent = text;
		return div.innerHTML;
	}

	// Fallback for server-side
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * Generate robots meta tag
 */
export function generateRobotsMeta(options: {
	index?: boolean;
	follow?: boolean;
	noarchive?: boolean;
	nosnippet?: boolean;
	noimageindex?: boolean;
}): string {
	const {
		index = true,
		follow = true,
		noarchive = false,
		nosnippet = false,
		noimageindex = false
	} = options;

	const directives: string[] = [];

	directives.push(index ? 'index' : 'noindex');
	directives.push(follow ? 'follow' : 'nofollow');

	if (noarchive) {
		directives.push('noarchive');
	}
	if (nosnippet) {
		directives.push('nosnippet');
	}
	if (noimageindex) {
		directives.push('noimageindex');
	}

	return directives.join(', ');
}
