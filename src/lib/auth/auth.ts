// Authentication utilities for admin system
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Types
interface User {
	id: number;
	email: string;
	name: string;
	role: string;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	loading: boolean;
}

interface LoginResult {
	success: boolean;
	error?: string;
	user?: User;
}

interface TokenPayload {
	user: User;
	timestamp: number;
	expires: number;
}

// Auth store to track authentication state
export const authStore = writable<AuthState>({
	isAuthenticated: false,
	user: null,
	token: null,
	loading: true
});

// Admin credentials (in production, use secure database with hashed passwords)
const ADMIN_CREDENTIALS = {
	email: 'admin@leechy.dev',
	password: 'admin123', // In production: hash with bcrypt
	name: 'Admin User',
	role: 'admin'
};

// Token key for localStorage
const TOKEN_KEY = 'admin_auth_token';

/**
 * Simple token generation (replace with proper JWT in production)
 */
function generateToken(user: User): string {
	const payload: TokenPayload = {
		user,
		timestamp: Date.now(),
		expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
	};
	return btoa(JSON.stringify(payload));
}

/**
 * Verify and decode token
 */
function verifyToken(token: string): TokenPayload {
	try {
		const payload: TokenPayload = JSON.parse(atob(token));
		if (payload.expires < Date.now()) {
			throw new Error('Token expired');
		}
		return payload;
	} catch {
		throw new Error('Invalid token');
	}
}

/**
 * Initialize auth state from stored token
 */
export function initAuth(): void {
	if (!browser) {
		return;
	}

	authStore.update(state => ({ ...state, loading: true }));

	const token = localStorage.getItem(TOKEN_KEY);
	if (token) {
		try {
			const decoded = verifyToken(token);
			authStore.set({
				isAuthenticated: true,
				user: decoded.user,
				token: token,
				loading: false
			});
		} catch {
			localStorage.removeItem(TOKEN_KEY);
			authStore.set({
				isAuthenticated: false,
				user: null,
				token: null,
				loading: false
			});
		}
	} else {
		authStore.set({
			isAuthenticated: false,
			user: null,
			token: null,
			loading: false
		});
	}
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResult> {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Validate credentials
	if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
		return {
			success: false,
			error: 'Invalid email or password'
		};
	}

	// Create user object
	const user: User = {
		id: 1,
		email: ADMIN_CREDENTIALS.email,
		name: ADMIN_CREDENTIALS.name,
		role: ADMIN_CREDENTIALS.role
	};

	// Generate token
	const token = generateToken(user);

	// Store token
	if (browser) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	// Update auth store
	authStore.set({
		isAuthenticated: true,
		user: user,
		token: token,
		loading: false
	});

	return {
		success: true,
		user: user
	};
}

/**
 * Logout user
 */
export function logout(): void {
	if (browser) {
		localStorage.removeItem(TOKEN_KEY);
	}

	authStore.set({
		isAuthenticated: false,
		user: null,
		token: null,
		loading: false
	});
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	let isAuth = false;
	const unsubscribe = authStore.subscribe(auth => {
		isAuth = auth.isAuthenticated;
	});
	unsubscribe();
	return isAuth;
}

/**
 * Get current auth token
 */
export function getToken(): string | null {
	if (!browser) {
		return null;
	}
	return localStorage.getItem(TOKEN_KEY);
}
