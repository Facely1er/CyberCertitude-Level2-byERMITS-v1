import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

// Level 1 specific types
export interface Level1Profile {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  organization?: string;
  role: 'compliance_officer' | 'security_manager' | 'assessor' | 'reviewer' | 'admin';
  industry?: string;
  fci_handling: boolean;
  organization_size?: string;
  certifications: string[];
  preferences: Record<string, any>;
  avatar?: string;
  timezone: string;
  phone_number?: string;
  department?: string;
  manager?: string;
  created_at: string;
  updated_at: string;
}

export interface Level1Organization {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size_category?: string;
  fci_handling: boolean;
  dod_contractor: boolean;
  compliance_framework: string[];
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Level1Assessment {
  id: string;
  user_id: string;
  organization_id?: string;
  framework_id: string;
  framework_name: string;
  responses: Record<string, any>;
  organization_info: Record<string, any>;
  is_complete: boolean;
  version: string;
  template_id?: string;
  tags: string[];
  notes?: string;
  reviewers: string[];
  approval_status: 'draft' | 'in_progress' | 'under_review' | 'approved' | 'rejected' | 'archived';
  bookmarks: string[];
  time_spent: number;
  question_notes: Record<string, any>;
  question_evidence: Record<string, any>;
  evidence_library: Record<string, any>;
  risk_rating?: string;
  business_impact?: string;
  compliance_requirements: string[];
  assessment_version: string;
  fci_classification?: string;
  self_assessment_ready: boolean;
  created_at: string;
  updated_at: string;
}

export interface Level1Practice {
  id: string;
  assessment_id: string;
  practice_id: string;
  practice_name: string;
  domain: 'access_control' | 'identification_authentication' | 'media_protection' | 'physical_protection' | 'system_communications_protection' | 'system_information_integrity';
  status: 'not_implemented' | 'partially_implemented' | 'fully_implemented' | 'needs_review';
  implementation_notes?: string;
  evidence_required: string[];
  evidence_provided: string[];
  implementation_date?: string;
  review_date?: string;
  next_review_date?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_effort_hours?: number;
  actual_effort_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface Level1Evidence {
  id: string;
  assessment_id: string;
  practice_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'archived';
  uploaded_by: string;
  description?: string;
  tags: string[];
  metadata: Record<string, any>;
  fci_classification?: string;
  created_at: string;
  updated_at: string;
}

export interface Level1Task {
  id: string;
  assessment_id: string;
  practice_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  due_date?: string;
  action_required?: string;
  fci_related: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Level1DomainScore {
  id: string;
  assessment_id: string;
  domain: 'access_control' | 'identification_authentication' | 'media_protection' | 'physical_protection' | 'system_communications_protection' | 'system_information_integrity';
  total_practices: number;
  implemented_practices: number;
  score_percentage: number;
  last_updated: string;
  created_at: string;
}

// Level 1 Data Service
export class Level1DataService {
  private static readonly STORAGE_KEY = 'cmmc_level1_data';

  /**
   * Get user profile from Level 1 schema
   */
  static async getUserProfile(userId: string): Promise<Level1Profile | null> {
    try {
      const { data, error } = await supabase
        .from('level1_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        logger.error('Failed to get Level 1 user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to get Level 1 user profile:', error);
      return null;
    }
  }

  /**
   * Create or update user profile in Level 1 schema
   */
  static async upsertUserProfile(profile: Partial<Level1Profile>): Promise<Level1Profile | null> {
    try {
      const { data, error } = await supabase
        .from('level1_profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        logger.error('Failed to upsert Level 1 user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to upsert Level 1 user profile:', error);
      return null;
    }
  }

  /**
   * Get organization from Level 1 schema
   */
  static async getOrganization(orgId: string): Promise<Level1Organization | null> {
    try {
      const { data, error } = await supabase
        .from('level1_organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (error) {
        logger.error('Failed to get Level 1 organization:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to get Level 1 organization:', error);
      return null;
    }
  }

  /**
   * Create organization in Level 1 schema
   */
  static async createOrganization(org: Partial<Level1Organization>): Promise<Level1Organization | null> {
    try {
      const { data, error } = await supabase
        .from('level1_organizations')
        .insert(org)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create Level 1 organization:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to create Level 1 organization:', error);
      return null;
    }
  }

  /**
   * Get Level 1 assessment
   */
  static async getAssessment(assessmentId: string): Promise<Level1Assessment | null> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) {
        logger.error('Failed to get Level 1 assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to get Level 1 assessment:', error);
      return null;
    }
  }

  /**
   * Get user's Level 1 assessments
   */
  static async getUserAssessments(userId: string): Promise<Level1Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to get Level 1 user assessments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 user assessments:', error);
      return [];
    }
  }

