import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      // Set the '@' alias to point to the 'src' directory
      '@': path.resolve(__dirname, './src')
    }
  },

  plugins: [sveltekit()],

  // Build optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['svelte']
        }
      }
    }
  },

  // Development server configuration
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    fs: {
      strict: false
    }
  },

  // Preview server configuration
  preview: {
    host: true,
    port: 4173,
    strictPort: false
  },

  // Asset optimization
  assetsInclude: ['**/*.md'],

  // Dependency optimization
  optimizeDeps: {
    include: ['better-sqlite3'],
    exclude: ['@sveltejs/kit', 'svelte']
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'sass:color';@use '@/lib/styles/variables.scss';`
      }
    }
  },

  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts']
        }
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
