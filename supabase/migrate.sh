#!/bin/bash

# =============================================================================
# Supabase Migration Script for CMMC 2.0 Level 2 Compliance Platform
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
SEED_FILE="$SUPABASE_DIR/seed.sql"

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
echo "║                    Database Migration Script                ║"
echo "║                  Multi-Project Schema Setup                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "Starting database migration process..."

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

success "Prerequisites check passed"

# 2. Initialize Supabase project (if not already initialized)
log "🔧 Initializing Supabase project..."

if [ ! -f "$CONFIG_FILE" ]; then
    warning "Supabase config not found. Initializing new project..."
    supabase init
else
    log "Supabase project already initialized"
fi

# 3. Check Supabase connection
log "🔗 Checking Supabase connection..."

# Check if user is logged in
if ! supabase status &> /dev/null; then
    warning "Not connected to Supabase. Please login:"
    echo "supabase login"
    echo "Then run this script again."
    exit 1
fi

success "Supabase connection verified"

# 4. Start local Supabase (if not running)
log "🚀 Starting local Supabase instance..."

if ! supabase status | grep -q "API URL"; then
    log "Starting local Supabase..."
    supabase start
else
    log "Local Supabase already running"
fi

success "Local Supabase instance ready"

# 5. Run migrations
log "📊 Running database migrations..."

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

# Run migrations
log "Applying migrations..."
if supabase db reset; then
    success "Migrations applied successfully"
else
    error "Migration failed"
    exit 1
fi

# 6. Apply seed data (if available)
if [ -f "$SEED_FILE" ]; then
    log "🌱 Applying seed data..."
    if supabase db seed; then
        success "Seed data applied successfully"
    else
        warning "Seed data application failed (this may be expected if data already exists)"
    fi
else
    log "No seed data file found, skipping..."
fi

# 7. Verify schema
log "🔍 Verifying database schema..."

# Check if key tables exist
TABLES=("projects" "project_members" "assessments" "evidence_items" "assets" "policies" "tasks" "audit_logs" "cmmc_domains" "cmmc_controls" "cmmc_practices" "project_templates")

for table in "${TABLES[@]}"; do
    if supabase db diff --schema public | grep -q "CREATE TABLE.*$table"; then
        success "Table '$table' created successfully"
    else
        warning "Table '$table' not found or already exists"
    fi
done

# 8. Generate TypeScript types
log "📝 Generating TypeScript types..."

if supabase gen types typescript --local > src/lib/database.types.ts; then
    success "TypeScript types generated successfully"
else
    error "Failed to generate TypeScript types"
    exit 1
fi

# 9. Display connection information
log "📋 Supabase connection information:"

echo
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    MIGRATION COMPLETED!                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo

# Get Supabase status
SUPABASE_STATUS=$(supabase status)
echo "$SUPABASE_STATUS"

echo
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your .env file with the local Supabase credentials above"
echo "2. Test the application locally: npm run dev"
echo "3. Verify multi-project functionality"
echo "4. Deploy to production when ready"

echo
echo -e "${BLUE}🔧 Environment Variables to Update:${NC}"
echo "VITE_SUPABASE_URL=<API URL from status above>"
echo "VITE_SUPABASE_ANON_KEY=<anon key from status above>"

echo
echo -e "${BLUE}🏥 Health Check:${NC}"
echo "Visit: <API URL>/health (if configured)"

log "Migration script completed successfully!"
exit 0