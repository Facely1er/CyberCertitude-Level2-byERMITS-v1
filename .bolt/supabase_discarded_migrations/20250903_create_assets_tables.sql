/*
  # Create assets and inventory management tables

  1. New Tables
    - `assets` - Main asset inventory
    - `asset_dependencies` - Asset dependency tracking
    - `asset_risk_assessments` - Risk assessment data
    - `asset_compliance` - Compliance tracking
    - `asset_relationships` - Asset relationships

  2. Security
    - Enable RLS on all tables
    - Add policies for user/organization access
*/

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  
  -- Basic information
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('hardware', 'software', 'data', 'personnel', 'facility', 'service', 'network', 'cloud')),
  subcategory text,
  type text NOT NULL,
  
  -- Ownership and responsibility
  owner text NOT NULL,
  custodian text,
  department text,
  
  -- Location information
  location jsonb DEFAULT '{
    "type": "physical",
    "address": null,
    "building": null,
    "room": null,
    "rack": null,
    "cloudProvider": null,
    "region": null
  }'::jsonb,
  
  -- Status and criticality
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned', 'planned')),
  criticality text DEFAULT 'medium' CHECK (criticality IN ('critical', 'high', 'medium', 'low', 'minimal')),
  availability_requirement text DEFAULT 'medium' CHECK (availability_requirement IN ('critical', 'high', 'medium', 'low')),
  
  -- Security and compliance
  classification text DEFAULT 'internal' CHECK (classification IN ('public', 'internal', 'confidential', 'restricted', 'secret')),
  security_controls jsonb DEFAULT '[]'::jsonb,
  compliance_requirements text[] DEFAULT '{}',
  
  -- Technical details
  technical_details jsonb DEFAULT '{}'::jsonb,
  configuration jsonb DEFAULT '{}'::jsonb,
  
  -- Financial information
  cost numeric(12,2),
  purchase_date date,
  warranty_expiration date,
  
  -- Lifecycle
  lifecycle_phase text DEFAULT 'operational' CHECK (lifecycle_phase IN ('planning', 'acquisition', 'deployment', 'operational', 'maintenance', 'disposal')),
  end_of_life date,
  
  -- Risk and compliance
  last_audit_date date,
  next_audit_date date,
  last_risk_assessment date,
  overall_risk_level text DEFAULT 'medium' CHECK (overall_risk_level IN ('critical', 'high', 'medium', 'low', 'minimal')),
  
  -- Metadata
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset dependencies table
CREATE TABLE IF NOT EXISTS asset_dependencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  dependent_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  
  -- Dependency details
  dependency_type text NOT NULL CHECK (dependency_type IN ('functional', 'data-flow', 'network', 'authentication', 'service', 'backup', 'failover')),
  criticality_impact text DEFAULT 'medium' CHECK (criticality_impact IN ('critical', 'high', 'medium', 'low', 'minimal')),
  description text,
  bidirectional boolean DEFAULT false,
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate dependencies
  UNIQUE(source_asset_id, dependent_asset_id, dependency_type)
);

-- Create asset risk assessments table
CREATE TABLE IF NOT EXISTS asset_risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  
  -- Risk assessment data
  overall_risk text NOT NULL CHECK (overall_risk IN ('critical', 'high', 'medium', 'low', 'minimal')),
  risk_factors jsonb DEFAULT '[]'::jsonb,
  threats jsonb DEFAULT '[]'::jsonb,
  vulnerabilities jsonb DEFAULT '[]'::jsonb,
  
  -- Impact assessment
  impact_assessment jsonb DEFAULT '{
    "confidentiality": "medium",
    "integrity": "medium",
    "availability": "medium",
    "financialImpact": null,
    "operationalImpact": null,
    "reputationalImpact": null,
    "legalImpact": null
  }'::jsonb,
  
  -- Likelihood assessment
  likelihood_assessment jsonb DEFAULT '{
    "threatLevel": "medium",
    "vulnerabilityLevel": "medium",
    "exposureLevel": "medium",
    "historicalIncidents": 0
  }'::jsonb,
  
  -- Risk treatment
  risk_treatment jsonb DEFAULT '{
    "strategy": "mitigate",
    "controls": [],
    "residualRisk": "medium",
    "acceptanceJustification": null
  }'::jsonb,
  
  -- Assessment metadata
  assessed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assessment_date timestamptz DEFAULT now(),
  next_assessment_date timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create asset compliance table
