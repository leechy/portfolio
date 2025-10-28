// =============================================================================
// Shared TypeScript Interfaces
// =============================================================================
// Common types used across components, pages, and API routes

// Re-export database types for convenience
export type * from './database/types.js';

// =============================================================================
// Component Props & State
// =============================================================================

export interface NavigationItem {
  href: string;
  label: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface MetaTags {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  canonical?: string;

  // Open Graph
  'og:type'?: 'website' | 'article' | 'profile';
  'og:title'?: string;
  'og:description'?: string;
  'og:image'?: string;
  'og:image:alt'?: string;
  'og:url'?: string;
  'og:site_name'?: string;
  'og:locale'?: string;

  // Twitter Card
  'twitter:card'?: 'summary' | 'summary_large_image' | 'app' | 'player';
  'twitter:site'?: string;
  'twitter:creator'?: string;
  'twitter:title'?: string;
  'twitter:description'?: string;
  'twitter:image'?: string;
  'twitter:image:alt'?: string;
  'twitter:url'?: string;

  // Article specific (for blog posts)
  'article:published_time'?: string;
  'article:modified_time'?: string;
  'article:author'?: string;
  'article:tag'?: string;

  // Additional meta properties
  [key: string]: string | undefined;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// =============================================================================
// Form & Validation Types
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  name?: string;
}

// =============================================================================
// Search & Filter Types
// =============================================================================

export interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  facets?: Record<string, FilterOption[]>;
  suggestions?: string[];
}

// =============================================================================
// UI Component Types
// =============================================================================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ModalConfig {
  id: string;
  title: string;
  content?: string;
  component?: unknown;
  props?: Record<string, unknown>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  persistent?: boolean;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    primary: string;
    mono: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// =============================================================================
// Content & Media Types
// =============================================================================

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcset?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

export interface VideoAsset {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export interface CodeBlock {
  code: string;
  language: string;
  filename?: string;
  highlights?: number[];
  showLineNumbers?: boolean;
}

// =============================================================================
// Analytics & Tracking Types
// =============================================================================

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, string | number>;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

// =============================================================================
// Dashboard & Admin Types
// =============================================================================

export interface DashboardStats {
  visitors: {
    total: number;
    unique: number;
    change: number;
  };
  pageViews: {
    total: number;
    change: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    title: string;
  }>;
  recentActivity: Array<{
    type: 'blog' | 'project' | 'contact';
    title: string;
    timestamp: string;
    url?: string;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin?: string;
  permissions: string[];
}

// =============================================================================
// Third-party Integration Types
// =============================================================================

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

// =============================================================================
// Utility Types
// =============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;

// =============================================================================
// Event Types
// =============================================================================

export interface CustomEventMap {
  'toast:show': { detail: ToastMessage };
  'modal:open': { detail: ModalConfig };
  'modal:close': { detail: { id: string } };
  'theme:change': { detail: { theme: string } };
  'navigation:change': { detail: { path: string } };
}

// =============================================================================
// Environment & Configuration Types
// =============================================================================

export interface AppConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  author: string;
  social: Record<string, string>;
  analytics?: {
    googleAnalytics?: string;
    plausible?: string;
  };
  features: {
    blog: boolean;
    projects: boolean;
    contact: boolean;
    newsletter: boolean;
    search: boolean;
    comments: boolean;
  };
  database: {
    path: string;
    backup: boolean;
  };
  email?: {
    provider: string;
    apiKey: string;
    fromAddress: string;
  };
}
