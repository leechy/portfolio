import type Database from 'better-sqlite3';
import { type MediaFile, getDatabase } from './database.js';
import { promises as fs } from 'fs';

// Database row interface for media files
interface MediaFileRow {
	id: number;
	filename: string;
	original_filename: string;
	file_path: string;
	file_url: string;
	file_type: string;
	file_size: number;
	mime_type: string;
	width: number | null;
	height: number | null;
	duration: number | null;
	alt_text: string | null;
	created_at: string;
	updated_at: string;
}

/**
 * Media file service for database operations
 */
export class MediaService {
	private db: Database.Database;

	constructor() {
		this.db = getDatabase();
	}

	/**
	 * Get all media files with optional filtering
	 */
	async getAllMediaFiles(options?: {
		search?: string;
		type?: string;
		limit?: number;
		offset?: number;
	}): Promise<MediaFile[]> {
		let query = `
			SELECT * FROM media_files 
			WHERE 1=1
		`;

		const params: (string | number)[] = [];

		if (options?.search) {
			query += ` AND (original_filename LIKE ? OR alt_text LIKE ?)`;
			params.push(`%${options.search}%`, `%${options.search}%`);
		}

		if (options?.type) {
			if (options.type === 'images') {
				query += ` AND mime_type LIKE 'image/%'`;
			} else if (options.type === 'videos') {
				query += ` AND mime_type LIKE 'video/%'`;
			} else if (options.type === 'documents') {
				query += ` AND mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%'`;
			}
		}

		query += ` ORDER BY created_at DESC`;

		if (options?.limit) {
			query += ` LIMIT ?`;
			params.push(options.limit);

			if (options?.offset) {
				query += ` OFFSET ?`;
				params.push(options.offset);
			}
		}

		const stmt = this.db.prepare(query);
		const rows = stmt.all(...params) as MediaFileRow[];

		return rows.map(row => this.transformRow(row));
	}

	/**
	 * Get media file by ID
	 */
	async getMediaFileById(id: number): Promise<MediaFile | null> {
		const stmt = this.db.prepare(`
			SELECT * FROM media_files WHERE id = ?
		`);

		const row = stmt.get(id) as MediaFileRow | undefined;
		return row ? this.transformRow(row) : null;
	}

	/**
	 * Get media file by filename
	 */
	async getMediaFileByFilename(filename: string): Promise<MediaFile | null> {
		const stmt = this.db.prepare(`
			SELECT * FROM media_files WHERE filename = ?
		`);

		const row = stmt.get(filename) as MediaFileRow | undefined;
		return row ? this.transformRow(row) : null;
	}

