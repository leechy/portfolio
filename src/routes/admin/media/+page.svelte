<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/auth/auth';
  import { goto } from '$app/navigation';
  import { type MediaFile } from '$lib/server/database';

  // Media state
  let mediaFiles: MediaFile[] = [];
  let uploadFiles: File[] = [];
  let isUploading = false;
  let selectedFiles = [] as boolean[];
  let searchTerm = '';
  let currentFilter = 'all'; // all, images, videos, documents

  // File preview state
  let previewFile: MediaFile | null = null;
  let showPreview = false;

  // Editing state
  let editingFile: MediaFile | null = null;
  let editingName = ''; // Display name (original_filename)
  let editingFilename = ''; // Actual filename on disk
  let editingAltText = '';

  // Error handling
  let error = '';
  let success = '';

  let fileInput: HTMLInputElement;

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

  // Load existing media files from API
  async function loadMediaFiles() {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (currentFilter !== 'all') params.append('type', currentFilter);

      const response = await fetch(`/api/media?${params}`);
      const result = await response.json();

      if (result.success) {
        mediaFiles = result.data.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.created_at),
          name: file.original_filename,
          type: file.mime_type,
          size: file.file_size,
          url: file.file_url,
          dimensions:
            file.width && file.height ? { width: file.width, height: file.height } : undefined,
          duration: file.duration
        }));
      } else {
        error = result.error || 'Failed to load media files';
      }
    } catch (err) {
      error = 'Failed to load media files';
    }
  }

  // Handle file selection
  function handleFileSelect(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    uploadFiles = [...(uploadFiles || []), ...files];
  }

  // Handle drag and drop
  function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      uploadFiles = [...(uploadFiles || []), ...files];
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Remove file from upload queue
  function removeUploadFile(index: number) {
    uploadFiles = uploadFiles.filter((_, i) => i !== index);
  }

  // Upload files to server
  async function uploadMediaFiles() {
    if (uploadFiles.length === 0) return;

    isUploading = true;
    error = '';
    success = '';

    try {
      const formData = new FormData();
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        success = `Successfully uploaded ${uploadFiles.length} file(s)`;
        uploadFiles = [];
        await loadMediaFiles(); // Reload the media list
      } else {
        error = result.error || 'Upload failed';
      }
    } catch (err) {
      error = 'Failed to upload files';
    } finally {
      isUploading = false;
    }
  }

  // Delete selected files
  async function deleteSelectedFiles() {
    const filesToDelete = selectedFiles.filter(v => v).length;
    if (filesToDelete === 0) return;

    if (!confirm(`Delete ${filesToDelete} file(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: [
            ...selectedFiles
              .entries()
              .filter(v => v[1])
              .map(e => e[0])
          ]
        })
      });

      const result = await response.json();

      if (result.success) {
        success = `Successfully deleted ${result.data.deletedCount} file(s)`;
        selectedFiles = [];
        await loadMediaFiles(); // Reload the media list
      } else {
        error = result.error || 'Failed to delete files';
      }
    } catch (err) {
      error = 'Failed to delete files';
    }
  }

  // Preview file
  function previewMedia(file: MediaFile) {
    previewFile = file;
    showPreview = true;
  }

  // Start editing file
  function startEditingFile(file: MediaFile) {
    editingFile = file;
    editingName = file.original_filename;
    editingFilename = file.filename;
    editingAltText = file.alt_text || '';
  }

  // Save file edits
  async function saveFileEdits() {
    if (!editingFile) return;

    try {
      const response = await fetch(`/api/media/${editingFile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: editingFilename, // This will rename the actual file
          original_filename: editingName,
          alt_text: editingAltText
        })
      });

      const result = await response.json();

      if (result.success) {
        success = 'File updated successfully';
        editingFile = null;
        await loadMediaFiles(); // Reload the media list
      } else {
        error = result.error || 'Failed to update file';
      }
    } catch (err) {
      error = 'Failed to update file';
    }
  }

  // Cancel editing
  function cancelEdit() {
    editingFile = null;
    editingName = '';
    editingAltText = '';
  }

  // Copy markdown link to clipboard
  async function copyMarkdownLink(file: MediaFile | null) {
    if (!file) return;

    const isImage = file.file_type.startsWith('image/');
    const markdownLink = isImage
      ? `![${file.alt_text || file.filename}](${file.file_url})`
      : `[${file.filename}](${file.file_url})`;

    try {
      await navigator.clipboard.writeText(markdownLink);
      success = `Markdown link copied to clipboard: ${markdownLink}`;
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = markdownLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      success = `Markdown link copied to clipboard: ${markdownLink}`;
    }
  }

  // Copy direct URL to clipboard
  async function copyDirectUrl(file: MediaFile | null) {
    if (!file) return;

    try {
      await navigator.clipboard.writeText(file.file_url);
      success = `URL copied to clipboard: ${file.file_url}`;
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = file.file_url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      success = `URL copied to clipboard: ${file.file_url}`;
    }
  }

  // Search and filter reactively
  $: {
    if (searchTerm !== undefined || currentFilter !== undefined) {
      const debounceTimer = setTimeout(() => {
        loadMediaFiles();
      }, 300);

      // Clear timeout to debounce
      // return () => clearTimeout(debounceTimer);
    }
  }

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Since filtering is now done server-side, we just use mediaFiles directly
  $: filteredFiles = mediaFiles;

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
      role="button"
      tabindex="0"
      on:click={() => fileInput.click()}
      on:keydown={e => {
        if (e.key === 'Enter') fileInput.click();
      }}
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
          bind:this={fileInput}
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
              <button
                class="remove-btn"
                on:click={() => removeUploadFile(index)}
                aria-label="Remove File"
              >
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
        {#if selectedFiles.filter(v => v).length > 0}
          <button
            class="btn-danger"
            on:click={deleteSelectedFiles}
            data-testid="delete-selected-btn"
          >
            Delete Selected ({selectedFiles.filter(v => v).length})
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
            <input type="checkbox" bind:checked={selectedFiles[file.id]} />
          </label>

          <!-- File preview -->
          <div
            class="file-preview"
            on:click={() => previewMedia(file)}
            on:keydown={e => {
              if (e.key === 'Enter') previewMedia(file);
            }}
            tabindex="0"
            role="button"
          >
            {#if file.file_type.startsWith('image')}
              <img src={file.file_url} alt={file.filename} loading="lazy" />
            {:else if file.file_type.startsWith('video')}
              <div class="video-thumbnail">
                <svg class="play-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {#if file.duration}
                  <span class="video-duration"
                    >{Math.floor(file.duration / 60)}:{(file.duration % 60)
                      .toString()
                      .padStart(2, '0')}</span
                  >
                {/if}
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
            <h4 class="file-name" title={file.filename}>{file.filename}</h4>
            <div class="file-meta">
              <span class="file-size">{formatFileSize(file.file_size)}</span>
              {#if file.width && file.height}
                <span class="file-dimensions">{file.width}×{file.height}</span>
              {/if}
            </div>
            <div class="file-date">
              {new Date(file.created_at).toLocaleDateString()}
            </div>
          </div>

          <!-- Actions -->
          <div class="file-actions">
            <button
              class="action-btn"
              on:click={() => copyMarkdownLink(file)}
              title="Copy Markdown Link"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
            <button class="action-btn" on:click={() => copyDirectUrl(file)} title="Copy Direct URL">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button class="action-btn" on:click={() => startEditingFile(file)} title="Edit/Rename">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
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
            <a href={file.file_url} download={file.filename} class="action-btn" title="Download">
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
  <div
    class="modal-overlay"
    on:click={() => (showPreview = false)}
    on:keydown={e => e.key === 'Escape' && (showPreview = false)}
    role="none"
    tabindex="-1"
  >
    <div
      class="preview-modal"
      on:click|stopPropagation
      on:keydown={e => e.key === 'Escape' && (showPreview = false)}
      role="dialog"
      aria-modal="true"
      tabindex="0"
    >
      <div class="modal-header">
        <h3>{previewFile.filename}</h3>
        <button
          class="close-btn"
          on:click={() => (showPreview = false)}
          aria-label="Close Preview Modal"
        >
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
        {#if previewFile.file_type.startsWith('image')}
          <img src={previewFile.file_url} alt={previewFile.filename} />
        {:else if previewFile.file_type.startsWith('video')}
          <video controls>
            <track kind="captions" src={previewFile.captions_url} srcLang="en" label="English" />
            <source src={previewFile.file_url} type={previewFile.file_type} />
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
            <a href={previewFile.file_url} download={previewFile.filename} class="download-link">
              Download File
            </a>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <div class="file-details">
          <p><strong>Size:</strong> {formatFileSize(previewFile.file_size)}</p>
          <p><strong>Type:</strong> {previewFile.file_type}</p>
          {#if previewFile.width && previewFile.height}
            <p>
              <strong>Dimensions:</strong>
              {previewFile.width}×{previewFile.height}
            </p>
          {/if}
          <p><strong>Uploaded:</strong> {new Date(previewFile.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if editingFile}
  <div
    class="modal-overlay"
    on:click={cancelEdit}
    role="none"
    tabindex="-1"
    on:keydown={e => e.key === 'Escape' && cancelEdit()}
  >
    <div
      class="edit-modal"
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      tabindex="0"
      on:keydown={e => e.key === 'Escape' && cancelEdit()}
    >
      <div class="modal-header">
        <h3>Edit Media File</h3>
        <button class="close-btn" on:click={cancelEdit} aria-label="Close Edit Modal">
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
        <div class="edit-form">
          <div class="form-group">
            <label for="edit-display-name">Display Name:</label>
            <input
              id="edit-display-name"
              type="text"
              bind:value={editingName}
              placeholder="Enter display name"
            />
            <small>This is the name shown in your content library</small>
          </div>

          <div class="form-group">
            <label for="edit-filename">Actual Filename:</label>
            <input
              id="edit-filename"
              type="text"
              bind:value={editingFilename}
              placeholder="Enter actual filename"
            />
            <small>This will rename the actual file on disk. Include file extension!</small>
          </div>

          <div class="form-group">
            <label for="edit-alt-text">Alt Text (for images):</label>
            <input
              id="edit-alt-text"
              type="text"
              bind:value={editingAltText}
              placeholder="Describe the image for accessibility"
            />
          </div>

          {#if editingFile}
            <div class="form-group">
              <h3>Current URL:</h3>
              <div class="url-display">
                <code>{editingFile.file_url}</code>
                <button class="copy-btn" on:click={() => copyDirectUrl(editingFile)}> Copy </button>
              </div>
            </div>

            <div class="form-group">
              <h3>Markdown Links:</h3>
              <div class="markdown-links">
                <div class="link-option">
                  <span>Image:</span>
                  <code>![{editingAltText || editingName}]({editingFile.file_url})</code>
                  <button class="copy-btn" on:click={() => copyMarkdownLink(editingFile)}>
                    Copy
                  </button>
                </div>
                <div class="link-option">
                  <span>Link:</span>
                  <code>[{editingName}]({editingFile.file_url})</code>
                  <button class="copy-btn" on:click={() => copyDirectUrl(editingFile)}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" on:click={cancelEdit}>Cancel</button>
        <button class="btn-upload" on:click={saveFileEdits}>Save Changes</button>
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
    flex-wrap: wrap;
    flex-direction: row-reverse;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
    max-width: 100px; // Allow wrapping for more buttons
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

  // Edit Modal Styles
  .edit-modal {
    background: white;
    border-radius: 0.75rem;
    max-width: 600px;
    width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .edit-form {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
      }

      input {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }

      small {
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 0.25rem;
      }
    }

    .url-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;

      code {
        flex: 1;
        font-size: 0.875rem;
        color: #374151;
        background: none;
        word-break: break-all;
      }

      .copy-btn {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #2563eb;
        }
      }
    }

    .markdown-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .link-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;

        span {
          font-weight: 500;
          color: #64748b;
          min-width: 50px;
          font-size: 0.875rem;
        }

        code {
          flex: 1;
          font-size: 0.875rem;
          color: #374151;
          background: none;
          word-break: break-all;
        }

        .copy-btn {
          padding: 0.5rem 1rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s;

          &:hover {
            background: #059669;
          }
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

    .edit-modal {
      width: 95vw;
      max-height: 95vh;
    }

    .edit-form .markdown-links .link-option {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .edit-form .url-display {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
</style>
