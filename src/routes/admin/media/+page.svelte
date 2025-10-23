<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/auth/auth';
	import { goto } from '$app/navigation';

	// Media state
	let mediaFiles = [];
	let uploadFiles = [];
	let isUploading = false;
	let selectedFiles = new Set();
	let searchTerm = '';
	let currentFilter = 'all'; // all, images, videos, documents

	// File preview state
	let previewFile = null;
	let showPreview = false;

	// Error handling
	let error = '';
	let success = '';

	// Check authentication on mount
	onMount(() => {
		const unsubscribe = authStore.subscribe(auth => {
			if (!auth.loading && !auth.isAuthenticated) {
				goto('/admin/login');
			}
		});

		loadMediaFiles();

		return unsubscribe;
	});

	// Load existing media files
	async function loadMediaFiles() {
		try {
			// Simulate loading media files - replace with actual API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Mock data for demonstration
			mediaFiles = [
				{
					id: 1,
					name: 'hero-image.jpg',
					type: 'image/jpeg',
					size: 245760,
					url: '/images/placeholder.jpg',
					uploadDate: new Date('2024-01-15'),
					dimensions: { width: 1920, height: 1080 }
				},
				{
					id: 2,
					name: 'profile-photo.png',
					type: 'image/png',
					size: 102400,
					url: '/images/placeholder.jpg',
					uploadDate: new Date('2024-01-10'),
					dimensions: { width: 400, height: 400 }
				},
				{
					id: 3,
					name: 'project-demo.mp4',
					type: 'video/mp4',
					size: 5242880,
					url: '/videos/placeholder.mp4',
					uploadDate: new Date('2024-01-05'),
					duration: 120
				}
			];
		} catch (err) {
			error = 'Failed to load media files';
		}
	}

	// Handle file selection
	function handleFileSelect(event) {
		const files = Array.from(event.target.files);
		uploadFiles = [...uploadFiles, ...files];
	}

	// Handle drag and drop
	function handleDrop(event) {
		event.preventDefault();
		const files = Array.from(event.dataTransfer.files);
		uploadFiles = [...uploadFiles, ...files];
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	// Remove file from upload queue
	function removeUploadFile(index) {
		uploadFiles = uploadFiles.filter((_, i) => i !== index);
	}

	// Upload files
	async function uploadMediaFiles() {
		if (uploadFiles.length === 0) return;

		isUploading = true;
		error = '';
		success = '';

		try {
			// Simulate file upload - replace with actual upload logic
			for (const file of uploadFiles) {
				await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time

				// Create mock media entry
				const newMedia = {
					id: Date.now() + Math.random(),
					name: file.name,
					type: file.type,
					size: file.size,
					url: URL.createObjectURL(file),
					uploadDate: new Date(),
					...(file.type.startsWith('image/') && { dimensions: { width: 800, height: 600 } }),
					...(file.type.startsWith('video/') && { duration: 60 })
				};

				mediaFiles = [...mediaFiles, newMedia];
			}

			success = `Successfully uploaded ${uploadFiles.length} file(s)`;
			uploadFiles = [];
		} catch (err) {
			error = 'Failed to upload files';
		} finally {
			isUploading = false;
		}
	}

	// Delete selected files
	async function deleteSelectedFiles() {
		if (selectedFiles.size === 0) return;

		if (!confirm(`Delete ${selectedFiles.size} file(s)? This action cannot be undone.`)) {
			return;
		}

		try {
			// Simulate deletion - replace with actual API call
			await new Promise(resolve => setTimeout(resolve, 500));

			mediaFiles = mediaFiles.filter(file => !selectedFiles.has(file.id));
			selectedFiles.clear();
			selectedFiles = new Set(); // Trigger reactivity

			success = 'Files deleted successfully';
		} catch (err) {
			error = 'Failed to delete files';
		}
	}

	// Preview file
	function previewMedia(file) {
		previewFile = file;
		showPreview = true;
	}

	// Format file size
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Filter files
	$: filteredFiles = mediaFiles.filter(file => {
		// Search filter
		if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
			return false;
		}

		// Type filter
		if (currentFilter === 'images' && !file.type.startsWith('image/')) {
			return false;
		}
		if (currentFilter === 'videos' && !file.type.startsWith('video/')) {
			return false;
		}
		if (
			(currentFilter === 'documents' && file.type.startsWith('image/')) ||
			file.type.startsWith('video/')
		) {
			return false;
		}

		return true;
	});

	// Clear messages after delay
	$: if (success || error) {
		setTimeout(() => {
			success = '';
			error = '';
		}, 5000);
	}
