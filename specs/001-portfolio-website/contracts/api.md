# API Contracts: Portfolio Website

## Overview

This document defines the API endpoints and data contracts for the portfolio website. While the site is primarily server-rendered, these endpoints support dynamic features like project filtering, search, and contact form submission.

## Base URL

- Development: `http://localhost:5173/api`
- Production: `https://leechy.dev/api`

## Authentication

No authentication required for public portfolio endpoints.

## Data Models

### Skill

```typescript
interface Skill {
  id: number;
  name: string;
  slug: string;
  iconPath?: string;
  description?: string;
  category: 'frontend' | 'backend' | 'tools' | 'languages';
  displayOrder: number;
}
```

### Project

```typescript
interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  demoUrl?: string;
  repositoryUrl?: string;
  imagePath?: string;
  featured: boolean;
  skills: Skill[];
  displayOrder: number;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}
```

### ProjectDetail (extends Project)

```typescript
interface ProjectDetail extends Project {
  challenges: string[];
  solutions: string[];
  technologies: string[];
  skillsDemonstrated: string[];
  content: string; // Rendered HTML from markdown
  relatedProjects?: Project[];
}
```

### BlogPost

```typescript
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  tags: string[];
  featured: boolean;
}
```

### BlogPostDetail (extends BlogPost)

```typescript
interface BlogPostDetail extends BlogPost {
  content: string; // Rendered HTML from markdown
  relatedPosts?: BlogPost[];
}
```

### ContactSubmission

```typescript
interface ContactSubmission {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
```

## API Endpoints

### Skills

#### GET /api/skills

Get all skills grouped by category.

**Response:**

```typescript
{
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
  languages: Skill[];
}
```

**Example:**

```json
{
  "frontend": [
    {
      "id": 1,
      "name": "SvelteKit",
      "slug": "sveltekit",
      "iconPath": "/icons/svelte.svg",
      "description": "Modern web framework",
      "category": "frontend",
      "displayOrder": 1
    }
  ],
  "backend": [...],
  "tools": [...],
  "languages": [...]
}
```

### Projects

#### GET /api/projects

Get paginated list of projects with optional filtering.

**Query Parameters:**

- `skills`: Comma-separated skill slugs for filtering
- `featured`: Boolean to filter featured projects only
- `limit`: Number of projects per page (default: 12, max: 50)
- `offset`: Number of projects to skip (default: 0)

**Response:**

```typescript
{
  projects: Project[];
  total: number;
  hasMore: boolean;
}
```

**Example:**

```
GET /api/projects?skills=sveltekit,typescript&limit=6

{
  "projects": [
    {
      "id": 1,
      "title": "E-commerce Platform",
      "slug": "ecommerce-platform",
      "shortDescription": "Full-stack e-commerce solution",
      "demoUrl": "https://demo.example.com",
      "repositoryUrl": "https://github.com/user/repo",
      "imagePath": "/images/projects/ecommerce.jpg",
      "featured": true,
      "skills": [
        {
          "id": 1,
          "name": "SvelteKit",
          "slug": "sveltekit",
          "category": "frontend"
        }
      ],
      "displayOrder": 1,
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-20T14:30:00Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

#### GET /api/projects/:slug

Get detailed project information including content.

**Response:** `ProjectDetail`

**Example:**

```
GET /api/projects/ecommerce-platform

{
  "id": 1,
  "title": "E-commerce Platform",
  "slug": "ecommerce-platform",
  "shortDescription": "Full-stack e-commerce solution",
  "challenges": [
    "Complex state management for shopping cart",
    "Payment gateway integration"
  ],
  "solutions": [
    "Implemented Zustand for cart state",
    "Used Stripe for secure payments"
  ],
  "technologies": ["SvelteKit", "TypeScript", "SQLite", "Stripe API"],
  "skillsDemonstrated": ["Frontend Development", "API Integration"],
  "content": "<p>Detailed project description...</p>",
  "relatedProjects": [...]
}
```

### Blog

#### GET /api/blog

Get paginated list of published blog posts.

**Query Parameters:**

- `tags`: Comma-separated tags for filtering
- `search`: Search term for title/content
- `limit`: Number of posts per page (default: 10, max: 50)
- `offset`: Number of posts to skip (default: 0)

**Response:**

```typescript
{
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
}
```

#### GET /api/blog/:slug

Get detailed blog post content.

**Response:** `BlogPostDetail`

#### GET /api/blog/tags

Get all available blog post tags.

**Response:**

```typescript
{
  tags: string[];
}
```

### Contact

#### POST /api/contact

Submit contact form.

**Request Body:** `ContactSubmission`

**Response:**

```typescript
{
  success: boolean;
  message: string;
}
```

**Validation Rules:**

- Name: 1-100 characters, required
- Email: Valid email format, required
- Subject: Optional, max 200 characters
- Message: 10-5000 characters, required

**Rate Limiting:** 3 requests per IP address per hour

**Example:**

```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in discussing a potential project..."
}

// Response
{
  "success": true,
  "message": "Thank you for your message. I'll get back to you soon!"
}
```

## Error Responses

All endpoints return consistent error responses:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

**HTTP Status Codes:**

- `400`: Bad Request (validation errors)
- `404`: Not Found (resource doesn't exist)
- `429`: Too Many Requests (rate limiting)
- `500`: Internal Server Error

**Example Error:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "message": "Message is too short (minimum 10 characters)"
    }
  }
}
```

## Response Headers

All API responses include:

- `Content-Type: application/json`
- `Cache-Control`: Appropriate caching headers based on content type
- `X-RateLimit-Remaining`: For rate-limited endpoints

## Caching Strategy

- **Skills**: Cache for 1 hour (skills rarely change)
- **Projects**: Cache for 30 minutes (may be updated frequently)
- **Blog posts**: Cache for 15 minutes (fresh content important)
- **Project/Blog details**: Cache for 1 hour (content changes less frequently)

## WebSocket Events (Future Enhancement)

For real-time features like live blog comments or project updates:

```typescript
// Client subscribes to project updates
{
  "type": "subscribe",
  "channel": "project_updates",
  "projectId": 1
}

// Server sends project update
{
  "type": "project_updated",
  "projectId": 1,
  "changes": {
    "shortDescription": "Updated description"
  }
}
```
