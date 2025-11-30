import { supabase } from '../lib/supabase';
import { Level1Assessment, Level1Practice, Level1Evidence, Level1Task, Level1DomainScore } from './level1DataService';
import { logger } from '../utils/logger';

export class Level1ApiService {
  private static instance: Level1ApiService;

  static getInstance(): Level1ApiService {
    if (!Level1ApiService.instance) {
      Level1ApiService.instance = new Level1ApiService();
    }
    return Level1ApiService.instance;
  }

  /**
   * Check if Level 1 API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      logger.error('Level 1 API not available:', error);
      return false;
    }
  }

  /**
   * Get Level 1 assessments from API
   */
  async getAssessments(userId: string): Promise<Level1Assessment[]> {
    try {
      const { data, error } = await supabase
        .from('level1_assessments')
        .select(`
          *,
          level1_organizations(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch Level 1 assessments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 assessments:', error);
      return [];
    }
  }

  /**
   * Create Level 1 assessment via API
   */
  async createAssessment(assessment: Partial<Level1Assessment>): Promise<Level1Assessment | null> {
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
   * Update Level 1 assessment via API
   */
  async updateAssessment(assessmentId: string, updates: Partial<Level1Assessment>): Promise<Level1Assessment | null> {
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
   * Get Level 1 practices for assessment
   */
  async getPractices(assessmentId: string): Promise<Level1Practice[]> {
    try {
      const { data, error } = await supabase
        .from('level1_practices')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('practice_id');

      if (error) {
        logger.error('Failed to fetch Level 1 practices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 practices:', error);
      return [];
    }
  }

  /**
   * Update Level 1 practice via API
   */
  async updatePractice(practiceId: string, updates: Partial<Level1Practice>): Promise<Level1Practice | null> {
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
   * Get Level 1 evidence for assessment
   */
  async getEvidence(assessmentId: string): Promise<Level1Evidence[]> {
    try {
      const { data, error } = await supabase
        .from('level1_evidence')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch Level 1 evidence:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 evidence:', error);
      return [];
    }
  }

  /**
   * Upload Level 1 evidence via API
   */
  async uploadEvidence(evidence: Partial<Level1Evidence>): Promise<Level1Evidence | null> {
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
   * Get Level 1 tasks for assessment
   */
  async getTasks(assessmentId: string): Promise<Level1Task[]> {
    try {
      const { data, error } = await supabase
        .from('level1_tasks')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch Level 1 tasks:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 tasks:', error);
      return [];
    }
  }

  /**
   * Create Level 1 task via API
   */
  async createTask(task: Partial<Level1Task>): Promise<Level1Task | null> {
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
   * Update Level 1 task via API
   */
  async updateTask(taskId: string, updates: Partial<Level1Task>): Promise<Level1Task | null> {
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
   * Get Level 1 domain scores for assessment
   */
  async getDomainScores(assessmentId: string): Promise<Level1DomainScore[]> {
    try {
      const { data, error } = await supabase
        .from('level1_domain_scores')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('domain');

      if (error) {
        logger.error('Failed to fetch Level 1 domain scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 domain scores:', error);
      return [];
    }
  }

  /**
   * Update Level 1 domain scores via API
   */
  async updateDomainScores(assessmentId: string, scores: Level1DomainScore[]): Promise<Level1DomainScore[]> {
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
  async getComplianceSummary(assessmentId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('level1_compliance_summary')
        .select('*')
        .eq('assessment_id', assessmentId)
        .single();

      if (error) {
        logger.error('Failed to fetch Level 1 compliance summary:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to fetch Level 1 compliance summary:', error);
      return null;
    }
  }

  /**
   * Get Level 1 domain progress
   */
  async getDomainProgress(assessmentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('level1_domain_progress')
        .select('*')
        .eq('assessment_id', assessmentId);

      if (error) {
        logger.error('Failed to fetch Level 1 domain progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch Level 1 domain progress:', error);
      return [];
    }
  }

  /**
   * Initialize Level 1 practices for assessment
   */
  async initializePractices(assessmentId: string): Promise<Level1Practice[]> {
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
   * Calculate and update domain scores
   */
  async calculateDomainScores(assessmentId: string): Promise<Level1DomainScore[]> {
    try {
      const practices = await this.getPractices(assessmentId);
      
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
   * Check self-assessment readiness
   */
  async checkSelfAssessmentReadiness(assessmentId: string): Promise<boolean> {
    try {
      const practices = await this.getPractices(assessmentId);
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

  /**
   * Upload file to Level 1 evidence storage
   */
  async uploadFile(file: File, assessmentId: string, practiceId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${assessmentId}/${practiceId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('cmmc-level1-evidence')
        .upload(filePath, file);

      if (error) {
        logger.error('Failed to upload file:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cmmc-level1-evidence')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      logger.error('Failed to upload file:', error);
      return null;
    }
  }

  /**
   * Delete Level 1 evidence
   */
  async deleteEvidence(evidenceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('level1_evidence')
        .delete()
        .eq('id', evidenceId);

      if (error) {
        logger.error('Failed to delete Level 1 evidence:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Failed to delete Level 1 evidence:', error);
      return false;
    }
  }

  /**
   * Get Level 1 analytics data
   */
  async getAnalytics(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('level1_compliance_summary')
        .select('*')
        .in('assessment_id', 
          supabase
            .from('level1_assessments')
            .select('id')
            .eq('user_id', userId)
        );

      if (error) {
        logger.error('Failed to fetch Level 1 analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Failed to fetch Level 1 analytics:', error);
      return null;
    }
  }
}

export const level1ApiService = Level1ApiService.getInstance();