</script>

<svelte:head>
	<title>Media Management - Admin</title>
</svelte:head>

<div class="media-container">
	<div class="media-header">
		<h1>Media Management</h1>
		<p>Upload, organize, and manage your media files</p>
	</div>

	<!-- Messages -->
	{#if error}
		<div class="message error" data-testid="error-message">
			{error}
		</div>
	{/if}

	{#if success}
		<div class="message success" data-testid="success-message">
			{success}
		</div>
	{/if}

	<!-- Upload Section -->
	<div class="upload-section">
		<div
			class="upload-area"
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			data-testid="upload-area"
		>
			<div class="upload-content">
				<svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
					/>
				</svg>
				<h3>Upload Media Files</h3>
				<p>Drag and drop files here, or click to browse</p>
				<input
					type="file"
					multiple
					accept="image/*,video/*,.pdf,.doc,.docx"
					on:change={handleFileSelect}
					data-testid="file-input"
				/>
			</div>
		</div>

		<!-- Upload Queue -->
		{#if uploadFiles.length > 0}
			<div class="upload-queue">
				<h3>Upload Queue ({uploadFiles.length} files)</h3>
				<div class="queue-files">
					{#each uploadFiles as file, index}
						<div class="queue-item" data-testid="queue-item">
							<div class="file-info">
								<span class="file-name">{file.name}</span>
								<span class="file-size">{formatFileSize(file.size)}</span>
							</div>
							<button class="remove-btn" on:click={() => removeUploadFile(index)}>
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
				<div class="upload-actions">
					<button
						class="btn-upload"
						on:click={uploadMediaFiles}
						disabled={isUploading}
						data-testid="upload-btn"
					>
						{#if isUploading}
							<svg class="spinner" viewBox="0 0 24 24">
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
									opacity="0.25"
								/>
								<path
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Uploading...
						{:else}
							Upload Files
						{/if}
					</button>
					<button class="btn-secondary" on:click={() => (uploadFiles = [])}> Clear Queue </button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Media Library -->
	<div class="media-library">
		<div class="library-header">
			<h2>Media Library ({filteredFiles.length} files)</h2>
			<div class="library-controls">
				<!-- Search -->
				<div class="search-box">
					<input
						type="text"
						placeholder="Search files..."
						bind:value={searchTerm}
						data-testid="search-input"
					/>
					<svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>

				<!-- Filter -->
				<select bind:value={currentFilter} data-testid="filter-select">
					<option value="all">All Files</option>
					<option value="images">Images</option>
					<option value="videos">Videos</option>
					<option value="documents">Documents</option>
				</select>

				<!-- Actions -->
				{#if selectedFiles.size > 0}
					<button
						class="btn-danger"
						on:click={deleteSelectedFiles}
						data-testid="delete-selected-btn"
					>
						Delete Selected ({selectedFiles.size})
					</button>
				{/if}
			</div>
		</div>

		<!-- Media Grid -->
		<div class="media-grid" data-testid="media-grid">
			{#each filteredFiles as file}
				<div class="media-item" data-testid="media-item">
					<!-- Selection checkbox -->
					<label class="selection-checkbox">
						<input
							type="checkbox"
							checked={selectedFiles.has(file.id)}
							on:change={e => {
								if (e.target.checked) {
									selectedFiles.add(file.id);
								} else {
									selectedFiles.delete(file.id);
								}
								selectedFiles = new Set(selectedFiles);
							}}
						/>
					</label>

					<!-- File preview -->
					<div class="file-preview" on:click={() => previewMedia(file)}>
						{#if file.type.startsWith('image/')}
							<img src={file.url} alt={file.name} loading="lazy" />
						{:else if file.type.startsWith('video/')}
							<div class="video-thumbnail">
								<svg class="play-icon" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z" />
								</svg>
								<span class="video-duration"
									>{Math.floor(file.duration / 60)}:{(file.duration % 60)
										.toString()
										.padStart(2, '0')}</span
								>
							</div>
						{:else}
							<div class="document-thumbnail">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<!-- File info -->
					<div class="file-info">
						<h4 class="file-name" title={file.name}>{file.name}</h4>
						<div class="file-meta">
							<span class="file-size">{formatFileSize(file.size)}</span>
							{#if file.dimensions}
								<span class="file-dimensions">{file.dimensions.width}×{file.dimensions.height}</span
								>
							{/if}
						</div>
						<div class="file-date">
							{file.uploadDate.toLocaleDateString()}
						</div>
					</div>

					<!-- Actions -->
					<div class="file-actions">
						<button class="action-btn" on:click={() => previewMedia(file)} title="Preview">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						</button>
						<a href={file.url} download={file.name} class="action-btn" title="Download">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</a>
					</div>
				</div>
			{:else}
				<div class="empty-state" data-testid="empty-state">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<h3>No media files found</h3>
					<p>Upload some files to get started</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Preview Modal -->
{#if showPreview && previewFile}
	<div class="modal-overlay" on:click={() => (showPreview = false)}>
		<div class="preview-modal" on:click|stopPropagation>
			<div class="modal-header">
				<h3>{previewFile.name}</h3>
				<button class="close-btn" on:click={() => (showPreview = false)}>
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="modal-content">
				{#if previewFile.type.startsWith('image/')}
					<img src={previewFile.url} alt={previewFile.name} />
				{:else if previewFile.type.startsWith('video/')}
					<video controls>
						<source src={previewFile.url} type={previewFile.type} />
						Your browser does not support the video tag.
					</video>
				{:else}
					<div class="document-preview">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<p>Preview not available for this file type</p>
						<a href={previewFile.url} download={previewFile.name} class="download-link">
							Download File
						</a>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<div class="file-details">
					<p><strong>Size:</strong> {formatFileSize(previewFile.size)}</p>
					<p><strong>Type:</strong> {previewFile.type}</p>
					{#if previewFile.dimensions}
						<p>
							<strong>Dimensions:</strong>
							{previewFile.dimensions.width}×{previewFile.dimensions.height}
						</p>
					{/if}
					<p><strong>Uploaded:</strong> {previewFile.uploadDate.toLocaleDateString()}</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.media-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.media-header {
		text-align: center;
		margin-bottom: 3rem;

		h1 {
			font-size: 2.5rem;
			font-weight: 700;
			color: #1e293b;
			margin: 0 0 0.5rem 0;
		}

		p {
			color: #64748b;
			font-size: 1.1rem;
		}
	}

	.message {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		font-weight: 500;

		&.error {
			background: #fef2f2;
			color: #dc2626;
			border: 1px solid #fecaca;
		}

		&.success {
			background: #f0fdf4;
			color: #16a34a;
			border: 1px solid #bbf7d0;
		}
	}

	.upload-section {
		background: #f8fafc;
		border-radius: 1rem;
		padding: 2rem;
		margin-bottom: 3rem;
		border: 2px dashed #cbd5e1;
		transition: border-color 0.2s;

		&:hover {
			border-color: #3b82f6;
		}
	}

	.upload-area {
		position: relative;
		cursor: pointer;

		input[type='file'] {
			position: absolute;
			inset: 0;
			opacity: 0;
			cursor: pointer;
		}
	}

	.upload-content {
		text-align: center;
		padding: 2rem;

		.upload-icon {
			width: 3rem;
			height: 3rem;
			color: #64748b;
			margin: 0 auto 1rem;
		}

		h3 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #374151;
			margin: 0 0 0.5rem 0;
		}

		p {
			color: #64748b;
			margin: 0;
		}
	}

	.upload-queue {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e2e8f0;

		h3 {
			font-size: 1.1rem;
			font-weight: 600;
			color: #374151;
			margin: 0 0 1rem 0;
		}
	}

	.queue-files {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.queue-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;

		.file-info {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			.file-name {
				font-weight: 500;
				color: #374151;
			}

			.file-size {
				font-size: 0.875rem;
				color: #64748b;
			}
		}

		.remove-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			background: none;
			border: none;
			color: #dc2626;
			cursor: pointer;
			border-radius: 50%;
			transition: background 0.2s;

			&:hover {
				background: #fef2f2;
			}

			svg {
				width: 1rem;
				height: 1rem;
			}
		}
	}

	.upload-actions {
		display: flex;
		gap: 1rem;
	}

	.btn-upload,
	.btn-secondary,
	.btn-danger {
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.btn-upload {
		background: #3b82f6;
		color: white;

		&:hover:not(:disabled) {
			background: #2563eb;
		}
	}

	.btn-secondary {
		background: #f1f5f9;
		color: #475569;
		border: 1px solid #e2e8f0;

		&:hover {
			background: #e2e8f0;
		}
	}

	.btn-danger {
		background: #dc2626;
		color: white;

		&:hover {
			background: #b91c1c;
		}
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.media-library {
		.library-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 2rem;
			flex-wrap: wrap;
			gap: 1rem;

			h2 {
				font-size: 1.5rem;
				font-weight: 600;
				color: #374151;
				margin: 0;
			}
		}

		.library-controls {
			display: flex;
			align-items: center;
			gap: 1rem;
			flex-wrap: wrap;
		}

		.search-box {
			position: relative;

			input {
				padding: 0.5rem 2.5rem 0.5rem 1rem;
				border: 1px solid #d1d5db;
				border-radius: 0.5rem;
				width: 200px;

				&:focus {
					outline: none;
					border-color: #3b82f6;
					box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
				}
			}

			.search-icon {
				position: absolute;
				right: 0.75rem;
				top: 50%;
				transform: translateY(-50%);
				width: 1rem;
				height: 1rem;
				color: #9ca3af;
			}
		}

		select {
			padding: 0.5rem 1rem;
			border: 1px solid #d1d5db;
			border-radius: 0.5rem;
			background: white;
			cursor: pointer;

			&:focus {
				outline: none;
				border-color: #3b82f6;
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
			}
		}
	}

	.media-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.media-item {
		position: relative;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}
	}

	.selection-checkbox {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 10;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 4px;
		padding: 0.25rem;

		input[type='checkbox'] {
			cursor: pointer;
		}
	}

	.file-preview {
		position: relative;
		height: 200px;
		cursor: pointer;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.video-thumbnail,
		.document-thumbnail {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f1f5f9;
			color: #64748b;
			flex-direction: column;

			svg {
				width: 3rem;
				height: 3rem;
			}
		}

		.video-thumbnail {
			position: relative;

			.play-icon {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: rgba(0, 0, 0, 0.7);
				color: white;
				border-radius: 50%;
				padding: 0.75rem;
			}

			.video-duration {
				position: absolute;
				bottom: 0.5rem;
				right: 0.5rem;
				background: rgba(0, 0, 0, 0.8);
				color: white;
				padding: 0.25rem 0.5rem;
				border-radius: 0.25rem;
				font-size: 0.75rem;
			}
		}
	}

	.file-info {
		padding: 1rem;

		.file-name {
			font-weight: 600;
			color: #374151;
			margin: 0 0 0.5rem 0;
			font-size: 0.875rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.file-meta {
			display: flex;
			gap: 0.75rem;
			margin-bottom: 0.5rem;
			font-size: 0.75rem;
			color: #64748b;
		}

		.file-date {
			font-size: 0.75rem;
			color: #9ca3af;
		}
	}

	.file-actions {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.media-item:hover .file-actions {
		opacity: 1;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: rgba(255, 255, 255, 0.95);
		border: none;
		border-radius: 0.25rem;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;

		&:hover {
			background: white;
			color: #374151;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 3rem;
		color: #64748b;

		svg {
			width: 4rem;
			height: 4rem;
			margin: 0 auto 1rem;
		}

		h3 {
			font-size: 1.25rem;
			font-weight: 600;
			margin: 0 0 0.5rem 0;
		}

		p {
			margin: 0;
		}
	}

	// Modal styles
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.preview-modal {
		background: white;
		border-radius: 0.75rem;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e2e8f0;

		h3 {
			font-size: 1.1rem;
			font-weight: 600;
			color: #374151;
			margin: 0;
		}

		.close-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			background: none;
			border: none;
			color: #64748b;
			cursor: pointer;
			border-radius: 50%;

			&:hover {
				background: #f1f5f9;
			}

			svg {
				width: 1rem;
				height: 1rem;
			}
		}
	}

	.modal-content {
		padding: 1rem;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: auto;

		img,
		video {
			max-width: 100%;
			max-height: 60vh;
			object-fit: contain;
		}

		.document-preview {
			text-align: center;
			padding: 2rem;
			color: #64748b;

			svg {
				width: 4rem;
				height: 4rem;
				margin-bottom: 1rem;
			}

			.download-link {
				display: inline-block;
				margin-top: 1rem;
				padding: 0.75rem 1.5rem;
				background: #3b82f6;
				color: white;
				text-decoration: none;
				border-radius: 0.5rem;
				font-weight: 500;
				transition: background 0.2s;

				&:hover {
					background: #2563eb;
				}
			}
		}
	}

	.modal-footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid #e2e8f0;
		background: #f8fafc;

		.file-details {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 0.5rem;
			font-size: 0.875rem;

			p {
				margin: 0;
				color: #64748b;

				strong {
					color: #374151;
				}
			}
		}
	}

	@media (max-width: 768px) {
		.media-container {
			padding: 1rem;
		}

		.media-header h1 {
			font-size: 2rem;
		}

		.upload-section {
			padding: 1rem;
		}

		.library-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.library-controls {
			width: 100%;
		}

		.search-box input {
			width: 100%;
		}

		.media-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1rem;
		}
	}
</style>
