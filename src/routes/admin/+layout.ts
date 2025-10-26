import { authStore } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	// Skip auth check for login page
	if (url.pathname === '/admin/login') {
		return {};
	}

	// In browser, check authentication status
	if (browser) {
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
					resolve({});
				}
			});
		});
	}

	// On server, we can't check localStorage, so we'll let the client handle it
	return {};
};
