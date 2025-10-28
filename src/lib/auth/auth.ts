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

interface LogoutResult {
  success: boolean;
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

// Database-based authentication using UserService

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

  // Get current state to avoid unnecessary resets
  let isAlreadyAuthenticated = false;
  authStore.subscribe(state => {
    isAlreadyAuthenticated = state.isAuthenticated && !state.loading;
  })();

  // If we're already authenticated, no need to reinitialize
  if (isAlreadyAuthenticated) {
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
  try {
    // Call login API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Login failed'
      };
    }

    // Create user object for frontend
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role: data.user.role
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
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<LogoutResult> {
  if (browser) {
    await localStorage.removeItem(TOKEN_KEY);
  }

  // Update auth store
  authStore.set({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  });

  return {
    success: true
  };
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
