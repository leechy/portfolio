import { json } from '@sveltejs/kit';
import { MediaService } from '$lib/server/media.js';
import type { RequestHandler } from './$types';

const mediaService = new MediaService();

export const GET: RequestHandler = async ({ url }) => {
  try {
    const search = url.searchParams.get('search') || undefined;
    const type = url.searchParams.get('type') || undefined;
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');

    const limit = limitParam ? parseInt(limitParam) : undefined;
    const offset = offsetParam ? parseInt(offsetParam) : undefined;

    const mediaFiles = await mediaService.getAllMediaFiles({
      search,
      type,
      limit,
      offset
    });

    return json({ success: true, data: mediaFiles });
  } catch {
    return json({ success: false, error: 'Failed to fetch media files' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const uploadResults = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      // Generate unique filename
      const uniqueFilename = mediaService.generateUniqueFilename(file.name);

      // Create uploads directory if it doesn't exist
      const uploadDir = 'static/uploads';
      const filePath = `${uploadDir}/${uniqueFilename}`;
      const fileUrl = `/uploads/${uniqueFilename}`;

      try {
        // Ensure uploads directory exists
        await import('fs').then(fs => fs.promises.mkdir(uploadDir, { recursive: true }));

        // Save file to disk
        const buffer = await file.arrayBuffer();
        await import('fs').then(fs => fs.promises.writeFile(filePath, Buffer.from(buffer)));

        // Get file type and mime type
        const fileType = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : 'document';

        // For images, we could get dimensions using a library like 'sharp'
        // For now, we'll set them as undefined and add this functionality later
        const mediaData = {
          filename: uniqueFilename,
          original_filename: file.name,
          file_path: filePath,
          file_url: fileUrl,
          file_type: fileType,
          file_size: file.size,
          mime_type: file.type,
          // TODO: Add image dimension detection and video duration detection
          width: undefined,
          height: undefined,
          duration: undefined
        };

        const newMediaFile = await mediaService.createMediaFile(mediaData);
        uploadResults.push(newMediaFile);
      } catch {
        // If file processing fails, continue with other files
        uploadResults.push({
          error: `Failed to process file: ${file.name}`,
          filename: file.name
        });
      }
    }

    return json({ success: true, data: uploadResults });
  } catch {
    return json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return json({ success: false, error: 'Invalid or missing file IDs' }, { status: 400 });
    }

    const deletedCount = await mediaService.deleteMultipleMediaFiles(ids);

    return json({
      success: true,
      data: { deletedCount, totalRequested: ids.length }
    });
  } catch {
    return json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
};
