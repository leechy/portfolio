import { authStore, initAuth } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
  // Skip auth check for login page entirely
  if (url.pathname === '/admin/login') {
    // For login page, we don't initialize auth here - let the page handle it
    return { isLoginPage: true };
  }

  // In browser, check authentication status for protected pages
  if (browser) {
    // Initialize auth first
    initAuth();

    return new Promise(resolve => {
      let unsubscribe: (() => void) | null = null;

      unsubscribe = authStore.subscribe(auth => {
        if (!auth.loading) {
          if (unsubscribe) {
            unsubscribe();
          }
          if (!auth.isAuthenticated) {
            throw redirect(302, '/admin/login');
          }
          resolve({ isLoginPage: false });
        }
      });
    });
  }

  // On server, we can't check localStorage, so we'll let the client handle it
  return { isLoginPage: false };
};
