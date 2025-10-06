/*
  # Create evidence collection and management tables

  1. New Tables
    - `evidence` - Evidence items and documents
    - `evidence_collections` - Evidence collection requirements
    - `evidence_validations` - Evidence validation tracking
    - `evidence_mappings` - Evidence to control/asset mappings

  2. Storage
    - Use Supabase Storage for file uploads
    - Store metadata in database

  3. Security
    - Enable RLS on all tables
    - Add policies for organization access
*/

-- Create evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic information
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('document', 'screenshot', 'configuration', 'report', 'log', 'policy', 'procedure', 'record', 'other')),
  
  -- File information (if applicable)
  file_path text, -- Path in Supabase Storage
  file_name text,
  file_size bigint,
  mime_type text,
  file_hash text, -- SHA-256 hash for integrity
  
  -- Evidence details
  evidence_date date DEFAULT CURRENT_DATE,
  expiration_date date,
  review_date date,
  
  -- Classification and handling
  classification text DEFAULT 'internal' CHECK (classification IN ('public', 'internal', 'confidential', 'restricted')),
  retention_period interval DEFAULT '3 years'::interval,
  
  -- Linked entities
  control_ids text[] DEFAULT '{}',
  asset_ids uuid[] DEFAULT '{}',
  assessment_ids uuid[] DEFAULT '{}',
  
  -- Collection information
  collection_method text CHECK (collection_method IN ('manual', 'automated', 'imported', 'generated')),
  source_system text,
  
  -- Validation status
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'rejected', 'expired')),
  validated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  validated_at timestamptz,
  validation_notes text,
  
  -- Metadata
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Audit trail
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evidence collections table
CREATE TABLE IF NOT EXISTS evidence_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  
  -- Collection details
  name text NOT NULL,
  description text,
  control_id text NOT NULL,
  framework text NOT NULL,
  
  -- Requirements
  required_evidence_types text[] DEFAULT '{}',
  collection_frequency text CHECK (collection_frequency IN ('once', 'annual', 'semi-annual', 'quarterly', 'monthly', 'continuous')),
  
  -- Status tracking
  collection_status text DEFAULT 'not-started' CHECK (collection_status IN ('not-started', 'in-progress', 'complete', 'overdue')),
  completion_percentage numeric(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Assignment
  assigned_to uuid[] DEFAULT '{}',
  due_date date,
  reminder_date date,
  
  -- Evidence tracking
  evidence_ids uuid[] DEFAULT '{}',
  required_count integer DEFAULT 1,
  collected_count integer DEFAULT 0,
  
  -- Metadata
  priority text DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  tags text[] DEFAULT '{}',
  
  -- Timestamps
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evidence validations table
CREATE TABLE IF NOT EXISTS evidence_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid REFERENCES evidence(id) ON DELETE CASCADE NOT NULL,
  
  -- Validation details
  validation_type text NOT NULL CHECK (validation_type IN ('automated', 'manual', 'peer-review', 'expert-review')),
  status text NOT NULL CHECK (status IN ('pending', 'passed', 'failed', 'requires-attention')),
  
  -- Validation results
  findings jsonb DEFAULT '[]'::jsonb,
  score numeric(5,2),
  
  -- Review information
  validated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  validated_at timestamptz DEFAULT now(),
  review_notes text,
  
  -- Follow-up
  requires_remediation boolean DEFAULT false,
  remediation_notes text,
  next_validation_date date,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evidence mappings table
CREATE TABLE IF NOT EXISTS evidence_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid REFERENCES evidence(id) ON DELETE CASCADE NOT NULL,
  
  -- Mapping type and target
  mapping_type text NOT NULL CHECK (mapping_type IN ('control', 'asset', 'assessment', 'requirement')),
  target_id text NOT NULL, -- Can be control_id, asset_id, etc.
  target_framework text, -- For control mappings
  
  -- Relationship details
  relationship_type text DEFAULT 'supports' CHECK (relationship_type IN ('supports', 'implements', 'validates', 'documents')),
  coverage_percentage numeric(5,2) DEFAULT 100 CHECK (coverage_percentage >= 0 AND coverage_percentage <= 100),
  
  -- Effectiveness
  effectiveness text DEFAULT 'effective' CHECK (effectiveness IN ('effective', 'partially-effective', 'ineffective', 'not-assessed')),
  effectiveness_notes text,
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate mappings
  UNIQUE(evidence_id, mapping_type, target_id)
);

