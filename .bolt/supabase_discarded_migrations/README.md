# Supabase Database Migrations

This directory contains all database migrations for the CMMC Level 2 Compliance Platform.

## Migration Order

The migrations should be applied in the following order:

1. **20250730115425_falling_castle.sql** - Creates the initial profiles table and authentication setup
2. **20250801073850_gentle_fog.sql** - Fixes user signup and foreign key constraints
3. **20250901_create_assessments_tables.sql** - Creates assessment-related tables
4. **20250902_create_organizations_tables.sql** - Creates organization and team management tables
5. **20250903_create_assets_tables.sql** - Creates asset inventory and management tables
6. **20250904_create_evidence_tables.sql** - Creates evidence collection and validation tables
7. **20250905_create_audit_and_tasks_tables.sql** - Creates audit logs, tasks, and notification tables
8. **20250906_create_additional_tables.sql** - Creates reports, templates, settings, and integration tables

## Table Overview

### Core Tables
- `profiles` - User profiles and preferences
- `organizations` - Organization management
- `organization_members` - Organization membership and roles
- `teams` - Sub-teams within organizations
- `team_members` - Team membership

### Assessment Tables
- `assessments` - Main assessment data
- `assessment_versions` - Version history tracking
- `assessment_sessions` - Auto-save session data
- `workflow_phase_tracking` - Workflow progress tracking

### Asset Management
- `assets` - Asset inventory
- `asset_dependencies` - Asset dependency tracking
- `asset_risk_assessments` - Risk assessment data
- `asset_compliance` - Compliance tracking
- `asset_relationships` - Asset relationships

### Evidence Management
- `evidence` - Evidence items and documents
- `evidence_collections` - Evidence collection requirements
- `evidence_validations` - Evidence validation tracking
- `evidence_mappings` - Evidence to control/asset mappings

### Audit and Compliance
- `audit_logs` - System audit trail
- `tasks` - Task management
- `task_assignments` - Task assignment tracking
- `compliance_calendar` - Compliance deadlines
- `notifications` - System notifications

### Supporting Tables
- `reports` - Generated reports storage
- `templates` - Assessment and report templates
- `settings` - Organization and user settings
- `integrations` - Third-party integrations
- `invitations` - Team invitations

## Security Features

All tables include:
- Row Level Security (RLS) enabled
- Appropriate access policies based on user roles
- Audit trail via updated_at triggers
- Foreign key constraints for data integrity

## Running Migrations

To apply these migrations to your Supabase project:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

## Development Setup

For local development:

1. Start Supabase locally:
   ```bash
   supabase start
   ```

2. Apply migrations:
   ```bash
   supabase db reset
   ```

This will apply all migrations in order to your local database.

## Important Notes

- Always test migrations in a development environment first
- Backup your production database before applying new migrations
- Some migrations depend on previous ones, so apply them in order
- The `handle_updated_at()` function is created in the first migration and used throughout

## Troubleshooting

If you encounter errors:

1. Check that all previous migrations have been applied
2. Ensure you're using the correct Supabase project
3. Verify that the auth schema exists (required for user references)
4. Check the Supabase dashboard for detailed error messages

For support, refer to the Supabase documentation or contact the development team.