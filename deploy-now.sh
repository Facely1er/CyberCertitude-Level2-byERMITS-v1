#!/bin/bash

# Quick deployment script for CMMC 2.0 Level 2 Compliance Platform

echo "🚀 CMMC 2.0 Level 2 Compliance Platform - Quick Deploy"
echo "================================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Please run 'npm run build' first."
    exit 1
fi

echo "✅ Production build found in dist/ folder"
echo ""
echo "📋 Deployment Options:"
echo ""
echo "1. Deploy to Netlify Drop (No account needed):"
echo "   - Visit: https://app.netlify.com/drop"
echo "   - Drag and drop the 'dist' folder"
echo "   - Get instant preview URL"
echo ""
echo "2. Deploy to Surge.sh (Quick static hosting):"
echo "   - Install: npm install -g surge"
echo "   - Run: surge dist"
echo "   - Choose a domain name"
echo ""
echo "3. Deploy to GitHub Pages:"
echo "   - Push dist folder to gh-pages branch"
echo "   - Enable GitHub Pages in repository settings"
echo ""
echo "4. Deploy to Netlify (Full features):"
echo "   - Install: npm install -g netlify-cli"
echo "   - Run: netlify deploy --dir=dist --prod"
echo ""
echo "⚠️  Remember to set environment variables in your hosting platform:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "📁 Your production files are ready in: $(pwd)/dist"
echo ""