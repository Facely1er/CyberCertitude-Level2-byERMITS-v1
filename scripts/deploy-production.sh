#!/bin/bash

# 🚀 CMMC 2.0 Level 2 Compliance Platform - Production Deployment Script
# This script handles the complete production deployment process

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
DEPLOY_TIMEOUT=300  # 5 minutes

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
echo "║                    Production Deployment                    ║"
echo "║                        Version $VERSION                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "Starting production deployment process..."

# 1. Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
log "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
log "npm version: $NPM_VERSION"

# Check if .env file exists
if [ ! -f ".env" ]; then
    error ".env file not found. Please create it from .env.example first."
    exit 1
fi

# Check required environment variables
log "🔐 Validating environment variables..."
source .env

if [ -z "$VITE_SUPABASE_URL" ] || [ "$VITE_SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    error "VITE_SUPABASE_URL not configured. Please update .env with your actual Supabase URL."
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ] || [ "$VITE_SUPABASE_ANON_KEY" = "your-anon-key-here" ]; then
    error "VITE_SUPABASE_ANON_KEY not configured. Please update .env with your actual Supabase anon key."
    exit 1
fi

success "Environment variables validated"

# 2. Clean previous builds
log "🧹 Cleaning previous builds..."
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    success "Previous build directory cleaned"
fi

# 3. Install dependencies
log "📦 Installing dependencies..."
npm ci --production=false
success "Dependencies installed"

# 4. Run production checklist
log "🔍 Running production readiness checklist..."
if npm run check:production; then
    success "Production checklist passed"
else
    warning "Production checklist has warnings - review before proceeding"
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deployment cancelled by user"
        exit 0
    fi
fi

# 5. Build for production
log "🏗️  Building for production..."
if npm run build; then
    success "Production build completed successfully"
else
    error "Production build failed"
    exit 1
fi

# 6. Verify build output
log "🔍 Verifying build output..."
if [ ! -d "$BUILD_DIR" ]; then
    error "Build directory not found"
    exit 1
fi

if [ ! -f "$BUILD_DIR/index.html" ]; then
    error "index.html not found in build output"
    exit 1
fi

# Check bundle sizes
log "📊 Analyzing bundle sizes..."
TOTAL_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
log "Total build size: $TOTAL_SIZE"

# Check for large files
LARGE_FILES=$(find "$BUILD_DIR" -name "*.js" -size +500k -exec ls -lh {} \; 2>/dev/null || true)
if [ -n "$LARGE_FILES" ]; then
    warning "Large JavaScript files detected:"
    echo "$LARGE_FILES"
fi

success "Build output verified"

# 7. Security verification
log "🔒 Verifying security configuration..."

# Check if security headers are configured
if grep -q "Content-Security-Policy" netlify.toml; then
    success "CSP headers configured"
else
    warning "CSP headers not found in netlify.toml"
fi

# Check for console statements in build
CONSOLE_COUNT=$(grep -r "console\." "$BUILD_DIR" --include="*.js" | wc -l || echo "0")
if [ "$CONSOLE_COUNT" -eq 0 ]; then
    success "No console statements in production build"
else
    warning "Found $CONSOLE_COUNT console statements in production build"
fi

# 8. Deploy to Netlify
log "🚀 Deploying to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    error "Netlify CLI not found. Please install it first: npm install -g netlify-cli"
    exit 1
fi

# Deploy
log "Starting Netlify deployment..."
if netlify deploy --prod --dir="$BUILD_DIR" --timeout="$DEPLOY_TIMEOUT"; then
    success "Deployment to Netlify completed successfully"
else
    error "Deployment to Netlify failed"
    exit 1
fi

# 9. Post-deployment verification
log "🔍 Running post-deployment verification..."

# Get the deployed URL
DEPLOY_URL=$(netlify status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4 || echo "")
if [ -n "$DEPLOY_URL" ]; then
    log "Deployed URL: $DEPLOY_URL"
    
    # Wait a moment for deployment to settle
    log "Waiting for deployment to settle..."
    sleep 10
    
    # Test the deployed site
    log "Testing deployed site..."
    if curl -s -f "$DEPLOY_URL" > /dev/null; then
        success "Deployed site is responding"
    else
        warning "Deployed site may not be fully ready yet"
    fi
else
    warning "Could not determine deployed URL"
fi

# 10. Final status
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    DEPLOYMENT COMPLETED!                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

success "Production deployment completed successfully!"
log "Version: $VERSION"
log "Build size: $TOTAL_SIZE"
if [ -n "$DEPLOY_URL" ]; then
    log "Deployed to: $DEPLOY_URL"
fi

# 11. Next steps reminder
echo
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Verify authentication flow works on deployed site"
echo "2. Test all major functionality"
echo "3. Monitor error rates and performance"
echo "4. Set up monitoring and alerting"
echo "5. Update DNS if using custom domain"

# 12. Health check reminder
echo
echo -e "${BLUE}🏥 Health Check:${NC}"
echo "Visit: $DEPLOY_URL/health (if configured)"

log "Deployment script completed successfully!"
exit 0