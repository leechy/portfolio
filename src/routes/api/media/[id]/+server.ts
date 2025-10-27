import { json } from '@sveltejs/kit';
import { MediaService } from '$lib/server/media.js';
import type { MediaFile } from '$lib/server/database.js';
import type { RequestHandler } from './$types';

const mediaService = new MediaService();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ success: false, error: 'Invalid media file ID' }, { status: 400 });
		}

		const mediaFile = await mediaService.getMediaFileById(id);

		if (!mediaFile) {
			return json({ success: false, error: 'Media file not found' }, { status: 404 });
		}

		return json({ success: true, data: mediaFile });
	} catch {
		return json({ success: false, error: 'Failed to fetch media file' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ success: false, error: 'Invalid media file ID' }, { status: 400 });
		}

		const updates = await request.json();

		// Validate update data
		if (!updates || typeof updates !== 'object') {
			return json({ success: false, error: 'Invalid update data' }, { status: 400 });
		}

		let updatedMediaFile: MediaFile | null = null;

		// Handle filename changes (actual file renaming)
		if (updates.filename && typeof updates.filename === 'string') {
			updatedMediaFile = await mediaService.renameMediaFile(id, updates.filename);
			if (!updatedMediaFile) {
				return json({ success: false, error: 'Media file not found' }, { status: 404 });
			}
		}

		// Handle other metadata updates
		const metadataUpdates: Record<string, string> = {};
		const allowedMetadataFields = ['alt_text', 'original_filename'];

		for (const [key, value] of Object.entries(updates)) {
			if (allowedMetadataFields.includes(key) && typeof value === 'string') {
				metadataUpdates[key] = value;
			}
		}

		if (Object.keys(metadataUpdates).length > 0) {
			updatedMediaFile = await mediaService.updateMediaFile(id, metadataUpdates);
			if (!updatedMediaFile) {
				return json({ success: false, error: 'Media file not found' }, { status: 404 });
			}
		}

		// If no valid updates were provided
		if (!updatedMediaFile) {
			return json({ success: false, error: 'No valid fields to update' }, { status: 400 });
		}

		return json({ success: true, data: updatedMediaFile });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to update media file';
		return json({ success: false, error: errorMessage }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ success: false, error: 'Invalid media file ID' }, { status: 400 });
		}

		const success = await mediaService.deleteMediaFile(id);

		if (!success) {
			return json(
				{ success: false, error: 'Media file not found or could not be deleted' },
				{ status: 404 }
			);
		}

		return json({ success: true, data: { deleted: true } });
	} catch {
		return json({ success: false, error: 'Failed to delete media file' }, { status: 500 });
	}
};
