/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
	PUBLIC_SITE_URL: 'http://localhost:5173'
}));

vi.mock('$env/static/private', () => ({}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));
