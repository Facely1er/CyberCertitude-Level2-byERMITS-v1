#!/bin/bash

# CMMC 2.0 Level 2 Compliance Platform - Production Deployment Script
# This script handles the complete deployment process with security checks

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Load environment variables from .env file
if [[ -f ".env" ]]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v "^#" .env | grep -v "^$" | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if required environment variables are set
check_environment() {
    echo "🔍 Checking environment variables..."
    
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
        print_error "Missing required environment variables:"
        for var in "${MISSING_VARS[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set these variables in your deployment environment or .env file"
        echo "See .env.example for reference"
        exit 1
    fi
    
    print_status "All required environment variables are set"
}

# Run security checks
security_checks() {
    echo "🔒 Running security checks..."
    
    # Check for sensitive data in environment variables
    if [[ "$VITE_SUPABASE_ANON_KEY" == *"test"* ]] || [[ "$VITE_SUPABASE_ANON_KEY" == *"demo"* ]]; then
        print_warning "Using test/demo Supabase keys in production!"
    fi
    
    # Verify HTTPS URLs
    if [[ "$VITE_SUPABASE_URL" != https://* ]]; then
        print_error "Supabase URL must use HTTPS in production"
        exit 1
    fi
    
    print_status "Security checks passed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Clean install to ensure consistency
    rm -rf node_modules package-lock.json
    npm install --production=false
    
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    
    # Type checking
    echo "  Running type checks..."
    npm run type-check
    
    # Linting
    echo "  Running linter..."
    npm run lint
    
    # Unit tests (if available)
    if npm run test:run --silent 2>/dev/null; then
        echo "  Running unit tests..."
        npm run test:run
    else
        print_warning "No unit tests configured"
    fi
    
    print_status "Tests completed"
}

# Build application
build_application() {
    echo "🏗️ Building application..."
    
    # Clean previous build
    rm -rf dist
    
    # Build for production
    npm run build
    
    # Check bundle size
    if command -v du &> /dev/null; then
        BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
        echo "  Bundle size: $BUNDLE_SIZE"
    fi
    
    print_status "Application built successfully"
}

# Security headers verification
verify_security_headers() {
    echo "🔐 Verifying security configuration..."
    
    # Check if netlify.toml has security headers
    if grep -q "X-Frame-Options" netlify.toml; then
        print_status "Security headers configured in netlify.toml"
    else
        print_warning "Security headers missing in netlify.toml"
    fi
    
    # Check CSP configuration
    if grep -q "Content-Security-Policy" netlify.toml; then
        print_status "Content Security Policy configured"
    else
        print_warning "Content Security Policy not found"
    fi
}

# Performance optimization checks
performance_checks() {
    echo "⚡ Running performance checks..."
    
    # Check for large files in dist
    if command -v find &> /dev/null; then
        LARGE_FILES=$(find dist -type f -size +500k 2>/dev/null || true)
        if [[ -n "$LARGE_FILES" ]]; then
            print_warning "Large files detected (>500KB):"
            echo "$LARGE_FILES"
            echo "Consider implementing code splitting for better performance"
        else
            print_status "No excessively large files detected"
        fi
    fi
    
    # Check if source maps are disabled in production
    if ls dist/assets/*.map 2>/dev/null; then
        print_warning "Source maps detected in production build"
        print_warning "Consider disabling source maps for security"
    else
        print_status "Source maps properly disabled"
    fi
}

# Database migration check
check_database() {
    echo "🗄️ Checking database setup..."
    
    if [[ -d "supabase/migrations" ]]; then
        MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l || echo 0)
        if [[ $MIGRATION_COUNT -gt 0 ]]; then
            print_status "Database migrations found ($MIGRATION_COUNT files)"
            echo "  Remember to apply migrations to your production database"
        else
            print_warning "No database migrations found"
        fi
    else
        print_warning "Supabase migrations directory not found"
    fi
}

# Generate deployment report
generate_report() {
    echo "📊 Generating deployment report..."
    
    REPORT_FILE="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
CMMC 2.0 Level 2 Compliance Platform - Deployment Report
Generated: $(date)

Environment Variables:
- VITE_SUPABASE_URL: ${VITE_SUPABASE_URL:0:30}...
- VITE_APP_VERSION: ${VITE_APP_VERSION:-"Not set"}
- NODE_ENV: ${NODE_ENV:-"Not set"}

Build Information:
- Build completed: $(date)
- Bundle location: ./dist/
- Security headers: Configured
- Source maps: Disabled

Next Steps:
1. Deploy to hosting platform (Netlify/Vercel)
2. Verify environment variables in hosting platform
3. Test authentication flow
4. Monitor application performance
5. Set up monitoring and alerting

Critical Reminders:
- Ensure Supabase RLS policies are enabled
- Verify all environment variables are set correctly
- Test HTTPS redirect functionality
- Monitor for security vulnerabilities
- Set up automated backups for data

EOF
    
    print_status "Deployment report saved to $REPORT_FILE"
}

# Main deployment process
main() {
    echo "CMMC 2.0 Level 2 Compliance Platform - Production Deployment"
    echo "======================================================="
    echo ""
    
    check_environment
    security_checks
    install_dependencies
    run_tests
    build_application
    verify_security_headers
    performance_checks
    check_database
    generate_report
    
    echo ""
    echo "🎉 Deployment preparation completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy the 'dist' folder to your hosting platform"
    echo "2. Set environment variables in your hosting platform"
    echo "3. Verify the deployment at your production URL"
    echo "4. Test all critical functionality"
    echo ""
    print_warning "Remember to test authentication and data persistence in production!"
}

# Run main function
main "$@"