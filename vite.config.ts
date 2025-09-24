import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Compression plugin for better performance (single compression to avoid duplicates)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/],
      threshold: 10240,
      deleteOriginFile: false,
    }),
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  // 🔧 Build Configuration
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false, // Disable in production for security
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800, // Reduced from 1000
    // Ensure proper ES module handling
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      external: ['@sentry/react'],
      output: {
        manualChunks: (id) => {
          // Core React chunk (smaller, more focused)
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react-core';
          }
          // Router chunk
          if (id.includes('react-router-dom')) {
            return 'vendor-router';
          }
          // UI libraries chunk (optimized)
          if (id.includes('@headlessui/react') || 
              id.includes('lucide-react') ||
              id.includes('tailwind-merge')) {
            return 'vendor-ui';
          }
          // Chart libraries chunk (consolidated)
          if (id.includes('recharts') || 
              id.includes('chart.js') ||
              id.includes('react-chartjs')) {
            return 'vendor-charts';
          }
          // Supabase chunk
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          // Crypto utilities chunk
          if (id.includes('bcryptjs') || 
              id.includes('jose')) {
            return 'vendor-crypto';
          }
          // Utilities chunk (consolidated)
          if (id.includes('zod') || 
              id.includes('dompurify')) {
            return 'vendor-utils';
          }
          // Large feature chunks for better code splitting
          if (id.includes('/features/assessment/')) {
            return 'feature-assessment';
          }
          if (id.includes('/features/compliance/')) {
            return 'feature-compliance';
          }
          if (id.includes('/features/reporting/')) {
            return 'feature-reporting';
          }
          if (id.includes('/features/assets/')) {
            return 'feature-assets';
          }
          if (id.includes('/features/audit/')) {
            return 'feature-audit';
          }
          if (id.includes('/features/risk-management/')) {
            return 'feature-risk';
          }
          if (id.includes('/features/training/')) {
            return 'feature-training';
          }
          if (id.includes('/features/technical-tools/')) {
            return 'feature-tools';
          }
          // Shared components chunk
          if (id.includes('/shared/components/')) {
            return 'shared-components';
          }
          // Services chunk
          if (id.includes('/services/')) {
            return 'services';
          }
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') return 'assets/[name]-[hash][extname]';
          return 'assets/[name]-[hash].[ext]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Reduced for better compatibility
        // Safe compression options only
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        reduce_vars: true,
        sequences: true,
        side_effects: false,
        unused: true,
        collapse_vars: true,
        conditionals: true,
        comparisons: true,
        booleans: true,
        loops: true,
        hoist_funs: false, // Disabled for ES module compatibility
        hoist_vars: false,
        keep_fargs: false,
        keep_fnames: false,
        keep_infinity: false,
        typeofs: true,
        warnings: false,
        // Disable potentially problematic options
        unsafe: false,
        unsafe_comps: false,
        unsafe_Function: false,
        unsafe_math: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
      },
      mangle: {
        safari10: true,
        toplevel: false, // Keep false for ES module compatibility
        properties: {
          regex: /^_/
        },
        keep_fnames: false,
        keep_classnames: false,
        // Disable potentially problematic mangle options
        reserved: ['import', 'export', 'default']
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        ecma: 2020, // Match build target
        // Ensure proper ES module handling
        preserve_annotations: true
      },
    },
    reportCompressedSize: false, // Faster builds
  },
  
  // 🔒 Development Server Security
  server: {
    host: 'localhost',
    port: 3000,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  
  // 📁 Path Resolution
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/modules': '/src/modules',
      '@/lib': '/src/lib',
      '@/types': '/src/types',
      '@/utils': '/src/utils',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/services': '/src/services',
      '@/hooks': '/src/hooks',
      '@/data': '/src/data',
      '@/config': '/src/config'
    }
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    headers: {
      'Cache-Control': 'public, max-age=600',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-XSS-Protection': '1; mode=block',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    },
  },
  
  // 🌍 Environment Variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'recharts',
      'lucide-react',
      'zod',
      'dompurify'
    ],
    exclude: ['@vite/client', '@vite/env'],
    esbuildOptions: {
      target: 'es2020',
      treeShaking: true,
      minify: false, // Let Terser handle minification
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false,
      // Ensure proper ES module handling
      format: 'esm',
      platform: 'browser',
      mainFields: ['module', 'main'],
    }
  },
  
  // 📦 CSS Configuration
  css: {
    devSourcemap: mode !== 'production',
    postcss: {
      plugins: [
        autoprefixer(),
        tailwindcss()
      ]
    }
  },
  
  // 🚀 Worker Configuration
  worker: {
    format: 'es',
    plugins: () => []
  }
}))