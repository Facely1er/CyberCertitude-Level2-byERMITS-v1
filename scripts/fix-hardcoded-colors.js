#!/usr/bin/env node

/**
 * Automated Color Replacement Script
 * 
 * Replaces hardcoded Tailwind color classes with design tokens
 * to ensure consistency with the design system.
 * 
 * Usage: node scripts/fix-hardcoded-colors.js [--dry-run] [--path=src/components]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color replacement mappings
const colorReplacements = [
  // Background colors
  { pattern: /bg-white\b/g, replacement: 'bg-surface-light' },
  { pattern: /bg-gray-50\b/g, replacement: 'bg-background-light' },
  { pattern: /bg-gray-100\b/g, replacement: 'bg-support-light' },
  { pattern: /bg-gray-200\b/g, replacement: 'bg-support-light' },
  { pattern: /bg-gray-300\b/g, replacement: 'bg-support-light' },
  { pattern: /bg-gray-400\b/g, replacement: 'bg-support-light' },
  { pattern: /bg-gray-500\b/g, replacement: 'bg-support-light' },
  { pattern: /bg-gray-600\b/g, replacement: 'bg-primary-600' },
  { pattern: /bg-gray-700\b/g, replacement: 'bg-surface-dark' },
  { pattern: /bg-gray-800\b/g, replacement: 'bg-surface-dark' },
  { pattern: /bg-gray-900\b/g, replacement: 'bg-background-dark' },
  
  // Dark mode background colors
  { pattern: /dark:bg-gray-50\b/g, replacement: 'dark:bg-background-dark' },
  { pattern: /dark:bg-gray-100\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-200\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-300\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-400\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-500\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-600\b/g, replacement: 'dark:bg-support-dark' },
  { pattern: /dark:bg-gray-700\b/g, replacement: 'dark:bg-surface-dark' },
  { pattern: /dark:bg-gray-800\b/g, replacement: 'dark:bg-surface-dark' },
  { pattern: /dark:bg-gray-900\b/g, replacement: 'dark:bg-background-dark' },
  
  // Text colors
  { pattern: /text-gray-50\b/g, replacement: 'text-background-light' },
  { pattern: /text-gray-100\b/g, replacement: 'text-text-primary-light' },
  { pattern: /text-gray-200\b/g, replacement: 'text-text-primary-light' },
  { pattern: /text-gray-300\b/g, replacement: 'text-text-secondary-dark' },
  { pattern: /text-gray-400\b/g, replacement: 'text-text-muted-dark' },
  { pattern: /text-gray-500\b/g, replacement: 'text-text-muted-light' },
  { pattern: /text-gray-600\b/g, replacement: 'text-text-secondary-light' },
  { pattern: /text-gray-700\b/g, replacement: 'text-text-primary-light' },
  { pattern: /text-gray-800\b/g, replacement: 'text-text-primary-light' },
  { pattern: /text-gray-900\b/g, replacement: 'text-text-primary-light' },
  
  // Dark mode text colors
  { pattern: /dark:text-gray-50\b/g, replacement: 'dark:text-background-dark' },
  { pattern: /dark:text-gray-100\b/g, replacement: 'dark:text-text-primary-dark' },
  { pattern: /dark:text-gray-200\b/g, replacement: 'dark:text-text-primary-dark' },
  { pattern: /dark:text-gray-300\b/g, replacement: 'dark:text-text-secondary-dark' },
  { pattern: /dark:text-gray-400\b/g, replacement: 'dark:text-text-muted-dark' },
  { pattern: /dark:text-gray-500\b/g, replacement: 'dark:text-text-muted-dark' },
  { pattern: /dark:text-gray-600\b/g, replacement: 'dark:text-text-secondary-dark' },
  { pattern: /dark:text-gray-700\b/g, replacement: 'dark:text-text-primary-dark' },
  { pattern: /dark:text-gray-800\b/g, replacement: 'dark:text-text-primary-dark' },
  { pattern: /dark:text-gray-900\b/g, replacement: 'dark:text-text-primary-dark' },
  { pattern: /dark:text-white\b/g, replacement: 'dark:text-text-primary-dark' },
  
  // Border colors
  { pattern: /border-gray-50\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-100\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-200\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-300\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-400\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-500\b/g, replacement: 'border-support-light' },
  { pattern: /border-gray-600\b/g, replacement: 'border-support-dark' },
  { pattern: /border-gray-700\b/g, replacement: 'border-support-dark' },
  { pattern: /border-gray-800\b/g, replacement: 'border-support-dark' },
  
  // Dark mode border colors
  { pattern: /dark:border-gray-50\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-100\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-200\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-300\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-400\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-500\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-600\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-700\b/g, replacement: 'dark:border-support-dark' },
  { pattern: /dark:border-gray-800\b/g, replacement: 'dark:border-support-dark' },
  
  // Blue colors (primary)
  { pattern: /bg-blue-50\b/g, replacement: 'bg-primary-50' },
  { pattern: /bg-blue-100\b/g, replacement: 'bg-primary-100' },
  { pattern: /bg-blue-200\b/g, replacement: 'bg-primary-200' },
  { pattern: /bg-blue-300\b/g, replacement: 'bg-primary-300' },
  { pattern: /bg-blue-400\b/g, replacement: 'bg-primary-400' },
  { pattern: /bg-blue-500\b/g, replacement: 'bg-primary-500' },
  { pattern: /bg-blue-600\b/g, replacement: 'bg-primary-600' },
  { pattern: /bg-blue-700\b/g, replacement: 'bg-primary-700' },
  { pattern: /bg-blue-800\b/g, replacement: 'bg-primary-800' },
  { pattern: /bg-blue-900\b/g, replacement: 'bg-primary-900' },
  
  { pattern: /text-blue-50\b/g, replacement: 'text-primary-50' },
  { pattern: /text-blue-100\b/g, replacement: 'text-primary-100' },
  { pattern: /text-blue-200\b/g, replacement: 'text-primary-200' },
  { pattern: /text-blue-300\b/g, replacement: 'text-primary-300' },
  { pattern: /text-blue-400\b/g, replacement: 'text-primary-400' },
  { pattern: /text-blue-500\b/g, replacement: 'text-primary-500' },
  { pattern: /text-blue-600\b/g, replacement: 'text-primary-600' },
  { pattern: /text-blue-700\b/g, replacement: 'text-primary-700' },
  { pattern: /text-blue-800\b/g, replacement: 'text-primary-800' },
  { pattern: /text-blue-900\b/g, replacement: 'text-primary-900' },
  
  { pattern: /border-blue-50\b/g, replacement: 'border-primary-50' },
  { pattern: /border-blue-100\b/g, replacement: 'border-primary-100' },
  { pattern: /border-blue-200\b/g, replacement: 'border-primary-200' },
  { pattern: /border-blue-300\b/g, replacement: 'border-primary-300' },
  { pattern: /border-blue-400\b/g, replacement: 'border-primary-400' },
  { pattern: /border-blue-500\b/g, replacement: 'border-primary-500' },
  { pattern: /border-blue-600\b/g, replacement: 'border-primary-600' },
  { pattern: /border-blue-700\b/g, replacement: 'border-primary-700' },
  { pattern: /border-blue-800\b/g, replacement: 'border-primary-800' },
  { pattern: /border-blue-900\b/g, replacement: 'border-primary-900' },
  
  { pattern: /dark:bg-blue-50\b/g, replacement: 'dark:bg-primary-50' },
  { pattern: /dark:bg-blue-100\b/g, replacement: 'dark:bg-primary-100' },
  { pattern: /dark:bg-blue-200\b/g, replacement: 'dark:bg-primary-200' },
  { pattern: /dark:bg-blue-300\b/g, replacement: 'dark:bg-primary-300' },
  { pattern: /dark:bg-blue-400\b/g, replacement: 'dark:bg-primary-400' },
  { pattern: /dark:bg-blue-500\b/g, replacement: 'dark:bg-primary-500' },
  { pattern: /dark:bg-blue-600\b/g, replacement: 'dark:bg-primary-600' },
  { pattern: /dark:bg-blue-700\b/g, replacement: 'dark:bg-primary-700' },
  { pattern: /dark:bg-blue-800\b/g, replacement: 'dark:bg-primary-800' },
  { pattern: /dark:bg-blue-900\b/g, replacement: 'dark:bg-primary-900' },
  
  { pattern: /dark:text-blue-50\b/g, replacement: 'dark:text-primary-50' },
  { pattern: /dark:text-blue-100\b/g, replacement: 'dark:text-primary-100' },
  { pattern: /dark:text-blue-200\b/g, replacement: 'dark:text-primary-200' },
  { pattern: /dark:text-blue-300\b/g, replacement: 'dark:text-primary-300' },
  { pattern: /dark:text-blue-400\b/g, replacement: 'dark:text-primary-400' },
  { pattern: /dark:text-blue-500\b/g, replacement: 'dark:text-primary-500' },
  { pattern: /dark:text-blue-600\b/g, replacement: 'dark:text-primary-600' },
  { pattern: /dark:text-blue-700\b/g, replacement: 'dark:text-primary-700' },
  { pattern: /dark:text-blue-800\b/g, replacement: 'dark:text-primary-800' },
  { pattern: /dark:text-blue-900\b/g, replacement: 'dark:text-primary-900' },
  
  { pattern: /dark:border-blue-50\b/g, replacement: 'dark:border-primary-50' },
  { pattern: /dark:border-blue-100\b/g, replacement: 'dark:border-primary-100' },
  { pattern: /dark:border-blue-200\b/g, replacement: 'dark:border-primary-200' },
  { pattern: /dark:border-blue-300\b/g, replacement: 'dark:border-primary-300' },
  { pattern: /dark:border-blue-400\b/g, replacement: 'dark:border-primary-400' },
  { pattern: /dark:border-blue-500\b/g, replacement: 'dark:border-primary-500' },
  { pattern: /dark:border-blue-600\b/g, replacement: 'dark:border-primary-600' },
  { pattern: /dark:border-blue-700\b/g, replacement: 'dark:border-primary-700' },
  { pattern: /dark:border-blue-800\b/g, replacement: 'dark:border-primary-800' },
  { pattern: /dark:border-blue-900\b/g, replacement: 'dark:border-primary-900' },
  
  // Focus ring colors
  { pattern: /focus:ring-blue-500\b/g, replacement: 'focus:ring-primary-500' },
  { pattern: /focus:ring-blue-600\b/g, replacement: 'focus:ring-primary-600' },
  { pattern: /focus:ring-blue-700\b/g, replacement: 'focus:ring-primary-700' },
  { pattern: /focus:ring-offset-blue-500\b/g, replacement: 'focus:ring-offset-primary-500' },
  
  // Red colors (error)
  { pattern: /bg-red-50\b/g, replacement: 'bg-error-50' },
  { pattern: /bg-red-100\b/g, replacement: 'bg-error-100' },
  { pattern: /bg-red-200\b/g, replacement: 'bg-error-200' },
  { pattern: /bg-red-300\b/g, replacement: 'bg-error-300' },
  { pattern: /bg-red-400\b/g, replacement: 'bg-error-400' },
  { pattern: /bg-red-500\b/g, replacement: 'bg-error-500' },
  { pattern: /bg-red-600\b/g, replacement: 'bg-error-600' },
  { pattern: /bg-red-700\b/g, replacement: 'bg-error-700' },
  { pattern: /bg-red-800\b/g, replacement: 'bg-error-800' },
  { pattern: /bg-red-900\b/g, replacement: 'bg-error-900' },
  
  { pattern: /text-red-50\b/g, replacement: 'text-error-50' },
  { pattern: /text-red-100\b/g, replacement: 'text-error-100' },
  { pattern: /text-red-200\b/g, replacement: 'text-error-200' },
  { pattern: /text-red-300\b/g, replacement: 'text-error-300' },
  { pattern: /text-red-400\b/g, replacement: 'text-error-400' },
  { pattern: /text-red-500\b/g, replacement: 'text-error-500' },
  { pattern: /text-red-600\b/g, replacement: 'text-error-600' },
  { pattern: /text-red-700\b/g, replacement: 'text-error-700' },
  { pattern: /text-red-800\b/g, replacement: 'text-error-800' },
  { pattern: /text-red-900\b/g, replacement: 'text-error-900' },
  
  { pattern: /border-red-50\b/g, replacement: 'border-error-50' },
  { pattern: /border-red-100\b/g, replacement: 'border-error-100' },
  { pattern: /border-red-200\b/g, replacement: 'border-error-200' },
  { pattern: /border-red-300\b/g, replacement: 'border-error-300' },
  { pattern: /border-red-400\b/g, replacement: 'border-error-400' },
  { pattern: /border-red-500\b/g, replacement: 'border-error-500' },
  { pattern: /border-red-600\b/g, replacement: 'border-error-600' },
  { pattern: /border-red-700\b/g, replacement: 'border-error-700' },
  { pattern: /border-red-800\b/g, replacement: 'border-error-800' },
  { pattern: /border-red-900\b/g, replacement: 'border-error-900' },
  
  { pattern: /dark:bg-red-50\b/g, replacement: 'dark:bg-error-50' },
  { pattern: /dark:bg-red-100\b/g, replacement: 'dark:bg-error-100' },
  { pattern: /dark:bg-red-200\b/g, replacement: 'dark:bg-error-200' },
  { pattern: /dark:bg-red-300\b/g, replacement: 'dark:bg-error-300' },
  { pattern: /dark:bg-red-400\b/g, replacement: 'dark:bg-error-400' },
  { pattern: /dark:bg-red-500\b/g, replacement: 'dark:bg-error-500' },
  { pattern: /dark:bg-red-600\b/g, replacement: 'dark:bg-error-600' },
  { pattern: /dark:bg-red-700\b/g, replacement: 'dark:bg-error-700' },
  { pattern: /dark:bg-red-800\b/g, replacement: 'dark:bg-error-800' },
  { pattern: /dark:bg-red-900\b/g, replacement: 'dark:bg-error-900' },
  
  { pattern: /dark:text-red-50\b/g, replacement: 'dark:text-error-50' },
  { pattern: /dark:text-red-100\b/g, replacement: 'dark:text-error-100' },
  { pattern: /dark:text-red-200\b/g, replacement: 'dark:text-error-200' },
  { pattern: /dark:text-red-300\b/g, replacement: 'dark:text-error-300' },
  { pattern: /dark:text-red-400\b/g, replacement: 'dark:text-error-400' },
  { pattern: /dark:text-red-500\b/g, replacement: 'dark:text-error-500' },
  { pattern: /dark:text-red-600\b/g, replacement: 'dark:text-error-600' },
  { pattern: /dark:text-red-700\b/g, replacement: 'dark:text-error-700' },
  { pattern: /dark:text-red-800\b/g, replacement: 'dark:text-error-800' },
  { pattern: /dark:text-red-900\b/g, replacement: 'dark:text-error-900' },
  
  { pattern: /dark:border-red-50\b/g, replacement: 'dark:border-error-50' },
  { pattern: /dark:border-red-100\b/g, replacement: 'dark:border-error-100' },
  { pattern: /dark:border-red-200\b/g, replacement: 'dark:border-error-200' },
  { pattern: /dark:border-red-300\b/g, replacement: 'dark:border-error-300' },
  { pattern: /dark:border-red-400\b/g, replacement: 'dark:border-error-400' },
  { pattern: /dark:border-red-500\b/g, replacement: 'dark:border-error-500' },
  { pattern: /dark:border-red-600\b/g, replacement: 'dark:border-error-600' },
  { pattern: /dark:border-red-700\b/g, replacement: 'dark:border-error-700' },
  { pattern: /dark:border-red-800\b/g, replacement: 'dark:border-error-800' },
  { pattern: /dark:border-red-900\b/g, replacement: 'dark:border-error-900' },
  
  // Green colors (success)
  { pattern: /bg-green-50\b/g, replacement: 'bg-success-50' },
  { pattern: /bg-green-100\b/g, replacement: 'bg-success-100' },
  { pattern: /bg-green-200\b/g, replacement: 'bg-success-200' },
  { pattern: /bg-green-300\b/g, replacement: 'bg-success-300' },
  { pattern: /bg-green-400\b/g, replacement: 'bg-success-400' },
  { pattern: /bg-green-500\b/g, replacement: 'bg-success-500' },
  { pattern: /bg-green-600\b/g, replacement: 'bg-success-600' },
  { pattern: /bg-green-700\b/g, replacement: 'bg-success-700' },
  { pattern: /bg-green-800\b/g, replacement: 'bg-success-800' },
  { pattern: /bg-green-900\b/g, replacement: 'bg-success-900' },
  
  { pattern: /text-green-50\b/g, replacement: 'text-success-50' },
  { pattern: /text-green-100\b/g, replacement: 'text-success-100' },
  { pattern: /text-green-200\b/g, replacement: 'text-success-200' },
  { pattern: /text-green-300\b/g, replacement: 'text-success-300' },
  { pattern: /text-green-400\b/g, replacement: 'text-success-400' },
  { pattern: /text-green-500\b/g, replacement: 'text-success-500' },
  { pattern: /text-green-600\b/g, replacement: 'text-success-600' },
  { pattern: /text-green-700\b/g, replacement: 'text-success-700' },
  { pattern: /text-green-800\b/g, replacement: 'text-success-800' },
  { pattern: /text-green-900\b/g, replacement: 'text-success-900' },
  
  { pattern: /border-green-50\b/g, replacement: 'border-success-50' },
  { pattern: /border-green-100\b/g, replacement: 'border-success-100' },
  { pattern: /border-green-200\b/g, replacement: 'border-success-200' },
  { pattern: /border-green-300\b/g, replacement: 'border-success-300' },
  { pattern: /border-green-400\b/g, replacement: 'border-success-400' },
  { pattern: /border-green-500\b/g, replacement: 'border-success-500' },
  { pattern: /border-green-600\b/g, replacement: 'border-success-600' },
  { pattern: /border-green-700\b/g, replacement: 'border-success-700' },
  { pattern: /border-green-800\b/g, replacement: 'border-success-800' },
  { pattern: /border-green-900\b/g, replacement: 'border-success-900' },
  
  { pattern: /dark:bg-green-50\b/g, replacement: 'dark:bg-success-50' },
  { pattern: /dark:bg-green-100\b/g, replacement: 'dark:bg-success-100' },
  { pattern: /dark:bg-green-200\b/g, replacement: 'dark:bg-success-200' },
  { pattern: /dark:bg-green-300\b/g, replacement: 'dark:bg-success-300' },
  { pattern: /dark:bg-green-400\b/g, replacement: 'dark:bg-success-400' },
  { pattern: /dark:bg-green-500\b/g, replacement: 'dark:bg-success-500' },
  { pattern: /dark:bg-green-600\b/g, replacement: 'dark:bg-success-600' },
  { pattern: /dark:bg-green-700\b/g, replacement: 'dark:bg-success-700' },
  { pattern: /dark:bg-green-800\b/g, replacement: 'dark:bg-success-800' },
  { pattern: /dark:bg-green-900\b/g, replacement: 'dark:bg-success-900' },
  
  { pattern: /dark:text-green-50\b/g, replacement: 'dark:text-success-50' },
  { pattern: /dark:text-green-100\b/g, replacement: 'dark:text-success-100' },
  { pattern: /dark:text-green-200\b/g, replacement: 'dark:text-success-200' },
  { pattern: /dark:text-green-300\b/g, replacement: 'dark:text-success-300' },
  { pattern: /dark:text-green-400\b/g, replacement: 'dark:text-success-400' },
  { pattern: /dark:text-green-500\b/g, replacement: 'dark:text-success-500' },
  { pattern: /dark:text-green-600\b/g, replacement: 'dark:text-success-600' },
  { pattern: /dark:text-green-700\b/g, replacement: 'dark:text-success-700' },
  { pattern: /dark:text-green-800\b/g, replacement: 'dark:text-success-800' },
  { pattern: /dark:text-green-900\b/g, replacement: 'dark:text-success-900' },
  
  { pattern: /dark:border-green-50\b/g, replacement: 'dark:border-success-50' },
  { pattern: /dark:border-green-100\b/g, replacement: 'dark:border-success-100' },
  { pattern: /dark:border-green-200\b/g, replacement: 'dark:border-success-200' },
  { pattern: /dark:border-green-300\b/g, replacement: 'dark:border-success-300' },
  { pattern: /dark:border-green-400\b/g, replacement: 'dark:border-success-400' },
  { pattern: /dark:border-green-500\b/g, replacement: 'dark:border-success-500' },
  { pattern: /dark:border-green-600\b/g, replacement: 'dark:border-success-600' },
  { pattern: /dark:border-green-700\b/g, replacement: 'dark:border-success-700' },
  { pattern: /dark:border-green-800\b/g, replacement: 'dark:border-success-800' },
  { pattern: /dark:border-green-900\b/g, replacement: 'dark:border-success-900' },
  
  // Hover states
  { pattern: /hover:bg-blue-500\b/g, replacement: 'hover:bg-primary-500' },
  { pattern: /hover:bg-blue-600\b/g, replacement: 'hover:bg-primary-600' },
  { pattern: /hover:bg-blue-700\b/g, replacement: 'hover:bg-primary-700' },
  { pattern: /hover:text-blue-500\b/g, replacement: 'hover:text-primary-500' },
  { pattern: /hover:text-blue-600\b/g, replacement: 'hover:text-primary-600' },
  { pattern: /hover:text-blue-700\b/g, replacement: 'hover:text-primary-700' },
  { pattern: /hover:border-blue-500\b/g, replacement: 'hover:border-primary-500' },
  { pattern: /hover:border-blue-600\b/g, replacement: 'hover:border-primary-600' },
  { pattern: /hover:border-blue-700\b/g, replacement: 'hover:border-primary-700' },
  
  { pattern: /dark:hover:bg-blue-500\b/g, replacement: 'dark:hover:bg-primary-500' },
  { pattern: /dark:hover:bg-blue-600\b/g, replacement: 'dark:hover:bg-primary-600' },
  { pattern: /dark:hover:bg-blue-700\b/g, replacement: 'dark:hover:bg-primary-700' },
  { pattern: /dark:hover:text-blue-500\b/g, replacement: 'dark:hover:text-primary-500' },
  { pattern: /dark:hover:text-blue-600\b/g, replacement: 'dark:hover:text-primary-600' },
  { pattern: /dark:hover:text-blue-700\b/g, replacement: 'dark:hover:text-primary-700' },
];

// Files to process
const fileExtensions = ['.tsx', '.ts', '.jsx', '.js'];
const defaultPath = path.join(__dirname, '..', 'src');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run') || args.includes('-d');
const pathArg = args.find(arg => arg.startsWith('--path=') || arg.startsWith('-p='));
const targetPath = pathArg ? pathArg.split('=')[1] : defaultPath;

// Statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByFile: new Map(),
};

/**
 * Recursively find all files with specified extensions
 */
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules, .git, dist, build directories
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build' || file === '.next') {
      return;
    }
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (fileExtensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let fileReplacements = 0;
    
    // Apply all replacements
    colorReplacements.forEach(({ pattern, replacement }) => {
      const matches = modifiedContent.match(pattern);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern, replacement);
        fileReplacements += matches.length;
      }
    });
    
    // Only count if changes were made
    if (modifiedContent !== content) {
      stats.filesModified++;
      stats.totalReplacements += fileReplacements;
      stats.replacementsByFile.set(filePath, fileReplacements);
      
      if (!isDryRun) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
      }
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Automated Color Replacement Script\n');
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no files will be modified)' : 'LIVE (files will be modified)'}`);
  console.log(`Target path: ${targetPath}\n`);
  
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Error: Path does not exist: ${targetPath}`);
    process.exit(1);
  }
  
  let files = [];
  const stat = fs.statSync(targetPath);
  
  // Handle both files and directories
  if (stat.isFile()) {
    // Single file provided
    if (fileExtensions.some(ext => targetPath.endsWith(ext))) {
      files = [targetPath];
    } else {
      console.error(`❌ Error: File must have one of these extensions: ${fileExtensions.join(', ')}`);
      process.exit(1);
    }
  } else if (stat.isDirectory()) {
    // Directory provided
    files = findFiles(targetPath);
  } else {
    console.error(`❌ Error: Path must be a file or directory: ${targetPath}`);
    process.exit(1);
  }
  
  console.log(`Found ${files.length} files to process...\n`);
  
  files.forEach(processFile);
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Results Summary');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  
  if (stats.filesModified > 0) {
    console.log('\n📝 Modified Files:');
    const sortedFiles = Array.from(stats.replacementsByFile.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20); // Top 20 files
    
    sortedFiles.forEach(([filePath, count]) => {
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`  ${relativePath}: ${count} replacements`);
    });
    
    if (stats.replacementsByFile.size > 20) {
      console.log(`  ... and ${stats.replacementsByFile.size - 20} more files`);
    }
  }
  
  if (isDryRun) {
    console.log('\n⚠️  This was a dry run. No files were modified.');
    console.log('Run without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Color replacements completed!');
    console.log('Please review the changes and test your application.');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run the script
main();

