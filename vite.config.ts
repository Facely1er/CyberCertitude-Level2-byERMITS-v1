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
    chunkSizeWarningLimit: 500, // Reduced for better performance
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    },
    rollupOptions: {
      external: ['@sentry/react'],
      onwarn(warning, warn) {
        // Suppress certain warnings that can cause issues
        if (warning.code === 'EVAL') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
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
              id.includes('tailwind-merge')) {
            return 'vendor-ui';
          }
          // Icons chunk (separate for better compatibility)
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
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
      target: 'esnext',
      treeShaking: true,
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
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