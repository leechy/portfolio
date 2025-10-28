import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Setup DOMPurify for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Configure marked with security and syntax highlighting
 */
export function setupMarkdown() {
  // Configure marked options
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true // Convert line breaks to <br>
  });

  // Custom renderer for better styling
  const renderer = new marked.Renderer();

  // Custom heading renderer with anchor links
  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const anchor = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${depth} id="${anchor}">
			<a href="#${anchor}" class="anchor-link">${text}</a>
		</h${depth}>`;
  };

  // Custom code block renderer
  renderer.code = ({ text, lang }) => {
    const validLang = lang || 'text';
    return `<pre class="code-block"><code class="language-${validLang}">${text}</code></pre>`;
  };

  // Custom link renderer (open external links in new tab)
  renderer.link = ({ href, title, tokens }) => {
    const text = renderer.parser.parseInline(tokens);
    const isExternal = href.startsWith('http');
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
  };

  // Custom image renderer with lazy loading
  renderer.image = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" />`;
  };

  marked.use({ renderer });
}

/**
 * Convert Markdown to safe HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) {
    return '';
  }

  try {
    // Convert markdown to HTML
    const html = await marked(markdown);

    // Sanitize the HTML to prevent XSS attacks
    const cleanHtml = purify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'a',
        'img',
        'code',
        'pre',
        'ul',
        'ol',
        'li',
        'blockquote',
        'hr',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'div',
        'span'
      ],
      ALLOWED_ATTR: ['href', 'title', 'alt', 'src', 'target', 'rel', 'class', 'id', 'loading']
    });

    return cleanHtml;
  } catch {
    // Log error for debugging but return fallback
    return markdown; // Return original markdown as fallback
  }
}

/**
 * Extract plain text from markdown (for excerpts, meta descriptions)
 */
export async function markdownToPlainText(markdown: string, maxLength?: number): Promise<string> {
  if (!markdown) {
    return '';
  }

  try {
    // Convert to HTML first
    const html = await marked(markdown);

    // Strip HTML tags
    const plainText = html.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    const decoded = plainText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Trim and limit length if specified
    const trimmed = decoded.trim();
    if (maxLength && trimmed.length > maxLength) {
      return trimmed.substring(0, maxLength).trim() + '...';
    }

    return trimmed;
  } catch {
    return markdown.substring(0, maxLength || markdown.length);
  }
}

// Initialize markdown configuration
setupMarkdown();
