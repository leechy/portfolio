import { get, writable } from 'svelte/store';

// Blog Post Interface
export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	publishedAt: Date;
	tags: string[];
	author: string;
	readTimeMinutes: number;
	coverImageUrl?: string;
	featured?: boolean;
}

// Blog Store State Interface
interface BlogState {
	blogs: BlogPost[];
	featured: BlogPost[];
	loading: boolean;
	error: string | null;
}

// Initial state
const initialState: BlogState = {
	blogs: [],
	featured: [],
	loading: false,
	error: null
};

// Create the blog store
export const blogStore = writable<BlogState>(initialState);

// Mock blog data for development and testing
const mockBlogData: BlogPost[] = [
	{
		id: 'first-blog-post',
		title: 'Getting Started with SvelteKit: A Complete Guide',
		slug: 'getting-started-with-sveltekit',
		excerpt:
			'Learn how to build modern web applications with SvelteKit, the official framework for Svelte applications. This comprehensive guide covers everything from setup to deployment.',
		content: `# Getting Started with SvelteKit: A Complete Guide

SvelteKit is the official application framework for Svelte, providing a full-stack solution for building modern web applications. In this comprehensive guide, we'll explore everything you need to know to get started with SvelteKit.

## What is SvelteKit?

SvelteKit is a framework for building web applications of all sizes, with a beautiful development experience and flexible filesystem-based routing. It provides:

- Server-side rendering (SSR) by default
- Static site generation (SSG) support  
- API routes for backend functionality
- Built-in TypeScript support
- Excellent performance optimizations

## Setting Up Your First SvelteKit Project

To create a new SvelteKit project, you can use the official create-svelte package:

\`\`\`bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
\`\`\`

This will scaffold a new SvelteKit project with all the necessary configuration.

## Project Structure

A typical SvelteKit project has the following structure:

- \`src/routes/\` - Your application's routes
- \`src/lib/\` - Reusable components and utilities
- \`src/app.html\` - Your app's HTML template
- \`static/\` - Static assets like images and fonts

## Routing in SvelteKit

SvelteKit uses filesystem-based routing. Each \`.svelte\` file in the \`src/routes\` directory becomes a route in your application.

## Conclusion

SvelteKit provides an excellent developer experience with powerful features out of the box. Its approach to web development makes it easy to build fast, modern applications.

Happy coding with SvelteKit!`,
		publishedAt: new Date('2024-01-15'),
		tags: ['SvelteKit', 'JavaScript', 'Web Development', 'Framework'],
		author: 'Leechy Dev',
		readTimeMinutes: 8,
		coverImageUrl: '/images/blog/sveltekit-guide.jpg',
		featured: true
	},
	{
		id: 'advanced-css-techniques',
		title: 'Advanced CSS Techniques for Modern Web Development',
		slug: 'advanced-css-techniques',
		excerpt:
			'Explore advanced CSS techniques including Grid, Flexbox, custom properties, and modern layout methods that will elevate your web development skills.',
		content: `# Advanced CSS Techniques for Modern Web Development

CSS has evolved tremendously over the years, providing developers with powerful tools to create sophisticated layouts and interactions. In this article, we'll explore some advanced CSS techniques that every modern web developer should know.

## CSS Grid: The Layout Revolution

CSS Grid Layout is a two-dimensional layout system that provides unprecedented control over web layouts.

### Basic Grid Setup

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}
\`\`\`

## Flexbox for Component Layouts

While Grid excels at page layouts, Flexbox is perfect for component-level layouts.

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Custom Properties (Variables)

Custom properties bring dynamic styling capabilities to CSS.

\`\`\`css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6366f1;
}

.button {
  background-color: var(--primary-color);
}
\`\`\`

## Container Queries: The Future of Responsive Design

Container queries allow components to respond to their container's size rather than the viewport size.

## Conclusion

These advanced CSS techniques provide the foundation for building modern, responsive, and maintainable web interfaces. Master these concepts to take your CSS skills to the next level.`,
		publishedAt: new Date('2024-02-10'),
		tags: ['CSS', 'Frontend', 'Web Development', 'Layout'],
		author: 'Leechy Dev',
		readTimeMinutes: 12,
		coverImageUrl: '/images/blog/advanced-css.jpg',
		featured: true
	},
	{
		id: 'typescript-best-practices',
		title: 'TypeScript Best Practices for Large-Scale Applications',
		slug: 'typescript-best-practices',
		excerpt:
			'Learn essential TypeScript patterns and practices that help maintain code quality and developer productivity in large-scale applications.',
		content: `# TypeScript Best Practices for Large-Scale Applications

TypeScript has become the go-to language for building robust, maintainable JavaScript applications. Here are the best practices that will help you leverage TypeScript effectively in large-scale projects.

## Strong Typing Strategies

### Interface Design

Create well-defined interfaces that represent your domain clearly:

\`\`\`typescript
interface User {
  readonly id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
}
\`\`\`

### Union Types for Better APIs

Use union types to create expressive and type-safe APIs:

\`\`\`typescript
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: string };
\`\`\`

## Generic Programming

Generics enable code reuse while maintaining type safety:

\`\`\`typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}
\`\`\`

## Error Handling Patterns

Implement robust error handling with TypeScript:

\`\`\`typescript
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

function parseJSON<T>(json: string): Result<T, string> {
  try {
    const data = JSON.parse(json) as T;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
\`\`\`

## Configuration and Build Setup

Proper TypeScript configuration is crucial:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitAny": true
  }
}
\`\`\`

## Testing with TypeScript

Write type-safe tests that provide better development experience:

\`\`\`typescript
interface TestUser {
  id: string;
  name: string;
}

function createTestUser(overrides: Partial<TestUser> = {}): TestUser {
  return {
    id: 'test-id',
    name: 'Test User',
    ...overrides
  };
}
\`\`\`

## Conclusion

These TypeScript best practices will help you build more maintainable, reliable, and developer-friendly applications. Remember that TypeScript is a tool to help you write better JavaScript – embrace its type system to catch errors early and improve your development experience.`,
		publishedAt: new Date('2024-03-05'),
		tags: ['TypeScript', 'JavaScript', 'Best Practices', 'Development'],
		author: 'Leechy Dev',
		readTimeMinutes: 15,
		featured: false
	},
	{
		id: 'performance-optimization-web-apps',
		title: 'Performance Optimization Techniques for Modern Web Applications',
		slug: 'performance-optimization-web-apps',
		excerpt:
			"Discover practical performance optimization techniques that can significantly improve your web application's loading speed and user experience.",
		content: `# Performance Optimization Techniques for Modern Web Applications

Web performance is crucial for user experience and business success. A slow website can lead to higher bounce rates, lower conversion rates, and poor user satisfaction. Let's explore key optimization techniques.

## Core Web Vitals

Google's Core Web Vitals are essential metrics for web performance:

### Largest Contentful Paint (LCP)
- Target: < 2.5 seconds
- Optimize images and fonts
- Use efficient caching strategies

### First Input Delay (FID)
- Target: < 100 milliseconds
- Minimize JavaScript execution time
- Use web workers for heavy tasks

### Cumulative Layout Shift (CLS)
- Target: < 0.1
- Set dimensions for images and videos
- Avoid inserting content above existing content

## Image Optimization

Images often account for the majority of a web page's bytes:

### Modern Image Formats
- Use WebP for better compression
- Implement AVIF for even better compression
- Provide fallbacks for older browsers

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
\`\`\`

### Lazy Loading
Implement lazy loading for images below the fold:

\`\`\`html
<img src="image.jpg" loading="lazy" alt="Description">
\`\`\`

## JavaScript Optimization

### Code Splitting
Split your JavaScript bundles to reduce initial load time:

\`\`\`javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));
\`\`\`

### Tree Shaking
Eliminate dead code from your bundles:

\`\`\`javascript
// Import only what you need
import { debounce } from 'lodash-es';
\`\`\`

### Service Workers
Implement service workers for caching and offline functionality:

\`\`\`javascript
// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
\`\`\`

## CSS Optimization

### Critical CSS
Inline critical CSS for above-the-fold content:

\`\`\`html
<style>
  /* Critical CSS inlined */
  .hero { /* styles */ }
</style>
\`\`\`

### CSS Containment
Use CSS containment to optimize rendering:

\`\`\`css
.component {
  contain: layout style paint;
}
\`\`\`

## Network Optimization

### HTTP/2 and HTTP/3
Leverage modern HTTP protocols for better performance.

### Resource Hints
Use resource hints to improve loading performance:

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="preload" href="/hero-image.jpg" as="image">
\`\`\`

## Monitoring and Measurement

### Performance Monitoring
Implement Real User Monitoring (RUM):

\`\`\`javascript
// Web Vitals measurement
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
\`\`\`

### Lighthouse CI
Integrate Lighthouse into your CI/CD pipeline for continuous performance monitoring.

## Conclusion

Performance optimization is an ongoing process that requires continuous monitoring and improvement. By implementing these techniques, you can significantly improve your web application's performance and provide a better user experience.

Remember: measure first, optimize based on data, and always test the impact of your optimizations.`,
		publishedAt: new Date('2024-03-20'),
		tags: ['Performance', 'Web Development', 'Optimization', 'Core Web Vitals'],
		author: 'Leechy Dev',
		readTimeMinutes: 18,
		coverImageUrl: '/images/blog/performance-optimization.jpg',
		featured: true
	},
	{
		id: 'react-vs-svelte-comparison',
		title: 'React vs Svelte: A Comprehensive Comparison for 2024',
		slug: 'react-vs-svelte-comparison',
		excerpt:
			'An in-depth comparison of React and Svelte frameworks, covering performance, developer experience, ecosystem, and use cases to help you choose the right tool.',
		content: `# React vs Svelte: A Comprehensive Comparison for 2024

Choosing the right frontend framework is one of the most important decisions in modern web development. React and Svelte represent different philosophies in building user interfaces. Let's examine both frameworks comprehensively.

## Philosophy and Approach

### React: The Library Approach
React is a library focused on building user interfaces through a component-based architecture with a virtual DOM.

Key principles:
- Declarative programming model
- Unidirectional data flow
- Component composition
- "Learn once, write anywhere"

### Svelte: The Compiler Approach
Svelte is a compile-time framework that generates optimized vanilla JavaScript.

Key principles:
- Compile-time optimization
- No virtual DOM overhead
- Built-in state management
- "Write less code"

## Performance Comparison

### Runtime Performance
- **Svelte**: No virtual DOM overhead, smaller bundle sizes
- **React**: Virtual DOM reconciliation, larger runtime

### Build Performance
- **Svelte**: Fast compilation, optimized output
- **React**: Mature tooling, extensive optimization options

### Memory Usage
- **Svelte**: Lower memory footprint
- **React**: Higher due to virtual DOM and reconciliation

## Developer Experience

### Learning Curve
- **React**: Steeper learning curve, more concepts to master
- **Svelte**: Gentler learning curve, familiar HTML/CSS/JS syntax

### Code Examples

#### React Component
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

#### Svelte Component
\`\`\`svelte
<script>
  let count = 0;
  
  $: document.title = \`Count: \${count}\`;
</script>

<h1>Count: {count}</h1>
<button on:click={() => count++}>
  Increment
</button>
\`\`\`

## Ecosystem and Community

### React Ecosystem
- **Size**: Massive ecosystem with extensive libraries
- **Maturity**: Battle-tested in production environments
- **Job Market**: High demand for React developers
- **Corporate Backing**: Maintained by Meta (Facebook)

### Svelte Ecosystem
- **Size**: Growing ecosystem with curated libraries
- **Maturity**: Newer but rapidly maturing
- **Job Market**: Emerging opportunities
- **Corporate Backing**: Independent, community-driven

## Tooling and Development

### Development Tools
- **React**: React DevTools, extensive IDE support
- **Svelte**: Svelte DevTools, growing IDE support

### Build Tools
- **React**: Create React App, Next.js, Vite
- **Svelte**: SvelteKit (official), Vite integration

### Testing
- **React**: Rich testing ecosystem (Jest, React Testing Library)
- **Svelte**: Growing testing support (Jest, Cypress)

## Use Cases and When to Choose

### Choose React When:
- Building large-scale applications
- Need extensive third-party libraries
- Team has React experience
- Require mature ecosystem
- Building React Native mobile apps

### Choose Svelte When:
- Building performance-critical applications
- Want minimal bundle sizes
- Prefer simpler syntax and concepts
- Building content-heavy websites
- Team wants to learn modern approaches

## Performance Benchmarks

### Bundle Size Comparison
- **React**: ~40KB (React + ReactDOM minified)
- **Svelte**: ~10KB (typical Svelte app)

### Runtime Performance
- **Svelte**: Faster initial load and updates
- **React**: Good performance with proper optimization

## Migration Considerations

### From React to Svelte
- Different component syntax
- State management patterns
- Ecosystem adaptation

### From Svelte to React
- Learning virtual DOM concepts
- Understanding React patterns
- Leveraging larger ecosystem

## Future Outlook

### React Roadmap
- Concurrent features
- Server components
- Improved developer experience

### Svelte Roadmap  
- SvelteKit maturation
- Growing ecosystem
- Performance improvements

## Conclusion

Both React and Svelte are excellent choices for modern web development:

- **React** excels in large-scale applications with complex state management needs and benefits from a massive ecosystem and job market.

- **Svelte** shines in performance-critical applications where bundle size matters and teams want a simpler development experience.

The choice depends on your specific requirements, team expertise, and project constraints. Both frameworks will continue to evolve and serve different needs in the web development landscape.

Consider starting a small project with both frameworks to get hands-on experience before making a decision for larger applications.`,
		publishedAt: new Date('2024-04-12'),
		tags: ['React', 'Svelte', 'Framework Comparison', 'Frontend'],
		author: 'Leechy Dev',
		readTimeMinutes: 20,
		featured: false
	},
	{
		id: 'accessibility-web-development',
		title: "Building Accessible Web Applications: A Developer's Guide",
		slug: 'accessibility-web-development',
		excerpt:
			'Learn essential accessibility principles and practical techniques to create web applications that work for everyone, including users with disabilities.',
		content: `# Building Accessible Web Applications: A Developer's Guide

Web accessibility ensures that people with disabilities can use and navigate your web applications effectively. Building accessible applications isn't just the right thing to do—it's often required by law and benefits all users.

## Understanding Web Accessibility

### The WCAG Guidelines
The Web Content Accessibility Guidelines (WCAG) provide the foundation for web accessibility:

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: Interface components must be operable by all users
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough to work with various assistive technologies

## Semantic HTML: The Foundation

### Use Proper HTML Elements
Always use semantic HTML elements for their intended purpose:

\`\`\`html
<!-- Good: Semantic button -->
<button type="submit">Submit Form</button>

<!-- Bad: Non-semantic div -->
<div onclick="submitForm()">Submit Form</div>
\`\`\`

### Document Structure
Create a logical document structure with proper headings:

\`\`\`html
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
  <h2>Another Section</h2>
\`\`\`

## ARIA: Enhancing Accessibility

### ARIA Roles
Use ARIA roles to define what an element is or does:

\`\`\`html
<div role="button" tabindex="0">Custom Button</div>
<nav role="navigation" aria-label="Main navigation">
<main role="main">
\`\`\`

### ARIA Properties
Provide additional information about elements:

\`\`\`html
<input 
  type="password" 
  aria-describedby="pwd-help"
  aria-required="true"
>
<div id="pwd-help">
  Password must be at least 8 characters long
</div>
\`\`\`

### ARIA States
Communicate dynamic changes:

\`\`\`html
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" aria-hidden="true">
  <!-- Menu items -->
</ul>
\`\`\`

## Keyboard Navigation

### Tab Order
Ensure logical tab order throughout your application:

\`\`\`css
/* Remove default focus outline only if providing alternative */
.custom-focus:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0066cc;
}
\`\`\`

### Keyboard Event Handling
Handle keyboard events properly:

\`\`\`javascript
function handleKeyPress(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    // Activate the control
    activateControl();
  }
  if (event.key === 'Escape') {
    // Close modal or dropdown
    closeModal();
  }
}
\`\`\`

## Visual Design for Accessibility

### Color Contrast
Ensure sufficient color contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

\`\`\`css
/* Good contrast */
.good-contrast {
  background-color: #ffffff;
  color: #333333; /* Contrast ratio: 12.63:1 */
}

/* Check contrast with tools */
.check-this {
  background-color: #f0f0f0;
  color: #666666; /* May need verification */
}
\`\`\`

### Focus Indicators
Provide clear focus indicators:

\`\`\`css
.interactive-element:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
\`\`\`

## Forms and Accessibility

### Proper Labeling
Always associate labels with form controls:

\`\`\`html
<!-- Method 1: for/id association -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email">

<!-- Method 2: implicit association -->
<label>
  Phone Number
  <input type="tel" name="phone">
</label>
\`\`\`

### Error Handling
Provide clear, accessible error messages:

\`\`\`html
<input 
  type="email" 
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
>
<div id="email-error" role="alert">
  Please enter a valid email address
</div>
\`\`\`

### Fieldsets and Legends
Group related form controls:

\`\`\`html
<fieldset>
  <legend>Shipping Address</legend>
  <!-- Address form fields -->
</fieldset>
\`\`\`

## Dynamic Content and Accessibility

### Live Regions
Announce dynamic content changes:

\`\`\`html
<div aria-live="polite" id="status-message">
  <!-- Status updates appear here -->
</div>

<div aria-live="assertive" id="error-message">
  <!-- Important alerts appear here -->
</div>
\`\`\`

### Managing Focus
Handle focus management in dynamic applications:

\`\`\`javascript
// When opening a modal
function openModal() {
  const modal = document.getElementById('modal');
  const firstFocusable = modal.querySelector('button, input, select, textarea');
  
  modal.setAttribute('aria-hidden', 'false');
  firstFocusable.focus();
}

// When closing a modal
function closeModal(triggerElement) {
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden', 'true');
  
  // Return focus to element that opened modal
  if (triggerElement) {
    triggerElement.focus();
  }
}
\`\`\`

## Testing for Accessibility

### Automated Testing
Use automated tools for initial testing:

\`\`\`javascript
// Example with axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});
\`\`\`

### Manual Testing
Perform manual testing:

1. **Keyboard Navigation**: Navigate using only the keyboard
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Color Blindness**: Check with color blindness simulators
4. **Zoom**: Test at 200% zoom level

### Accessibility Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Color is not the only way to convey information
- [ ] All images have appropriate alt text
- [ ] Form controls have labels
- [ ] Heading structure is logical
- [ ] Focus indicators are visible
- [ ] Error messages are clear and associated with controls

## Tools and Resources

### Development Tools
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Includes accessibility audit
- **Color Contrast Analyzers**: Check color contrast ratios

### Screen Readers
- **NVDA** (Windows): Free screen reader
- **VoiceOver** (macOS/iOS): Built-in screen reader
- **JAWS** (Windows): Popular commercial screen reader

## Legal and Business Benefits

### Legal Requirements
- **ADA**: Americans with Disabilities Act
- **Section 508**: U.S. federal accessibility standards
- **EN 301 549**: European accessibility standard

### Business Benefits
- Larger potential user base
- Better SEO rankings
- Improved usability for all users
- Reduced legal risk
- Enhanced brand reputation

## Conclusion

Building accessible web applications requires thoughtful planning and implementation, but the benefits extend far beyond compliance. Accessible design often results in better user experiences for everyone.

Start with semantic HTML, enhance with ARIA when needed, ensure keyboard accessibility, and test regularly. Remember that accessibility is not a one-time task but an ongoing commitment to inclusive design.

By following these principles and practices, you'll create web applications that truly work for everyone.`,
		publishedAt: new Date('2024-05-08'),
		tags: ['Accessibility', 'Web Development', 'WCAG', 'Inclusive Design'],
		author: 'Leechy Dev',
		readTimeMinutes: 25,
		coverImageUrl: '/images/blog/accessibility-guide.jpg',
		featured: false
	}
];

