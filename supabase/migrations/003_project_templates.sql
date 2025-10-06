-- =============================================================================
-- Project Templates and Configuration Migration
-- Pre-configured templates for different types of CMMC 2.0 projects
-- =============================================================================

-- =============================================================================
-- PROJECT TEMPLATES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(100) NOT NULL, -- cmmc_level2, cmmc_level3, nist_800_171, etc.
    industry VARCHAR(100),
    organization_size VARCHAR(50), -- small, medium, large, enterprise
    compliance_framework VARCHAR(100) NOT NULL,
    default_settings JSONB DEFAULT '{}',
    assessment_config JSONB DEFAULT '{}',
    workflow_config JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROJECT TEMPLATE MEMBERS (for collaborative templates)
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_template_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES project_templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'contributor', -- owner, editor, contributor, viewer
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, user_id)
);

-- =============================================================================
-- INSERT DEFAULT PROJECT TEMPLATES
-- =============================================================================

-- CMMC Level 2 - Small Business Template
INSERT INTO project_templates (
    name, 
    description, 
    template_type, 
    industry, 
    organization_size, 
    compliance_framework,
    default_settings,
    assessment_config,
    workflow_config,
    is_public
) VALUES (
    'CMMC 2.0 Level 2 - Small Business',
    'Pre-configured template for small businesses pursuing CMMC 2.0 Level 2 certification',
    'cmmc_level2_small',
    'general',
    'small',
    'CMMC 2.0 Level 2',
    '{
        "assessment_frequency": "quarterly",
        "evidence_retention": "7_years",
        "review_cycle": "annual",
        "notification_settings": {
            "email_reminders": true,
            "due_date_alerts": true,
            "status_changes": true
        },
        "collaboration_settings": {
            "allow_guest_reviewers": false,
            "require_approval": true,
            "auto_assign_tasks": true
        }
    }',
    '{
        "framework_version": "1.0",
        "assessment_type": "self_assessment",
        "evidence_requirements": {
            "document_upload": true,
            "screenshot_capture": true,
            "configuration_export": true,
            "policy_attestation": true
        },
        "scoring_method": "pass_fail",
        "review_process": {
            "internal_review": true,
            "external_review": false,
            "approval_required": true
        }
    }',
    '{
        "workflow_stages": [
            {
                "name": "Planning",
                "description": "Initial project setup and team assignment",
                "duration_days": 30,
                "required_roles": ["admin", "ciso"]
            },
            {
                "name": "Assessment",
                "description": "Conduct CMMC 2.0 Level 2 assessment",
                "duration_days": 90,
                "required_roles": ["compliance_officer", "auditor"]
            },
            {
                "name": "Evidence Collection",
                "description": "Gather and organize evidence",
                "duration_days": 60,
                "required_roles": ["compliance_officer", "team_member"]
            },
            {
                "name": "Review",
                "description": "Internal review and validation",
                "duration_days": 30,
                "required_roles": ["ciso", "compliance_officer"]
            },
            {
                "name": "Remediation",
                "description": "Address identified gaps",
                "duration_days": 90,
                "required_roles": ["team_member", "admin"]
            },
            {
                "name": "Certification",
                "description": "Prepare for C3PAO assessment",
                "duration_days": 60,
                "required_roles": ["ciso", "compliance_officer"]
            }
        ],
        "task_templates": [
            {
                "name": "Policy Review",
                "description": "Review and update security policies",
                "task_type": "policy_review",
                "priority": "high",
                "estimated_hours": 8
            },
            {
                "name": "Technical Assessment",
                "description": "Assess technical security controls",
                "task_type": "technical_assessment",
                "priority": "high",
                "estimated_hours": 16
            },
            {
                "name": "Evidence Collection",
                "description": "Collect evidence for controls",
                "task_type": "evidence_collection",
                "priority": "medium",
                "estimated_hours": 12
            },
            {
                "name": "Gap Analysis",
                "description": "Identify compliance gaps",
                "task_type": "gap_analysis",
                "priority": "high",
                "estimated_hours": 6
            }
        ]
    }',
    TRUE
);

