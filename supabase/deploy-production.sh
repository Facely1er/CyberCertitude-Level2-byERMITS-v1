#!/bin/bash

# =============================================================================
# Production Database Deployment Script for CMMC 2.0 Level 2 Compliance Platform
# Multi-Project Support with Differentiated Schemas
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cmmc-level2-compliance-platform"
SUPABASE_DIR="supabase"
MIGRATIONS_DIR="$SUPABASE_DIR/migrations"
CONFIG_FILE="$SUPABASE_DIR/config.toml"

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
echo "║                  Production Database Deployment             ║"
echo "║                  Multi-Project Schema Setup                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "Starting production database deployment..."

# 1. Check prerequisites
log "🔍 Checking prerequisites..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    error "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo "Or visit: https://supabase.com/docs/guides/cli/getting-started"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if supabase directory exists
if [ ! -d "$SUPABASE_DIR" ]; then
    error "Supabase directory not found. Please ensure migrations are in place."
    exit 1
fi

# Check if user is logged in
if ! supabase status &> /dev/null; then
    error "Not connected to Supabase. Please login:"
    echo "supabase login"
    exit 1
fi

success "Prerequisites check passed"

# 2. Confirm production deployment
echo
echo -e "${YELLOW}⚠️  PRODUCTION DEPLOYMENT WARNING ⚠️${NC}"
echo "This will deploy the database schema to your PRODUCTION Supabase project."
echo "This action cannot be easily undone."
echo
read -p "Are you sure you want to proceed? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log "Deployment cancelled by user"
    exit 0
fi

# 3. Get project information
log "📋 Getting project information..."

# List projects
echo "Available Supabase projects:"
supabase projects list

echo
read -p "Enter your Supabase project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    error "Project ID is required"
    exit 1
fi

log "Using project ID: $PROJECT_ID"

# 4. Link to production project
log "🔗 Linking to production project..."

if supabase link --project-ref "$PROJECT_ID"; then
    success "Linked to production project"
else
    error "Failed to link to production project"
    exit 1
fi

# 5. Backup current database (if possible)
log "💾 Creating database backup..."

if supabase db dump --project-ref "$PROJECT_ID" > "backup_$(date +%Y%m%d_%H%M%S).sql"; then
    success "Database backup created"
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    log "Backup saved as: $BACKUP_FILE"
else
    warning "Could not create backup (this may be expected for new projects)"
fi

# 6. Deploy migrations
log "📊 Deploying database migrations..."

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    error "Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
fi

# Count migration files
MIGRATION_COUNT=$(find "$MIGRATIONS_DIR" -name "*.sql" | wc -l)
log "Found $MIGRATION_COUNT migration files"

if [ "$MIGRATION_COUNT" -eq 0 ]; then
    error "No migration files found in $MIGRATIONS_DIR"
    exit 1
fi

# Deploy migrations
log "Deploying migrations to production..."
if supabase db push --project-ref "$PROJECT_ID"; then
    success "Migrations deployed successfully"
else
    error "Migration deployment failed"
    exit 1
fi

# 7. Apply seed data (if available)
if [ -f "$SUPABASE_DIR/seed.sql" ]; then
    log "🌱 Applying seed data to production..."
    
    echo -e "${YELLOW}⚠️  WARNING: This will add sample data to your production database.${NC}"
    read -p "Do you want to apply seed data? (yes/no): " -r
    echo
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        if supabase db seed --project-ref "$PROJECT_ID"; then
            success "Seed data applied successfully"
        else
            warning "Seed data application failed (this may be expected if data already exists)"
        fi
    else
        log "Skipping seed data application"
    fi
else
    log "No seed data file found, skipping..."
fi

# 8. Verify deployment
log "🔍 Verifying production deployment..."

# Check if key tables exist
TABLES=("projects" "project_members" "assessments" "evidence_items" "assets" "policies" "tasks" "audit_logs" "cmmc_domains" "cmmc_controls" "cmmc_practices" "project_templates")

for table in "${TABLES[@]}"; do
    if supabase db diff --project-ref "$PROJECT_ID" | grep -q "CREATE TABLE.*$table"; then
        success "Table '$table' deployed successfully"
    else
        warning "Table '$table' not found or already exists"
    fi
done

# 9. Generate production TypeScript types
log "📝 Generating production TypeScript types..."

if supabase gen types typescript --project-ref "$PROJECT_ID" > src/lib/database.types.ts; then
    success "Production TypeScript types generated successfully"
else
    error "Failed to generate production TypeScript types"
    exit 1
fi

# 10. Update environment configuration
log "🔧 Updating environment configuration..."

# Get project URL and keys
PROJECT_URL=$(supabase status --project-ref "$PROJECT_ID" | grep "API URL" | cut -d' ' -f3)
ANON_KEY=$(supabase status --project-ref "$PROJECT_ID" | grep "anon key" | cut -d' ' -f3)

if [ -n "$PROJECT_URL" ] && [ -n "$ANON_KEY" ]; then
    log "Production Supabase credentials:"
    echo "VITE_SUPABASE_URL=$PROJECT_URL"
    echo "VITE_SUPABASE_ANON_KEY=$ANON_KEY"
    
    echo
    echo -e "${YELLOW}📋 Update your production environment variables:${NC}"
    echo "1. Copy the credentials above to your hosting platform"
    echo "2. Update your .env.production file"
    echo "3. Redeploy your application"
else
    warning "Could not retrieve production credentials automatically"
fi

# 11. Final status
echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                DEPLOYMENT COMPLETED!                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

log "Production database deployment completed successfully!"
log "Project ID: $PROJECT_ID"

echo
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your production environment variables with the credentials above"
echo "2. Test the application with the production database"
echo "3. Verify multi-project functionality in production"
echo "4. Set up monitoring and alerting"
echo "5. Configure backup and disaster recovery"

echo
echo -e "${BLUE}🔧 Environment Variables to Update:${NC}"
echo "VITE_SUPABASE_URL=$PROJECT_URL"
echo "VITE_SUPABASE_ANON_KEY=$ANON_KEY"

echo
echo -e "${BLUE}🏥 Health Check:${NC}"
echo "Visit: $PROJECT_URL/health (if configured)"

if [ -n "$BACKUP_FILE" ]; then
    echo
    echo -e "${BLUE}💾 Backup File:${NC}"
    echo "Backup saved as: $BACKUP_FILE"
fi

log "Production deployment script completed successfully!"
exit 0