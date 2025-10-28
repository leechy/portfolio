/**
 * Image optimization and handling utilities
 * Provides responsive image generation, optimization, and lazy loading support
 */

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  quality?: number;
  placeholder?: string;
  className?: string;
}

export interface ImageBreakpoint {
  width: number;
  suffix?: string;
}

export interface OptimizedImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  placeholder?: string;
  dimensions?: ImageDimensions;
}

export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
}

// =============================================================================
// Configuration
// =============================================================================

// Default breakpoints for responsive images
export const DEFAULT_BREAKPOINTS: ImageBreakpoint[] = [
  { width: 320, suffix: 'xs' },
  { width: 640, suffix: 'sm' },
  { width: 768, suffix: 'md' },
  { width: 1024, suffix: 'lg' },
  { width: 1280, suffix: 'xl' },
  { width: 1920, suffix: '2xl' }
];

// Supported image formats in order of preference
export const SUPPORTED_FORMATS = ['webp', 'avif', 'jpg', 'png'] as const;
export type ImageFormat = (typeof SUPPORTED_FORMATS)[number];

// Default image quality settings
export const DEFAULT_QUALITY = {
  webp: 85,
  avif: 75,
  jpg: 85,
  png: 100
} as const;

// =============================================================================
// Image Path Utilities
// =============================================================================

/**
 * Generate optimized image path for given parameters
 */
export function getOptimizedImagePath(
  src: string,
  width?: number,
  format?: ImageFormat,
  quality?: number
): string {
  // Handle external URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Remove leading slash and file extension
  const basePath = src.replace(/^\/+/, '').replace(/\.[^.]+$/, '');

  // Build optimized path
  let optimizedPath = `/images/optimized/${basePath}`;

  const params = [];
  if (width) {
    params.push(`w_${width}`);
  }
  if (format) {
    params.push(format);
  }
  if (quality) {
    params.push(`q_${quality}`);
  }

  if (params.length > 0) {
    optimizedPath += `_${params.join('_')}`;
  }

  // Add appropriate file extension
  const extension = format || getImageFormat(src);
  optimizedPath += `.${extension}`;

  return optimizedPath;
}

/**
 * Extract image format from filename
 */
export function getImageFormat(src: string): string {
  const match = src.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
}

/**
 * Generate srcSet string for responsive images
 */