// Create reactive writable store with CRUD operations for admin interface
function createBlogsStore() {
	const { subscribe, set, update } = writable([...mockBlogData]);

	return {
		subscribe,
		// Initialize with mock data
		init: () => set([...mockBlogData]),
		
		// Create new blog post
		create: (blogData: Partial<BlogPost>) => {
			const newBlog: BlogPost = {
				id: blogData.id || `blog-${Date.now()}`,
				title: blogData.title || '',
				slug: blogData.slug || blogData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '',
				excerpt: blogData.excerpt || '',
				content: blogData.content || '',
				publishedAt: blogData.publishedAt || new Date(),
				tags: blogData.tags || [],
				author: blogData.author || 'Leechy',
				readTimeMinutes: blogData.readTimeMinutes || 1,
				coverImageUrl: blogData.coverImageUrl,
				featured: blogData.featured || false
			};
			
			update(blogs => [...blogs, newBlog]);
			return newBlog;
		},
		
		// Update existing blog post
		updateById: (id: string, blogData: Partial<BlogPost>) => update(blogs => {
			return blogs.map(blog => 
				blog.id === id ? { ...blog, ...blogData } : blog
			);
		}),
		
		// Delete blog post by ID
		deleteById: (id: string) => update(blogs => {
			return blogs.filter(blog => blog.id !== id);
		}),
		
		// Get blog post by ID
		getById: (id: string): BlogPost | undefined => {
			let foundBlog: BlogPost | undefined = undefined;
			update(blogs => {
				foundBlog = blogs.find(blog => blog.id === id);
				return blogs;
			});
			return foundBlog;
		},
		
		// Array access methods for backward compatibility
		push: (blogData: BlogPost) => update(blogs => [...blogs, blogData]),
		
		find: (predicate: (blog: BlogPost) => boolean): BlogPost | undefined => {
			let foundBlog: BlogPost | undefined = undefined;
			update(blogs => {
				foundBlog = blogs.find(predicate);
				return blogs;
			});
			return foundBlog;
		},
		
		findIndex: (predicate: (blog: BlogPost) => boolean): number => {
			let index = -1;
			update(blogs => {
				index = blogs.findIndex(predicate);
				return blogs;
			});
			return index;
		},
		
		splice: (start: number, deleteCount: number, ...items: BlogPost[]) => update(blogs => {
			const newArray = [...blogs];
			newArray.splice(start, deleteCount, ...items);
			return newArray;
		}),
		
		// Reset to original data
		reset: () => set([...mockBlogData])
	};
}

