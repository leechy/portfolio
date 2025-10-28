/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

import { vi } from 'vitest';

// Set up jest-dom matchers (but avoid importing in setup - causes issues)
// import '@testing-library/jest-dom';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
  PUBLIC_SITE_URL: 'http://localhost:5173'
}));

vi.mock('$env/static/private', () => ({}));

// Global test utilities for browser environment
if (typeof globalThis !== 'undefined') {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));

  // Mock IntersectionObserver
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));
}
