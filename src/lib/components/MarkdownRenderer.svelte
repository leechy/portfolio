<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';

  export let content: string = '';

  let processedContent = '';

  // Configure marked for better security and formatting
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true // Convert line breaks to <br>
  });

  // Process markdown content
  async function processMarkdown(markdown: string) {
    if (!markdown) {
      processedContent = '';
      return;
    }

    try {
      const html = await marked(markdown);
      processedContent = html;
    } catch (error) {
      console.error('Error processing markdown:', error);
      processedContent = markdown; // Fallback to raw content
    }
  }

  // Process content when it changes
  $: {
    processMarkdown(content);
  }

  onMount(() => {
    processMarkdown(content);
  });
</script>

<!-- Render the processed HTML -->
<div class="markdown-content">
  {@html processedContent}
</div>

<style>
  :global(.markdown-content) {
    line-height: 1.75;
    color: var(--color-text-primary);
  }

  :global(.markdown-content h1),
  :global(.markdown-content h2),
  :global(.markdown-content h3),
  :global(.markdown-content h4),
  :global(.markdown-content h5),
  :global(.markdown-content h6) {
    color: #111827;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :global(.markdown-content h1) {
    font-size: 2.25rem;
    line-height: 1.2;
  }

  :global(.markdown-content h2) {
    font-size: 1.875rem;
    line-height: 1.3;
  }

  :global(.markdown-content h3) {
    font-size: 1.5rem;
    line-height: 1.4;
  }

  :global(.markdown-content p) {
    margin-bottom: 1.5rem;
  }

  :global(.markdown-content code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.875em;
  }

  :global(.markdown-content pre) {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  :global(.markdown-content pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }

  :global(.markdown-content blockquote) {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #6b7280;
  }

  :global(.markdown-content ul),
  :global(.markdown-content ol) {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
  }

  :global(.markdown-content li) {
    margin-bottom: 0.5rem;
  }

  :global(.markdown-content a) {
    color: #3b82f6;
    text-decoration: underline;
  }

  :global(.markdown-content a:hover) {
    color: #1d4ed8;
  }

  :global(.markdown-content img) {
    margin: 2rem 0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    height: auto;
  }

  :global(.markdown-content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }

  :global(.markdown-content th),
  :global(.markdown-content td) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }

  :global(.markdown-content th) {
    background-color: #f9fafb;
    font-weight: 600;
  }

  :global(.markdown-content hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2rem 0;
  }
</style>