-- Create indexes for performance
CREATE INDEX idx_evidence_organization_id ON evidence(organization_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_evidence_validation_status ON evidence(validation_status);
CREATE INDEX idx_evidence_control_ids ON evidence USING GIN(control_ids);
CREATE INDEX idx_evidence_asset_ids ON evidence USING GIN(asset_ids);
CREATE INDEX idx_evidence_created_at ON evidence(created_at DESC);

CREATE INDEX idx_evidence_collections_organization_id ON evidence_collections(organization_id);
CREATE INDEX idx_evidence_collections_control_id ON evidence_collections(control_id);
CREATE INDEX idx_evidence_collections_status ON evidence_collections(collection_status);
CREATE INDEX idx_evidence_collections_due_date ON evidence_collections(due_date);

CREATE INDEX idx_evidence_validations_evidence_id ON evidence_validations(evidence_id);
CREATE INDEX idx_evidence_validations_status ON evidence_validations(status);

CREATE INDEX idx_evidence_mappings_evidence_id ON evidence_mappings(evidence_id);
CREATE INDEX idx_evidence_mappings_target ON evidence_mappings(mapping_type, target_id);

-- Enable RLS
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for evidence
CREATE POLICY "Organization members can view evidence"
  ON evidence FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = evidence.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Editors can manage evidence"
  ON evidence FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = evidence.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

-- RLS Policies for evidence_collections
CREATE POLICY "Organization members can view collections"
  ON evidence_collections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = evidence_collections.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Editors can manage collections"
  ON evidence_collections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = evidence_collections.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

-- RLS Policies for evidence_validations
CREATE POLICY "Organization members can view validations"
  ON evidence_validations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM evidence
      JOIN organization_members ON organization_members.organization_id = evidence.organization_id
      WHERE evidence.id = evidence_validations.evidence_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Authorized users can create validations"
  ON evidence_validations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM evidence
      JOIN organization_members ON organization_members.organization_id = evidence.organization_id
      WHERE evidence.id = evidence_validations.evidence_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin', 'editor')
      AND organization_members.status = 'active'
    )
  );

-- Create updated_at triggers
CREATE TRIGGER handle_evidence_updated_at
  BEFORE UPDATE ON evidence
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_evidence_collections_updated_at
  BEFORE UPDATE ON evidence_collections
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_evidence_validations_updated_at
  BEFORE UPDATE ON evidence_validations
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_evidence_mappings_updated_at
  BEFORE UPDATE ON evidence_mappings
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Function to update collection status
CREATE OR REPLACE FUNCTION update_collection_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update collected count and completion percentage
  UPDATE evidence_collections
  SET 
    collected_count = array_length(evidence_ids, 1),
    completion_percentage = CASE 
      WHEN required_count > 0 THEN (array_length(evidence_ids, 1)::numeric / required_count::numeric * 100)
      ELSE 0
    END,
    collection_status = CASE
      WHEN array_length(evidence_ids, 1) >= required_count THEN 'complete'
      WHEN array_length(evidence_ids, 1) > 0 THEN 'in-progress'
      WHEN due_date < CURRENT_DATE THEN 'overdue'
      ELSE 'not-started'
    END
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update collection status
CREATE TRIGGER update_collection_status_trigger
  AFTER INSERT OR UPDATE OF evidence_ids ON evidence_collections
  FOR EACH ROW
  EXECUTE PROCEDURE update_collection_status();