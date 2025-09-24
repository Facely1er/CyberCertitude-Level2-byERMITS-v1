-- Create evidence tables migration
-- This migration creates the evidence collection and management system

-- Create evidence categories table
CREATE TABLE IF NOT EXISTS public.evidence_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  framework_id TEXT NOT NULL,
  control_id TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create evidence table
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL, -- Will reference assessments table when created
  category_id UUID REFERENCES public.evidence_categories(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'under_review', 'approved', 'rejected', 'archived')),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  control_id TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_latest BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create evidence reviews table
CREATE TABLE IF NOT EXISTS public.evidence_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES public.evidence(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'needs_revision')),
  comments TEXT,
  feedback TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create evidence templates table
CREATE TABLE IF NOT EXISTS public.evidence_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  framework_id TEXT NOT NULL,
  control_id TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.evidence_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for evidence categories
CREATE POLICY "All users can view evidence categories" ON public.evidence_categories
  FOR SELECT USING (true);

-- Create RLS policies for evidence
CREATE POLICY "Users can view evidence for their assessments" ON public.evidence
  FOR SELECT USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.organizations o ON om.organization_id = o.id
      WHERE o.id = (
        SELECT organization_id FROM public.assessments WHERE id = evidence.assessment_id
      )
      AND om.user_id = auth.uid()
      AND om.is_active = true
    )
  );

CREATE POLICY "Users can manage their own evidence" ON public.evidence
  FOR ALL USING (uploaded_by = auth.uid());

-- Create RLS policies for evidence reviews
CREATE POLICY "Users can view reviews for their evidence" ON public.evidence_reviews
  FOR SELECT USING (
    reviewer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.evidence e
      WHERE e.id = evidence_reviews.evidence_id
      AND e.uploaded_by = auth.uid()
    )
  );

CREATE POLICY "Users can create reviews for evidence they can access" ON public.evidence_reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.evidence e
      WHERE e.id = evidence_reviews.evidence_id
      AND (
        e.uploaded_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.organizations o ON om.organization_id = o.id
          WHERE o.id = (
            SELECT organization_id FROM public.assessments WHERE id = e.assessment_id
          )
          AND om.user_id = auth.uid()
          AND om.is_active = true
        )
      )
    )
  );

-- Create RLS policies for evidence templates
CREATE POLICY "All users can view active evidence templates" ON public.evidence_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own evidence templates" ON public.evidence_templates
  FOR ALL USING (created_by = auth.uid());

-- Create indexes
CREATE INDEX idx_evidence_categories_framework ON public.evidence_categories(framework_id);
CREATE INDEX idx_evidence_categories_control ON public.evidence_categories(control_id);
CREATE INDEX idx_evidence_assessment_id ON public.evidence(assessment_id);
CREATE INDEX idx_evidence_uploaded_by ON public.evidence(uploaded_by);
CREATE INDEX idx_evidence_status ON public.evidence(status);
CREATE INDEX idx_evidence_control_id ON public.evidence(control_id);
CREATE INDEX idx_evidence_reviews_evidence_id ON public.evidence_reviews(evidence_id);
CREATE INDEX idx_evidence_reviews_reviewer_id ON public.evidence_reviews(reviewer_id);
CREATE INDEX idx_evidence_templates_framework ON public.evidence_templates(framework_id);
CREATE INDEX idx_evidence_templates_control ON public.evidence_templates(control_id);

-- Grant permissions
GRANT ALL ON public.evidence_categories TO authenticated;
GRANT ALL ON public.evidence TO authenticated;
GRANT ALL ON public.evidence_reviews TO authenticated;
GRANT ALL ON public.evidence_templates TO authenticated;