CREATE TABLE IF NOT EXISTS asset_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  
  -- Compliance framework
  framework text NOT NULL,
  requirement_id text NOT NULL,
  requirement_description text,
  
  -- Compliance status
  status text DEFAULT 'not-assessed' CHECK (status IN ('compliant', 'non-compliant', 'partially-compliant', 'not-applicable', 'not-assessed')),
  implementation_status text DEFAULT 'not-started' CHECK (implementation_status IN ('implemented', 'partially-implemented', 'planned', 'not-started', 'not-applicable')),
  
  -- Evidence and documentation
  evidence_ids text[] DEFAULT '{}',
  control_ids text[] DEFAULT '{}',
  notes text,
  
  -- Assessment details
  last_assessed date,
  assessed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  next_review_date date,
  
  -- Remediation
  remediation_plan text,
  remediation_deadline date,
  remediation_owner text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Unique compliance per asset and requirement
  UNIQUE(asset_id, framework, requirement_id)
);

-- Create asset relationships table
CREATE TABLE IF NOT EXISTS asset_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  target_asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  
  -- Relationship details
  relationship_type text NOT NULL CHECK (relationship_type IN ('parent-child', 'peer', 'backup', 'cluster-member', 'load-balanced', 'replicated', 'connected-to')),
  description text,
  strength text DEFAULT 'medium' CHECK (strength IN ('strong', 'medium', 'weak')),
  bidirectional boolean DEFAULT true,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate relationships
  UNIQUE(source_asset_id, target_asset_id, relationship_type)
);

-- Create indexes for performance
CREATE INDEX idx_assets_organization_id ON assets(organization_id);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_criticality ON assets(criticality);
CREATE INDEX idx_assets_owner ON assets(owner);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);

CREATE INDEX idx_asset_dependencies_source ON asset_dependencies(source_asset_id);
CREATE INDEX idx_asset_dependencies_dependent ON asset_dependencies(dependent_asset_id);

CREATE INDEX idx_asset_risk_assessments_asset_id ON asset_risk_assessments(asset_id);
CREATE INDEX idx_asset_risk_assessments_overall_risk ON asset_risk_assessments(overall_risk);

CREATE INDEX idx_asset_compliance_asset_id ON asset_compliance(asset_id);
CREATE INDEX idx_asset_compliance_framework ON asset_compliance(framework);
CREATE INDEX idx_asset_compliance_status ON asset_compliance(status);

CREATE INDEX idx_asset_relationships_source ON asset_relationships(source_asset_id);
CREATE INDEX idx_asset_relationships_target ON asset_relationships(target_asset_id);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assets
CREATE POLICY "Organization members can view assets"
  ON assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = assets.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Editors can create assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = assets.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Editors can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = assets.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Admins can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = assets.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    )
  );

-- Similar RLS policies for related tables
CREATE POLICY "Organization members can view asset dependencies"
  ON asset_dependencies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assets
      JOIN organization_members ON organization_members.organization_id = assets.organization_id
      WHERE assets.id IN (asset_dependencies.source_asset_id, asset_dependencies.dependent_asset_id)
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

-- Create updated_at triggers
CREATE TRIGGER handle_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_asset_dependencies_updated_at
  BEFORE UPDATE ON asset_dependencies
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_asset_risk_assessments_updated_at
  BEFORE UPDATE ON asset_risk_assessments
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_asset_compliance_updated_at
  BEFORE UPDATE ON asset_compliance
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_asset_relationships_updated_at
  BEFORE UPDATE ON asset_relationships
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();