-- CMMC Level 2 - Medium Business Template
INSERT INTO project_templates (
    name, 
    description, 
    template_type, 
    industry, 
    organization_size, 
    compliance_framework,
    default_settings,
    assessment_config,
    workflow_config,
    is_public
) VALUES (
    'CMMC 2.0 Level 2 - Medium Business',
    'Pre-configured template for medium-sized businesses pursuing CMMC 2.0 Level 2 certification',
    'cmmc_level2_medium',
    'general',
    'medium',
    'CMMC 2.0 Level 2',
    '{
        "assessment_frequency": "monthly",
        "evidence_retention": "7_years",
        "review_cycle": "quarterly",
        "notification_settings": {
            "email_reminders": true,
            "due_date_alerts": true,
            "status_changes": true,
            "escalation_alerts": true
        },
        "collaboration_settings": {
            "allow_guest_reviewers": true,
            "require_approval": true,
            "auto_assign_tasks": true,
            "role_based_access": true
        }
    }',
    '{
        "framework_version": "1.0",
        "assessment_type": "comprehensive_assessment",
        "evidence_requirements": {
            "document_upload": true,
            "screenshot_capture": true,
            "configuration_export": true,
            "policy_attestation": true,
            "technical_validation": true,
            "audit_logs": true
        },
        "scoring_method": "weighted_scoring",
        "review_process": {
            "internal_review": true,
            "external_review": true,
            "approval_required": true,
            "multi_level_approval": true
        }
    }',
    '{
        "workflow_stages": [
            {
                "name": "Planning",
                "description": "Initial project setup and team assignment",
                "duration_days": 45,
                "required_roles": ["admin", "ciso", "compliance_officer"]
            },
            {
                "name": "Assessment",
                "description": "Conduct comprehensive CMMC 2.0 Level 2 assessment",
                "duration_days": 120,
                "required_roles": ["compliance_officer", "auditor", "technical_lead"]
            },
            {
                "name": "Evidence Collection",
                "description": "Gather and organize evidence",
                "duration_days": 90,
                "required_roles": ["compliance_officer", "team_member", "technical_lead"]
            },
            {
                "name": "Review",
                "description": "Multi-level review and validation",
                "duration_days": 45,
                "required_roles": ["ciso", "compliance_officer", "external_reviewer"]
            },
            {
                "name": "Remediation",
                "description": "Address identified gaps",
                "duration_days": 120,
                "required_roles": ["team_member", "admin", "technical_lead"]
            },
            {
                "name": "Certification",
                "description": "Prepare for C3PAO assessment",
                "duration_days": 90,
                "required_roles": ["ciso", "compliance_officer", "certification_manager"]
            }
        ],
        "task_templates": [
            {
                "name": "Policy Review",
                "description": "Review and update security policies",
                "task_type": "policy_review",
                "priority": "high",
                "estimated_hours": 16
            },
            {
                "name": "Technical Assessment",
                "description": "Assess technical security controls",
                "task_type": "technical_assessment",
                "priority": "high",
                "estimated_hours": 32
            },
            {
                "name": "Evidence Collection",
                "description": "Collect evidence for controls",
                "task_type": "evidence_collection",
                "priority": "medium",
                "estimated_hours": 24
            },
            {
                "name": "Gap Analysis",
                "description": "Identify compliance gaps",
                "task_type": "gap_analysis",
                "priority": "high",
                "estimated_hours": 12
            },
            {
                "name": "Risk Assessment",
                "description": "Conduct risk assessment",
                "task_type": "risk_assessment",
                "priority": "high",
                "estimated_hours": 20
            },
            {
                "name": "Training Program",
                "description": "Develop security training program",
                "task_type": "training_development",
                "priority": "medium",
                "estimated_hours": 16
            }
        ]
    }',
    TRUE
);