  /**
   * Create Level 1 assessment
   */
  static async createAssessment(assessment: Partial<Level1Assessment>): Promise<Level1Assessment | null> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .insert({
          ...assessment,
          framework_id: 'cmmc-level1',
          framework_name: 'CMMC Level 1 - Basic Cyber Hygiene',
          compliance_requirements: ['FCI Protection']
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create Level 1 assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to create Level 1 assessment:', error);
      return null;
    }
  }

  /**
   * Update Level 1 assessment
   */
  static async updateAssessment(assessmentId: string, updates: Partial<Level1Assessment>): Promise<Level1Assessment | null> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .update(updates)
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update Level 1 assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to update Level 1 assessment:', error);
      return null;
    }
  }

  /**
   * Get Level 1 practices for an assessment
   */
  static async getAssessmentPractices(assessmentId: string): Promise<Level1Practice[]> {
    try {
      const { data, error } = await supabase
        .from('level1_practices')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('practice_id');

      if (error) {
        logger.error('Failed to get Level 1 assessment practices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 assessment practices:', error);
      return [];
    }
  }

  /**
   * Update Level 1 practice
   */
  static async updatePractice(practiceId: string, updates: Partial<Level1Practice>): Promise<Level1Practice | null> {
    try {
      const { data, error } = await supabase
        .from('level1_practices')
        .update(updates)
        .eq('id', practiceId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update Level 1 practice:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to update Level 1 practice:', error);
      return null;
    }
  }

  /**
   * Get Level 1 evidence for an assessment
   */
  static async getAssessmentEvidence(assessmentId: string): Promise<Level1Evidence[]> {
    try {
      const { data, error } = await supabase
        .from('level1_evidence')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to get Level 1 assessment evidence:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 assessment evidence:', error);
      return [];
    }
  }

  /**
   * Upload evidence for Level 1 assessment
   */
  static async uploadEvidence(evidence: Partial<Level1Evidence>): Promise<Level1Evidence | null> {
    try {
      const { data, error } = await supabase
        .from('level1_evidence')
        .insert(evidence)
        .select()
        .single();

      if (error) {
        logger.error('Failed to upload Level 1 evidence:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to upload Level 1 evidence:', error);
      return null;
    }
  }

  /**
   * Get Level 1 tasks for an assessment
   */
  static async getAssessmentTasks(assessmentId: string): Promise<Level1Task[]> {
    try {
      const { data, error } = await supabase
        .from('level1_tasks')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to get Level 1 assessment tasks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 assessment tasks:', error);
      return [];
    }
  }

  /**
   * Create Level 1 task
   */
  static async createTask(task: Partial<Level1Task>): Promise<Level1Task | null> {
    try {
      const { data, error } = await supabase
        .from('level1_tasks')
        .insert(task)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create Level 1 task:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to create Level 1 task:', error);
      return null;
    }
  }

  /**
   * Update Level 1 task
   */
  static async updateTask(taskId: string, updates: Partial<Level1Task>): Promise<Level1Task | null> {
    try {
      const { data, error } = await supabase
        .from('level1_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update Level 1 task:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to update Level 1 task:', error);
      return null;
    }
  }

  /**
   * Get Level 1 domain scores for an assessment
   */
  static async getDomainScores(assessmentId: string): Promise<Level1DomainScore[]> {
    try {
      const { data, error } = await supabase
        .from('level1_domain_scores')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('domain');

      if (error) {
        logger.error('Failed to get Level 1 domain scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 domain scores:', error);
      return [];
    }
  }

  /**
   * Update domain scores for Level 1 assessment
   */
  static async updateDomainScores(assessmentId: string, scores: Level1DomainScore[]): Promise<Level1DomainScore[]> {
    try {
      // Delete existing scores
      await supabase
        .from('level1_domain_scores')
        .delete()
        .eq('assessment_id', assessmentId);

      // Insert new scores
      const { data, error } = await supabase
        .from('level1_domain_scores')
        .insert(scores.map(score => ({ ...score, assessment_id: assessmentId })))
        .select();

      if (error) {
        logger.error('Failed to update Level 1 domain scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to update Level 1 domain scores:', error);
      return [];
    }
  }

  /**
   * Get Level 1 compliance summary
   */
  static async getComplianceSummary(assessmentId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('level1_compliance_summary')
        .select('*')
        .eq('assessment_id', assessmentId)
        .single();

      if (error) {
        logger.error('Failed to get Level 1 compliance summary:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to get Level 1 compliance summary:', error);
      return null;
    }
  }

  /**
   * Get Level 1 domain progress
   */
  static async getDomainProgress(assessmentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('level1_domain_progress')
        .select('*')
        .eq('assessment_id', assessmentId);

      if (error) {
        logger.error('Failed to get Level 1 domain progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to get Level 1 domain progress:', error);
      return [];
    }
  }

  /**
   * Initialize Level 1 practices for a new assessment
   */
  static async initializePractices(assessmentId: string): Promise<Level1Practice[]> {
    try {
      // Get default practices from the database
      const { data: defaultPractices, error } = await supabase
        .from('level1_practices')
        .select('practice_id, practice_name, domain, estimated_effort_hours')
        .is('assessment_id', null);

      if (error) {
        logger.error('Failed to get default Level 1 practices:', error);
        return [];
      }

      // Create practices for this assessment
      const practices = defaultPractices.map(practice => ({
        assessment_id: assessmentId,
        practice_id: practice.practice_id,
        practice_name: practice.practice_name,
        domain: practice.domain,
        status: 'not_implemented' as const,
        evidence_required: [],
        evidence_provided: [],
        priority: 'medium' as const,
        estimated_effort_hours: practice.estimated_effort_hours
      }));

      const { data, error: insertError } = await supabase
        .from('level1_practices')
        .insert(practices)
        .select();

      if (insertError) {
        logger.error('Failed to initialize Level 1 practices:', insertError);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to initialize Level 1 practices:', error);
      return [];
    }
  }

  /**
   * Calculate and update domain scores for Level 1 assessment
   */
  static async calculateDomainScores(assessmentId: string): Promise<Level1DomainScore[]> {
    try {
      const practices = await this.getAssessmentPractices(assessmentId);
      
      // Group practices by domain
      const domainGroups = practices.reduce((acc, practice) => {
        if (!acc[practice.domain]) {
          acc[practice.domain] = [];
        }
        acc[practice.domain].push(practice);
        return acc;
      }, {} as Record<string, Level1Practice[]>);

      // Calculate scores for each domain
      const scores: Level1DomainScore[] = Object.entries(domainGroups).map(([domain, domainPractices]) => {
        const totalPractices = domainPractices.length;
        const implementedPractices = domainPractices.filter(p => p.status === 'fully_implemented').length;
        const scorePercentage = totalPractices > 0 ? Math.round((implementedPractices / totalPractices) * 100) : 0;

        return {
          id: '', // Will be set by database
          assessment_id: assessmentId,
          domain: domain as any,
          total_practices: totalPractices,
          implemented_practices: implementedPractices,
          score_percentage: scorePercentage,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
      });

      // Update domain scores
      await this.updateDomainScores(assessmentId, scores);

      return scores;
    } catch (error) {
      logger.error('Failed to calculate Level 1 domain scores:', error);
      return [];
    }
  }

  /**
   * Check if assessment is ready for self-assessment
   */
  static async checkSelfAssessmentReadiness(assessmentId: string): Promise<boolean> {
    try {
      const practices = await this.getAssessmentPractices(assessmentId);
      const totalPractices = practices.length;
      const implementedPractices = practices.filter(p => p.status === 'fully_implemented').length;
      
      // Require at least 80% of practices to be implemented for self-assessment readiness
      const readinessThreshold = 0.8;
      const isReady = totalPractices > 0 && (implementedPractices / totalPractices) >= readinessThreshold;

      // Update assessment readiness status
      await this.updateAssessment(assessmentId, { self_assessment_ready: isReady });

      return isReady;
    } catch (error) {
      logger.error('Failed to check Level 1 self-assessment readiness:', error);
      return false;
    }
  }
}