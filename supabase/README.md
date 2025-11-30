# 🗄️ CMMC 2.0 Level 2 Compliance Platform - Database Schema

## Multi-Project Support with Differentiated Schemas

This directory contains the complete database schema and migration system for the CMMC 2.0 Level 2 Compliance Platform, designed to support multiple projects within a single Supabase instance.

## 📁 Directory Structure

```
supabase/
├── migrations/           # Database migration files
│   ├── 001_initial_schema.sql      # Core multi-project schema
│   ├── 002_cmmc_framework_data.sql # CMMC 2.0 Level 2 framework data
│   └── 003_project_templates.sql   # Pre-configured project templates
├── config.toml          # Supabase configuration
├── seed.sql             # Sample data for testing
├── migrate.sh           # Local development migration script
├── deploy-production.sh # Production deployment script
└── README.md           # This file
```

## 🏗️ Schema Architecture

### Multi-Project Design

The schema is designed with **project isolation** as a core principle:

- **Projects Table**: Each organization/company gets its own project
- **Project Members**: Role-based access control per project
- **Row Level Security (RLS)**: Automatic data isolation between projects
- **Storage Buckets**: Project-specific file organization

### Core Tables

#### Project Management
- `projects` - Multi-tenant project containers
- `project_members` - Role-based access control
- `project_templates` - Pre-configured project templates

#### Compliance Assessment
- `assessments` - CMMC 2.0 Level 2 assessments with project isolation
- `assessment_versions` - Audit trail for assessment changes
- `evidence_items` - Evidence collection with project context
- `cmmc_domains` - CMMC control families (AC, AT, AU, etc.)
- `cmmc_controls` - CMMC 2.0 Level 2 controls
- `cmmc_practices` - Specific CMMC practices

#### Asset & Policy Management
- `assets` - Asset inventory with project isolation
- `policies` - Policy management with project context
- `tasks` - Task management with project isolation

#### Audit & Monitoring
- `audit_logs` - Comprehensive audit trail
- `profiles` - User profiles with project context

## 🚀 Quick Start

### 1. Local Development Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Run local migration
./supabase/migrate.sh
```

### 2. Production Deployment

```bash
# Deploy to production
./supabase/deploy-production.sh
```

## 📊 Migration Files

### 001_initial_schema.sql
- **Purpose**: Core multi-project schema setup
- **Features**:
  - Project isolation with RLS policies
  - Role-based access control
  - Audit logging
  - User profile management
  - Asset and policy management

### 002_cmmc_framework_data.sql
- **Purpose**: CMMC 2.0 Level 2 framework data
- **Features**:
  - Complete CMMC 2.0 Level 2 domains (AC, AT, AU, etc.)
  - All CMMC 2.0 Level 2 controls and practices
  - Assessment objectives and discussions
  - Reference materials

### 003_project_templates.sql
- **Purpose**: Pre-configured project templates
- **Features**:
  - Small business template
  - Medium business template
  - Enterprise template
  - Workflow configurations
  - Task templates

## 🔐 Security Features

### Row Level Security (RLS)
All tables implement RLS policies ensuring:
- Users can only access data from their projects
- Automatic data isolation between projects
- Role-based permissions within projects

### Storage Security
- Project-specific storage buckets
- Automatic file organization by project
- Secure file access controls

### Audit Trail
- Comprehensive logging of all user actions
- Project context for all audit events
- Immutable audit records

## 🎯 Project Templates

### Small Business Template
- **Target**: Small businesses (< 50 employees)
- **Features**: Basic CMMC 2.0 Level 2 assessment
- **Workflow**: Simplified 6-stage process
- **Duration**: ~6 months

### Medium Business Template
- **Target**: Medium businesses (50-500 employees)
- **Features**: Comprehensive assessment with external review
- **Workflow**: 6-stage process with multi-level approval
- **Duration**: ~9 months

### Enterprise Template
- **Target**: Large enterprises (500+ employees)
- **Features**: Continuous assessment with automation
- **Workflow**: 7-stage process with executive oversight
- **Duration**: ~12 months

## 🔧 Configuration

### Environment Variables
```bash
# Required for production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional for enhanced features
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
```

### Supabase Configuration
The `config.toml` file includes:
- Multi-project RLS policies
- Storage bucket configurations
- Auth settings for multi-tenancy
- Edge function configurations

## 📈 Performance Optimizations

### Indexes
- Project-based indexes for fast queries
- Composite indexes for common query patterns
- Audit log indexes for efficient searching

### Query Optimization
- Efficient RLS policy design
- Optimized joins for project data
- Caching strategies for framework data

## 🧪 Testing

### Sample Data
The `seed.sql` file includes:
- 3 sample projects (different sizes)
- Sample assessments in various states
- Evidence items and assets
- Policies and tasks
- Audit logs

### Test Scenarios
- Multi-project data isolation
- Role-based access control
- Assessment workflows
- Evidence collection
- Audit trail functionality

## 🔄 Migration Strategy

### Local Development
1. Run `./supabase/migrate.sh` for local setup
2. Test with sample data
3. Verify multi-project functionality

### Production Deployment
1. Run `./supabase/deploy-production.sh`
2. Update environment variables
3. Test production functionality
4. Set up monitoring

### Schema Updates
- Add new migration files with sequential numbering
- Test migrations locally first
- Deploy to production using deployment script

## 📚 Additional Resources

### Documentation
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [CMMC 2.0 Level 2 Framework](https://www.acq.osd.mil/cmmc/)

### Support
- Check migration logs for errors
- Verify RLS policies are working
- Test multi-project isolation
- Monitor audit logs

## 🚨 Important Notes

### Production Considerations
- **Backup**: Always backup before migrations
- **Testing**: Test migrations in staging first
- **Monitoring**: Set up database monitoring
- **Security**: Regularly review RLS policies

### Multi-Project Isolation
- Each project is completely isolated
- Users can only access their assigned projects
- Data cannot leak between projects
- Audit logs maintain project context

### Compliance Requirements
- All data is encrypted at rest
- Audit trails are immutable
- Access controls are enforced
- Evidence is securely stored

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Status**: Production Ready