-- CMMC Level 2 - Enterprise Template
INSERT INTO project_templates (
    name, 
    description, 
    template_type, 
    industry, 
    organization_size, 
    compliance_framework,
    default_settings,
    assessment_config,
    workflow_config,
    is_public
) VALUES (
    'CMMC 2.0 Level 2 - Enterprise',
    'Pre-configured template for large enterprises pursuing CMMC 2.0 Level 2 certification',
    'cmmc_level2_enterprise',
    'general',
    'enterprise',
    'CMMC 2.0 Level 2',
    '{
        "assessment_frequency": "continuous",
        "evidence_retention": "7_years",
        "review_cycle": "monthly",
        "notification_settings": {
            "email_reminders": true,
            "due_date_alerts": true,
            "status_changes": true,
            "escalation_alerts": true,
            "executive_dashboards": true
        },
        "collaboration_settings": {
            "allow_guest_reviewers": true,
            "require_approval": true,
            "auto_assign_tasks": true,
            "role_based_access": true,
            "multi_tenant_support": true,
            "advanced_workflows": true
        }
    }',
    '{
        "framework_version": "1.0",
        "assessment_type": "continuous_assessment",
        "evidence_requirements": {
            "document_upload": true,
            "screenshot_capture": true,
            "configuration_export": true,
            "policy_attestation": true,
            "technical_validation": true,
            "audit_logs": true,
            "automated_testing": true,
            "continuous_monitoring": true
        },
        "scoring_method": "continuous_scoring",
        "review_process": {
            "internal_review": true,
            "external_review": true,
            "approval_required": true,
            "multi_level_approval": true,
            "executive_approval": true,
            "automated_review": true
        }
    }',
    '{
        "workflow_stages": [
            {
                "name": "Planning",
                "description": "Initial project setup and team assignment",
                "duration_days": 60,
                "required_roles": ["admin", "ciso", "compliance_officer", "project_manager"]
            },
            {
                "name": "Assessment",
                "description": "Conduct comprehensive CMMC 2.0 Level 2 assessment",
                "duration_days": 180,
                "required_roles": ["compliance_officer", "auditor", "technical_lead", "security_architect"]
            },
            {
                "name": "Evidence Collection",
                "description": "Gather and organize evidence",
                "duration_days": 120,
                "required_roles": ["compliance_officer", "team_member", "technical_lead", "data_analyst"]
            },
            {
                "name": "Review",
                "description": "Multi-level review and validation",
                "duration_days": 60,
                "required_roles": ["ciso", "compliance_officer", "external_reviewer", "executive_sponsor"]
            },
            {
                "name": "Remediation",
                "description": "Address identified gaps",
                "duration_days": 180,
                "required_roles": ["team_member", "admin", "technical_lead", "remediation_manager"]
            },
            {
                "name": "Certification",
                "description": "Prepare for C3PAO assessment",
                "duration_days": 120,
                "required_roles": ["ciso", "compliance_officer", "certification_manager", "executive_sponsor"]
            },
            {
                "name": "Continuous Monitoring",
                "description": "Ongoing compliance monitoring",
                "duration_days": 365,
                "required_roles": ["compliance_officer", "monitoring_team", "technical_lead"]
            }
        ],
        "task_templates": [
            {
                "name": "Policy Review",
                "description": "Review and update security policies",
                "task_type": "policy_review",
                "priority": "high",
                "estimated_hours": 32
            },
            {
                "name": "Technical Assessment",
                "description": "Assess technical security controls",
                "task_type": "technical_assessment",
                "priority": "high",
                "estimated_hours": 64
            },
            {
                "name": "Evidence Collection",
                "description": "Collect evidence for controls",
                "task_type": "evidence_collection",
                "priority": "medium",
                "estimated_hours": 48
            },
            {
                "name": "Gap Analysis",
                "description": "Identify compliance gaps",
                "task_type": "gap_analysis",
                "priority": "high",
                "estimated_hours": 24
            },
            {
                "name": "Risk Assessment",
                "description": "Conduct comprehensive risk assessment",
                "task_type": "risk_assessment",
                "priority": "high",
                "estimated_hours": 40
            },
            {
                "name": "Training Program",
                "description": "Develop enterprise security training program",
                "task_type": "training_development",
                "priority": "medium",
                "estimated_hours": 32
            },
            {
                "name": "Automation Setup",
                "description": "Set up automated compliance monitoring",
                "task_type": "automation_setup",
                "priority": "high",
                "estimated_hours": 48
            },
            {
                "name": "Executive Reporting",
                "description": "Develop executive reporting dashboard",
                "task_type": "reporting_setup",
                "priority": "medium",
                "estimated_hours": 24
            }
        ]
    }',
    TRUE
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_project_templates_type ON project_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_project_templates_industry ON project_templates(industry);
CREATE INDEX IF NOT EXISTS idx_project_templates_size ON project_templates(organization_size);
CREATE INDEX IF NOT EXISTS idx_project_templates_public ON project_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_project_templates_active ON project_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_template_members_template_id ON project_template_members(template_id);
CREATE INDEX IF NOT EXISTS idx_template_members_user_id ON project_template_members(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY FOR TEMPLATE TABLES
-- =============================================================================

ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_template_members ENABLE ROW LEVEL SECURITY;

-- Public templates are readable by all authenticated users
CREATE POLICY "Authenticated users can read public templates" ON project_templates
    FOR SELECT USING (is_public = TRUE AND auth.role() = 'authenticated');

-- Template owners and members can manage their templates
CREATE POLICY "Template owners can manage their templates" ON project_templates
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Template members can view their templates" ON project_templates
    FOR SELECT USING (
        id IN (
            SELECT template_id FROM project_template_members 
            WHERE user_id = auth.uid()
        )
    );

-- Template members can view membership
CREATE POLICY "Users can view template membership" ON project_template_members
    FOR SELECT USING (
        template_id IN (
            SELECT id FROM project_templates 
            WHERE is_public = TRUE OR created_by = auth.uid()
        )
    );

-- =============================================================================
-- FUNCTIONS FOR TEMPLATE MANAGEMENT
-- =============================================================================

-- Function to create project from template
CREATE OR REPLACE FUNCTION create_project_from_template(
    template_id UUID,
    project_name VARCHAR(255),
    project_slug VARCHAR(100),
    organization_name VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
    new_project_id UUID;
    template_data RECORD;
BEGIN
    -- Get template data
    SELECT * INTO template_data FROM project_templates WHERE id = template_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found';
    END IF;
    
    -- Create new project
    INSERT INTO projects (
        name, 
        slug, 
        description, 
        organization_name, 
        industry, 
        compliance_framework, 
        project_type, 
        settings, 
        metadata, 
        created_by
    ) VALUES (
        project_name,
        project_slug,
        template_data.description,
        organization_name,
        template_data.industry,
        template_data.compliance_framework,
        template_data.template_type,
        template_data.default_settings,
        jsonb_build_object('created_from_template', template_id),
        auth.uid()
    ) RETURNING id INTO new_project_id;
    
    -- Add creator as project admin
    INSERT INTO project_members (project_id, user_id, role, permissions)
    VALUES (new_project_id, auth.uid(), 'admin', '{"all": true}');
    
    RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE project_templates IS 'Pre-configured project templates for different organization sizes and industries';
COMMENT ON TABLE project_template_members IS 'Collaborative access control for project templates';
COMMENT ON FUNCTION create_project_from_template IS 'Creates a new project based on a template configuration';