import { json } from '@sveltejs/kit';
import { MediaService } from '$lib/server/media.js';
import type { RequestHandler } from './$types';

const mediaService = new MediaService();

export const GET: RequestHandler = async () => {
	try {
		const stats = await mediaService.getStorageStats();
		return json({ success: true, data: stats });
	} catch {
		return json({ success: false, error: 'Failed to fetch storage statistics' }, { status: 500 });
	}
};