// Export the reactive blogs store for admin interface
export const blogs = createBlogsStore();

// Export the mock data for other components compatibility
export const blogPosts = mockBlogData;
export async function loadBlogs(): Promise<void> {
	blogStore.update(state => ({ ...state, loading: true, error: null }));

	try {
		// Simulate API call delay
		await new Promise(resolve => setTimeout(resolve, 100));

		// Sort blogs by publication date (newest first)
		const sortedBlogs = [...mockBlogData].sort(
			(a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
		);

		// Filter featured blogs
		const featuredBlogs = sortedBlogs.filter(blog => blog.featured === true).slice(0, 3);

		blogStore.set({
			blogs: sortedBlogs,
			featured: featuredBlogs,
			loading: false,
			error: null
		});
	} catch (error) {
		blogStore.update(state => ({
			...state,
			loading: false,
			error: error instanceof Error ? error.message : 'Failed to load blogs'
		}));
	}
}

// Helper function to get blog by ID or slug
export function getBlogById(idOrSlug: string): BlogPost | null {
	const state = get(blogStore);
	return (
		state.blogs.find((blog: BlogPost) => blog.id === idOrSlug || blog.slug === idOrSlug) || null
	);
}

// Helper function to get related blogs based on shared tags
export function getRelatedBlogs(blogId: string, limit: number = 3): BlogPost[] {
	const state = get(blogStore);
	const targetBlog = getBlogById(blogId);

	if (!targetBlog) {
		return [];
	}

	const relatedBlogs = state.blogs
		.filter((blog: BlogPost) => blog.id !== blogId) // Exclude the current blog
		.map((blog: BlogPost) => {
			// Calculate relevance score based on shared tags
			const sharedTags = blog.tags.filter((tag: string) => targetBlog.tags.includes(tag));
			return {
				blog,
				relevanceScore: sharedTags.length
			};
		})
		.filter((item: { blog: BlogPost; relevanceScore: number }) => item.relevanceScore > 0) // Only include blogs with shared tags
		.sort(
			(
				a: { blog: BlogPost; relevanceScore: number },
				b: { blog: BlogPost; relevanceScore: number }
			) => {
				// Sort by relevance score first, then by publication date
				if (a.relevanceScore !== b.relevanceScore) {
					return b.relevanceScore - a.relevanceScore;
				}
				return b.blog.publishedAt.getTime() - a.blog.publishedAt.getTime();
			}
		)
		.slice(0, limit)
		.map((item: { blog: BlogPost; relevanceScore: number }) => item.blog);

	return relatedBlogs;
}

// Search function
export function searchBlogs(query: string): BlogPost[] {
	const state = get(blogStore);
	const trimmedQuery = query.trim();

	if (!trimmedQuery) {
		return state.blogs; // Return all blogs for empty search
	}

	const searchTerm = trimmedQuery.toLowerCase();

	return state.blogs
		.map((blog: BlogPost) => {
			let relevanceScore = 0;

			// Title matches (highest priority)
			if (blog.title.toLowerCase().includes(searchTerm)) {
				relevanceScore += blog.title.toLowerCase() === searchTerm ? 100 : 50;
			}

			// Tag matches (high priority)
			const tagMatch = blog.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm));
			if (tagMatch) {
				relevanceScore += 30;
			}

			// Excerpt matches (medium priority)
			if (blog.excerpt.toLowerCase().includes(searchTerm)) {
				relevanceScore += 20;
			}

			// Content matches (lower priority)
			if (blog.content.toLowerCase().includes(searchTerm)) {
				relevanceScore += 10;
			}

			return {
				blog,
				relevanceScore
			};
		})
		.filter((item: { blog: BlogPost; relevanceScore: number }) => item.relevanceScore > 0)
		.sort(
			(
				a: { blog: BlogPost; relevanceScore: number },
				b: { blog: BlogPost; relevanceScore: number }
			) => {
				// Sort by relevance score first, then by publication date
				if (a.relevanceScore !== b.relevanceScore) {
					return b.relevanceScore - a.relevanceScore;
				}
				return b.blog.publishedAt.getTime() - a.blog.publishedAt.getTime();
			}
		)
		.slice(0, 50) // Limit results for performance
		.map((item: { blog: BlogPost; relevanceScore: number }) => item.blog);
}

