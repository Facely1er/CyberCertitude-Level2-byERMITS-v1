    'military',
    'CMMC 2.0 Level 2',
    'compliance',
    '{
        "assessment_frequency": "quarterly",
        "evidence_retention": "7_years",
        "review_cycle": "annual",
        "notification_settings": {
            "email_reminders": true,
            "due_date_alerts": true,
            "status_changes": true
        }
    }',
    '{
        "organization_size": "medium",
        "primary_contracts": ["Military", "Navy", "Army"],
        "data_classification": "CUI",
        "compliance_officer": "John Smith"
    }',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'TechStart Inc - CMMC Assessment',
    'techstart-cmmc',
    'CMMC 2.0 Level 2 assessment for TechStart Inc',
    'TechStart Inc',
    'technology',
    'CMMC 2.0 Level 2',
    'compliance',
    '{
        "assessment_frequency": "monthly",
        "evidence_retention": "7_years",
        "review_cycle": "quarterly",
        "notification_settings": {
            "email_reminders": true,
            "due_date_alerts": true,
            "status_changes": true,
            "escalation_alerts": true
        }
    }',
    '{
        "organization_size": "small",
        "primary_contracts": ["Military"],
        "data_classification": "CUI",
        "compliance_officer": "Jane Doe"
    }',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Global Systems - CMMC 2.0 Level 2',
    'global-systems-cmmc',
    'Enterprise CMMC 2.0 Level 2 compliance program',
    'Global Systems Corporation',
    'aerospace',
    'CMMC 2.0 Level 2',
    'compliance',
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
        }
    }',
    '{
        "organization_size": "enterprise",
        "primary_contracts": ["Military", "Navy", "Army", "Air Force"],
        "data_classification": "CUI",
        "compliance_officer": "Robert Johnson"
    }',
    (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;

