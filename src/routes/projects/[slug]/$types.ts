import type { Project } from '$lib/server/database.js';

export interface PageData {
  project: Project | null;
  relatedProjects: Project[];
  meta: {
    title: string;
    description: string;
  };
}
