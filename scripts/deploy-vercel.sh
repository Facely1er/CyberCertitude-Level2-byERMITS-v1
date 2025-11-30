#!/bin/bash

# 🚀 CMMC 2.0 Level 2 Compliance Platform - Vercel Deployment Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cmmc-level2-compliance-platform"
VERSION="2.0.0"
BUILD_DIR="dist"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Header
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                CMMC 2.0 Level 2 Compliance Platform             ║"
echo "║                    Vercel Deployment                       ║"
echo "║                        Version $VERSION                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "Starting Vercel deployment process..."

# 1. Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if dist folder exists
if [ ! -d "$BUILD_DIR" ]; then
    log "Build directory not found. Building for production..."
    npm run build
    if [ $? -ne 0 ]; then
        error "Build failed"
        exit 1
    fi
    success "Production build completed"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    log "Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        error "Failed to install Vercel CLI"
        exit 1
    fi
    success "Vercel CLI installed"
fi

# 2. Deploy to Vercel
log "🚀 Deploying to Vercel..."

# Check if already logged in to Vercel
if ! vercel whoami &> /dev/null; then
    log "Please log in to Vercel..."
    vercel login
fi

# Deploy
log "Starting Vercel deployment..."
if vercel --prod --yes; then
    success "Deployment to Vercel completed successfully"
else
    error "Deployment to Vercel failed"
    exit 1
fi

# 3. Get deployment URL
log "🔍 Getting deployment URL..."
DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "")

if [ -n "$DEPLOY_URL" ]; then
    success "Deployed to: https://$DEPLOY_URL"
    
    # Wait a moment for deployment to settle
    log "Waiting for deployment to settle..."
    sleep 10
    
    # Test the deployed site
    log "Testing deployed site..."
    if curl -s -f "https://$DEPLOY_URL" > /dev/null; then
        success "Deployed site is responding"
    else
        warning "Deployed site may not be fully ready yet"
    fi
else
    warning "Could not determine deployed URL"
fi

# 4. Final status
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                VERCEL DEPLOYMENT COMPLETED!                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

success "Vercel deployment completed successfully!"
log "Version: $VERSION"
if [ -n "$DEPLOY_URL" ]; then
    log "Deployed to: https://$DEPLOY_URL"
fi

# 5. Next steps reminder
echo
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Verify authentication flow works on deployed site"
echo "2. Test all major functionality"
echo "3. Set up custom domain (optional)"
echo "4. Configure environment variables in Vercel dashboard"
echo "5. Monitor performance and errors"

log "Vercel deployment script completed successfully!"
exit 0