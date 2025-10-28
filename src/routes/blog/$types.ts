import type { BlogPost } from '$lib/server/database.js';

export interface PageData {
  blogs: BlogPost[];
  featuredBlogs: BlogPost[];
  allTags: string[];
  meta: {
    total: number;
    title: string;
    description: string;
  };
}