// Filter blogs by tag
export function filterBlogsByTag(tag: string): BlogPost[] {
	const state = get(blogStore);
	return state.blogs.filter((blog: BlogPost) => blog.tags.includes(tag));
}

// Get all unique tags from all blogs
export function getAllBlogTags(): string[] {
	const state = get(blogStore);
	const allTags = state.blogs.flatMap((blog: BlogPost) => blog.tags);
	return [...new Set(allTags)].sort();
}

// Get blogs by tag with counts
export function getBlogTagsWithCounts(): Array<{ tag: string; count: number }> {
	const state = get(blogStore);
	const tagCounts = new Map<string, number>();

	state.blogs.forEach((blog: BlogPost) => {
		blog.tags.forEach((tag: string) => {
			tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
		});
	});

	return Array.from(tagCounts.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a: { tag: string; count: number }, b: { tag: string; count: number }) => {
			// Sort by count descending, then alphabetically
			if (a.count !== b.count) {
				return b.count - a.count;
			}
			return a.tag.localeCompare(b.tag);
		});
}

// Calculate estimated read time for content
export function calculateReadTime(content: string): number {
	const wordsPerMinute = 200; // Average reading speed
	const wordCount = content.split(/\s+/).length;
	const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
	return Math.max(1, readTimeMinutes); // Minimum 1 minute
}

// Format date for display
export function formatBlogDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(date);
}

// Format read time for display
export function formatReadTime(minutes: number): string {
	return `${minutes} min read`;
}
