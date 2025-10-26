#!/bin/bash

# Simple deployment script that skips linting
set -e

echo "🚀 Starting simple deployment..."

# Load environment variables from .env file
if [[ -f ".env" ]]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v "^#" .env | grep -v "^$" | xargs)
fi

# Check if required environment variables are set
REQUIRED_VARS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [[ -z "${!var}" ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

echo "✅ All required environment variables are set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --include=dev

# Build application
echo "🏗️ Building application..."
rm -rf dist
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output is in the 'dist' folder"
echo ""
echo "Next steps:"
echo "1. Deploy the 'dist' folder to your hosting platform (Netlify, Vercel, etc.)"
echo "2. Set the environment variables in your hosting platform"
echo "3. Test the deployment"