	/**
	 * Create a new media file record
	 */
	async createMediaFile(mediaData: {
		filename: string;
		original_filename: string;
		file_path: string;
		file_url: string;
		file_type: string;
		file_size: number;
		mime_type: string;
		width?: number;
		height?: number;
		duration?: number;
		alt_text?: string;
	}): Promise<MediaFile> {
		const stmt = this.db.prepare(`
			INSERT INTO media_files (
				filename, original_filename, file_path, file_url, file_type, 
				file_size, mime_type, width, height, duration, alt_text,
				created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const now = new Date().toISOString();

		const result = stmt.run(
			mediaData.filename,
			mediaData.original_filename,
			mediaData.file_path,
			mediaData.file_url,
			mediaData.file_type,
			mediaData.file_size,
			mediaData.mime_type,
			mediaData.width || null,
			mediaData.height || null,
			mediaData.duration || null,
			mediaData.alt_text || null,
			now,
			now
		);

		const newMediaFile = await this.getMediaFileById(result.lastInsertRowid as number);
		if (!newMediaFile) {
			throw new Error('Failed to create media file');
		}

		return newMediaFile;
	}

	/**
	 * Update media file metadata (non-filesystem changes)
	 */
	async updateMediaFile(
		id: number,
		updates: {
			alt_text?: string;
			original_filename?: string;
		}
	): Promise<MediaFile | null> {
		const fields: string[] = [];
		const values: (string | number)[] = [];

		if (updates.alt_text !== undefined) {
			fields.push('alt_text = ?');
			values.push(updates.alt_text);
		}

		if (updates.original_filename !== undefined) {
			fields.push('original_filename = ?');
			values.push(updates.original_filename);
		}

		if (fields.length === 0) {
			return this.getMediaFileById(id);
		}

		fields.push('updated_at = ?');
		values.push(new Date().toISOString());
		values.push(id);

		const stmt = this.db.prepare(`
			UPDATE media_files SET ${fields.join(', ')} WHERE id = ?
		`);

		stmt.run(...values);
		return this.getMediaFileById(id);
	}

	/**
	 * Rename file (both filesystem and database)
	 */
	async renameMediaFile(id: number, newFilename: string): Promise<MediaFile | null> {
		const mediaFile = await this.getMediaFileById(id);
		if (!mediaFile) {
			return null;
		}

		// Validate new filename
		if (!newFilename || newFilename.trim() === '') {
			throw new Error('New filename cannot be empty');
		}

		// Sanitize filename
		const sanitizedFilename = this.sanitizeFilename(newFilename);

		// Generate new paths
		const oldPath = mediaFile.file_path;
		const uploadDir = 'static/uploads';
		const newPath = `${uploadDir}/${sanitizedFilename}`;
		const newUrl = `/uploads/${sanitizedFilename}`;

		try {
			// Rename the actual file
			await fs.rename(oldPath, newPath);

			// Update database
			const stmt = this.db.prepare(`
				UPDATE media_files 
				SET filename = ?, file_path = ?, file_url = ?, updated_at = ?
				WHERE id = ?
			`);

			stmt.run(sanitizedFilename, newPath, newUrl, new Date().toISOString(), id);

			return this.getMediaFileById(id);
		} catch (error) {
			throw new Error(
				`Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}

	/**
	 * Sanitize filename for filesystem safety
	 */
	private sanitizeFilename(filename: string): string {
		// Remove or replace unsafe characters
		return filename
			.toLowerCase()
			.replace(/[^a-z0-9.-]/g, '-') // Replace unsafe chars with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
	}

	/**
	 * Delete media file from database and filesystem
	 */
	async deleteMediaFile(id: number): Promise<boolean> {
		const mediaFile = await this.getMediaFileById(id);
		if (!mediaFile) {
			return false;
		}

		// Delete from database
		const stmt = this.db.prepare('DELETE FROM media_files WHERE id = ?');
		const result = stmt.run(id);

		if (result.changes === 0) {
			return false;
		}

		// Delete from filesystem
		try {
			await fs.unlink(mediaFile.file_path);
		} catch {
			// Continue - database deletion was successful even if file deletion fails
		}

		return true;
	}

	/**
	 * Delete multiple media files
	 */
	async deleteMultipleMediaFiles(ids: number[]): Promise<number> {
		let deletedCount = 0;

		for (const id of ids) {
			const success = await this.deleteMediaFile(id);
			if (success) {
				deletedCount++;
			}
		}

		return deletedCount;
	}

	/**
	 * Generate unique filename to prevent conflicts
	 */
	generateUniqueFilename(originalFilename: string): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substr(2, 9);
		const extension = originalFilename.split('.').pop();
		const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
		const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

		return `${sanitizedName}-${timestamp}-${random}.${extension}`;
	}

	/**
	 * Get storage statistics
	 */
	async getStorageStats(): Promise<{
		totalFiles: number;
		totalSize: number;
		imageCount: number;
		videoCount: number;
		documentCount: number;
	}> {
		const stmt = this.db.prepare(`
			SELECT 
				COUNT(*) as total_files,
				SUM(file_size) as total_size,
				SUM(CASE WHEN mime_type LIKE 'image/%' THEN 1 ELSE 0 END) as image_count,
				SUM(CASE WHEN mime_type LIKE 'video/%' THEN 1 ELSE 0 END) as video_count,
				SUM(CASE WHEN mime_type NOT LIKE 'image/%' AND mime_type NOT LIKE 'video/%' THEN 1 ELSE 0 END) as document_count
			FROM media_files
		`);

		interface StatsResult {
			total_files: number;
			total_size: number;
			image_count: number;
			video_count: number;
			document_count: number;
		}

		const result = stmt.get() as StatsResult;

		return {
			totalFiles: result.total_files || 0,
			totalSize: result.total_size || 0,
			imageCount: result.image_count || 0,
			videoCount: result.video_count || 0,
			documentCount: result.document_count || 0
		};
	}

	/**
	 * Transform database row to MediaFile interface
	 */
	private transformRow(row: MediaFileRow): MediaFile {
		return {
			id: row.id,
			filename: row.filename,
			original_filename: row.original_filename,
			file_path: row.file_path,
			file_url: row.file_url,
			file_type: row.file_type,
			file_size: row.file_size,
			mime_type: row.mime_type,
			width: row.width || undefined,
			height: row.height || undefined,
			duration: row.duration || undefined,
			alt_text: row.alt_text || undefined,
			created_at: row.created_at,
			updated_at: row.updated_at
		};
	}
}
