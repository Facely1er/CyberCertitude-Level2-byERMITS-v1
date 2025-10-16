#!/usr/bin/env node
/**
 * Bundle Size Monitoring Script
 * Checks if bundle sizes are within acceptable limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Size limits in KB
const SIZE_LIMITS = {
  'index.js': 500,
  'vendor-react-core.js': 200,
  'vendor-router.js': 150,
  'vendor-supabase.js': 150,
  'vendor-charts.js': 300,
  'index.css': 100,
};

// Maximum total bundle size (MB)
const MAX_TOTAL_SIZE = 2.5;

function getFileSizeInKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function checkBundleSizes() {
  const distPath = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist folder not found. Run build first.');
    process.exit(1);
  }

  const assetsPath = path.join(distPath, 'assets');

  if (!fs.existsSync(assetsPath)) {
    console.error('❌ Error: dist/assets folder not found.');
    process.exit(1);
  }

  console.log('\n📦 Bundle Size Analysis\n');
  console.log('=' .repeat(60));

  const files = getAllFiles(assetsPath);
  let totalSize = 0;
  let hasErrors = false;
  const results = [];

  files.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);

    // Only check JS and CSS files
    if (!['.js', '.css'].includes(ext)) {
      return;
    }

    const sizeKB = getFileSizeInKB(filePath);
    totalSize += sizeKB;

    // Check if file matches any size limit rules
    let limitExceeded = false;
    let limit = null;

    for (const [pattern, maxSize] of Object.entries(SIZE_LIMITS)) {
      if (fileName.includes(pattern.replace('.js', '').replace('.css', ''))) {
        limit = maxSize;
        if (sizeKB > maxSize) {
          limitExceeded = true;
        }
        break;
      }
    }

    results.push({
      name: fileName,
      size: sizeKB,
      limit,
      exceeded: limitExceeded,
    });

    if (limitExceeded) {
      hasErrors = true;
    }
  });

  // Sort by size descending
  results.sort((a, b) => b.size - a.size);

  // Display results
  results.forEach(({ name, size, limit, exceeded }) => {
    const status = exceeded ? '❌' : limit ? '✅' : '📄';
    const limitText = limit ? ` (limit: ${limit}KB)` : '';
    const color = exceeded ? '\x1b[31m' : limit ? '\x1b[32m' : '\x1b[37m';
    const reset = '\x1b[0m';

    console.log(`${status} ${color}${name.padEnd(40)} ${size}KB${limitText}${reset}`);
  });

  console.log('=' .repeat(60));

  const totalMB = (totalSize / 1024).toFixed(2);
  const totalLimitMB = MAX_TOTAL_SIZE.toFixed(2);
  const totalExceeded = totalSize / 1024 > MAX_TOTAL_SIZE;

  if (totalExceeded) {
    hasErrors = true;
  }

  const totalStatus = totalExceeded ? '❌' : '✅';
  const totalColor = totalExceeded ? '\x1b[31m' : '\x1b[32m';
  console.log(`${totalStatus} ${totalColor}Total Bundle Size: ${totalMB}MB (limit: ${totalLimitMB}MB)\x1b[0m`);
  console.log('=' .repeat(60));

  if (hasErrors) {
    console.log('\n⚠️  Warning: Some bundles exceed size limits!');
    console.log('\nRecommendations:');
    console.log('1. Check for duplicate dependencies');
    console.log('2. Lazy load large components');
    console.log('3. Review and optimize imports');
    console.log('4. Consider code splitting strategies\n');
    process.exit(1);
  } else {
    console.log('\n✅ All bundle sizes are within acceptable limits!\n');
    process.exit(0);
  }
}

// Run the check
try {
  checkBundleSizes();
} catch (error) {
  console.error('❌ Error checking bundle sizes:', error.message);
  process.exit(1);
}