export function generateSrcSet(
  src: string,
  breakpoints: ImageBreakpoint[] = DEFAULT_BREAKPOINTS,
  format?: ImageFormat,
  quality?: number
): string {
  return breakpoints
    .map(bp => {
      const optimizedSrc = getOptimizedImagePath(src, bp.width, format, quality);
      return `${optimizedSrc} ${bp.width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: ImageBreakpoint[] = DEFAULT_BREAKPOINTS): string {
  const sizes = breakpoints.map((bp, index) => {
    if (index === breakpoints.length - 1) {
      // Last breakpoint - no media query needed
      return `${bp.width}px`;
    }
    return `(max-width: ${bp.width}px) ${bp.width}px`;
  });

  return sizes.join(', ');
}

// =============================================================================
// Responsive Image Generation
// =============================================================================

/**
 * Create optimized image set with multiple formats and sizes
 */
export function createResponsiveImageSet(
  src: string,
  options: {
    breakpoints?: ImageBreakpoint[];
    formats?: ImageFormat[];
    quality?: number;
    sizes?: string;
  } = {}
): Record<ImageFormat, OptimizedImageSet> {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    formats = ['webp', 'jpg'],
    quality,
    sizes = generateSizes(breakpoints)
  } = options;

  const imageSet: Record<string, OptimizedImageSet> = {};

  formats.forEach(format => {
    const formatQuality = quality || DEFAULT_QUALITY[format];

    imageSet[format] = {
      src: getOptimizedImagePath(src, undefined, format, formatQuality),
      srcSet: generateSrcSet(src, breakpoints, format, formatQuality),
      sizes
    };
  });

  return imageSet as Record<ImageFormat, OptimizedImageSet>;
}

/**
 * Generate picture element configuration for modern browsers
 */
export function generatePictureConfig(
  src: string,
  alt: string,
  options: {
    breakpoints?: ImageBreakpoint[];
    formats?: ImageFormat[];
    quality?: number;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'high' | 'low' | 'auto';
    className?: string;
  } = {}
): {
  sources: Array<{ srcSet: string; sizes: string; type: string }>;
  img: { src: string; alt: string; loading?: string; fetchpriority?: string; className?: string };
} {
  const {
    breakpoints = DEFAULT_BREAKPOINTS,
    formats = ['webp', 'jpg'],
    quality,
    sizes = generateSizes(breakpoints),
    loading = 'lazy',
    fetchpriority,
    className
  } = options;

  const sources = formats.slice(0, -1).map(format => {
    const formatQuality = quality || DEFAULT_QUALITY[format];
    return {
      srcSet: generateSrcSet(src, breakpoints, format, formatQuality),
      sizes,
      type: `image/${format}`
    };
  });

  // Fallback image (last format)
  const fallbackFormat = formats[formats.length - 1];
  const fallbackQuality = quality || DEFAULT_QUALITY[fallbackFormat];

  return {
    sources,
    img: {
      src: getOptimizedImagePath(
        src,
        breakpoints[breakpoints.length - 1].width,
        fallbackFormat,
        fallbackQuality
      ),
      alt,
      loading,
      fetchpriority,
      className
    }
  };
}

// =============================================================================
// Placeholder Generation
// =============================================================================

/**
 * Generate base64 placeholder for image
 */
export function generatePlaceholder(width = 10, height = 10, color = '#f3f4f6'): string {
  // Create SVG placeholder
  const svg = `
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" fill="${color}"/>
		</svg>
	`.trim();

  // Convert to base64
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate blurred placeholder from image dimensions
 */
export function generateBlurPlaceholder(
  width: number,
  height: number,
  primaryColor = '#e5e7eb'
): string {
  const aspectRatio = width / height;
  const placeholderWidth = 40;
  const placeholderHeight = Math.round(placeholderWidth / aspectRatio);

  const svg = `
		<svg width="${placeholderWidth}" height="${placeholderHeight}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="blur">
					<feGaussianBlur stdDeviation="2"/>
				</filter>
			</defs>
			<rect width="100%" height="100%" fill="${primaryColor}" filter="url(#blur)"/>
		</svg>
	`.trim();

  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

// =============================================================================
// Image Validation and Analysis
// =============================================================================

/**
 * Validate image URL/path
 */
export function validateImagePath(src: string): boolean {
  if (!src || typeof src !== 'string') {
    return false;
  }

  // Check for valid image extensions
  const validExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;

  // Allow external URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return true;
  }

  // Check local paths
  return validExtensions.test(src);
}

/**
 * Extract image metadata from filename/path
 */
export function parseImageMetadata(src: string): Partial<ImageMetadata> {
  const filename = src.split('/').pop() || '';
  const format = getImageFormat(filename);

  // Try to extract dimensions from filename (e.g., image_800x600.jpg)
  const dimensionMatch = filename.match(/(\d+)x(\d+)/);

  const metadata: Partial<ImageMetadata> = {
    src,
    format
  };

  if (dimensionMatch) {
    metadata.width = parseInt(dimensionMatch[1], 10);
    metadata.height = parseInt(dimensionMatch[2], 10);
    metadata.aspectRatio = metadata.width / metadata.height;
  }

  return metadata;
}

/**
 * Calculate optimal image dimensions for container
 */
export function calculateOptimalDimensions(
  containerWidth: number,
  containerHeight: number,
  imageAspectRatio: number,
  mode: 'contain' | 'cover' | 'fill' = 'cover'
): ImageDimensions {
  const containerAspectRatio = containerWidth / containerHeight;

  switch (mode) {
    case 'contain':
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container
        return {
          width: containerWidth,
          height: Math.round(containerWidth / imageAspectRatio)
        };
      } else {
        // Image is taller than container
        return {
          width: Math.round(containerHeight * imageAspectRatio),
          height: containerHeight
        };
      }

    case 'cover':
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container
        return {
          width: Math.round(containerHeight * imageAspectRatio),
          height: containerHeight
        };
      } else {
        // Image is taller than container
        return {
          width: containerWidth,
          height: Math.round(containerWidth / imageAspectRatio)
        };
      }

    case 'fill':
    default:
      return {
        width: containerWidth,
        height: containerHeight
      };
  }
}

// =============================================================================
// Performance Optimization Utilities
// =============================================================================

/**
 * Check if image should be loaded eagerly based on position
 */
export function shouldLoadEagerly(
  element?: HTMLElement | null,
  threshold = 600 // pixels from viewport
): boolean {
  if (!element || typeof window === 'undefined') {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  // Load eagerly if image is above the fold or close to it
  return rect.top <= viewportHeight + threshold;
}

/**
 * Get appropriate loading strategy based on image importance
 */
export function getLoadingStrategy(
  isCritical = false,
  isAboveFold = false
): { loading: 'lazy' | 'eager'; fetchpriority?: 'high' | 'low' | 'auto' } {
  if (isCritical || isAboveFold) {
    return {
      loading: 'eager',
      fetchpriority: 'high'
    };
  }

  return {
    loading: 'lazy',
    fetchpriority: 'low'
  };
}

/**
 * Preload critical images
 */
export function preloadImage(
  src: string,
  options: { as?: string; crossorigin?: string } = {}
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = options.as || 'image';

  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }

  document.head.appendChild(link);
}

// =============================================================================
// Lazy Loading Utilities
// =============================================================================

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: {
    rootMargin?: string;
    threshold?: number;
  } = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  const { rootMargin = '50px', threshold = 0 } = options;

  return new IntersectionObserver(
    entries => {
      entries.forEach(callback);
    },
    { rootMargin, threshold }
  );
}

/**
 * Setup lazy loading for image element
 */
export function setupLazyLoading(
  img: HTMLImageElement,
  actualSrc: string,
  options: {
    placeholder?: string;
    fadeIn?: boolean;
    onLoad?: () => void;
    onError?: () => void;
  } = {}
): () => void {
  const { placeholder, fadeIn = true, onLoad, onError } = options;

  // Set placeholder if provided
  if (placeholder) {
    img.src = placeholder;
  }

  // Store actual source
  img.dataset.src = actualSrc;

  // Apply initial styles for fade-in effect
  if (fadeIn) {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
  }

  const observer = createIntersectionObserver(
    entry => {
      if (entry.isIntersecting) {
        loadImage();
      }
    },
    { rootMargin: '50px' }
  );

  function loadImage(): void {
    const tempImg = new Image();

    tempImg.onload = () => {
      img.src = actualSrc;

      if (fadeIn) {
        img.style.opacity = '1';
      }

      img.classList.add('loaded');
      onLoad?.();
    };

    tempImg.onerror = () => {
      img.classList.add('error');
      onError?.();
    };

    tempImg.src = actualSrc;

    // Clean up observer
    if (observer) {
      observer.unobserve(img);
    }
  }

  // Start observing
  if (observer) {
    observer.observe(img);
  } else {
    // Fallback for browsers without Intersection Observer
    loadImage();
  }

  // Return cleanup function
  return () => {
    if (observer) {
      observer.unobserve(img);
    }
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') {
    return 1;
  }
  return window.devicePixelRatio || 1;
}

/**
 * Check if browser supports modern image formats
 */
export function checkImageFormatSupport(): Promise<Record<ImageFormat, boolean>> {
  if (typeof document === 'undefined') {
    return Promise.resolve({
      webp: false,
      avif: false,
      jpg: true,
      png: true
    });
  }

  const formats: ImageFormat[] = ['webp', 'avif', 'jpg', 'png'];

  const checks = formats.map(async format => {
    return new Promise<[ImageFormat, boolean]>(resolve => {
      const img = new Image();

      img.onload = () => resolve([format, img.width > 0 && img.height > 0]);
      img.onerror = () => resolve([format, false]);

      // Test images (1x1 pixel)
      const testImages = {
        webp: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABIAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=',
        jpg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA==',
        png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      };

      img.src = testImages[format] || testImages.jpg;
    });
  });

  return Promise.all(checks).then(results => {
    return Object.fromEntries(results) as Record<ImageFormat, boolean>;
  });
}
