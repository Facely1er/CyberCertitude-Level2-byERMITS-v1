import { RealTimeComplianceData, ComplianceAlert } from '../features/compliance/types';
import { AssessmentData } from '../shared/types';
import { logger } from '../utils/logger';
import { supabaseApiService } from './supabaseApiService';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ComplianceMetrics {
  overallCompliance: number;
  functionCompliance: Record<string, number>;
  activeGaps: number;
  criticalFindings: number;
  evidenceCollectionProgress: number;
  controlImplementationProgress: number;
  riskTrend: 'improving' | 'stable' | 'declining';
}

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private apiKey: string | null = null;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.apiKey = localStorage.getItem('api-key');
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('API request failed:', error);
      throw error;
    }
  }

  // Compliance Data API
  async getRealTimeComplianceData(): Promise<RealTimeComplianceData> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.getRealTimeComplianceData();
    } catch (error) {
      logger.error('Failed to fetch real-time compliance data:', error);
      throw new Error('Unable to load compliance data. Please check your connection and try again.');
    }
  }

  async getComplianceMetrics(): Promise<ComplianceMetrics> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.getComplianceMetrics();
    } catch (error) {
      logger.error('Failed to fetch compliance metrics:', error);
      throw new Error('Unable to load compliance metrics. Please check your connection and try again.');
    }
  }

  async getComplianceAlerts(): Promise<ComplianceAlert[]> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.getComplianceAlerts();
    } catch (error) {
      logger.error('Failed to fetch compliance alerts:', error);
      throw new Error('Unable to load compliance alerts. Please check your connection and try again.');
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      // Try Supabase integration first
      await supabaseApiService.acknowledgeAlert(alertId);
    } catch (error) {
      logger.error('Failed to acknowledge alert:', error);
      throw error;
    }
  }

  // Assessment API
  async saveAssessment(assessment: AssessmentData): Promise<AssessmentData> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.saveAssessment(assessment);
    } catch (error) {
      logger.error('Failed to save assessment:', error);
      throw error;
    }
  }

  async getAssessments(): Promise<AssessmentData[]> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.getAssessments();
    } catch (error) {
      logger.warn('Failed to fetch assessments from Supabase, using fallback');
      return [];
    }
  }

  // Evidence API
  async uploadEvidence(evidence: FormData): Promise<{ id: string; url: string }> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.uploadEvidence(evidence);
    } catch (error) {
      logger.error('Failed to upload evidence:', error);
      throw error;
    }
  }

  async getEvidence(): Promise<any[]> {
    try {
      // Try Supabase integration first
      return await supabaseApiService.getEvidence();
    } catch (error) {
      logger.warn('Failed to fetch evidence from Supabase, using fallback');
      return [];
    }
  }

  // Authentication API
  async authenticate(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    try {
      // Try Supabase integration first
      const result = await supabaseApiService.authenticate(credentials);
      
      this.apiKey = result.token;
      localStorage.setItem('api-key', result.token);
      
      return result;
    } catch (error) {
      logger.error('Authentication failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Try Supabase integration first
      await supabaseApiService.logout();
    } catch (error) {
      logger.warn('Logout request failed:', error);
    } finally {
      this.apiKey = null;
      localStorage.removeItem('api-key');
    }
  }

  // Fallback data methods for offline/development mode
  // Removed fallback methods - production requires proper data sources
}

export const apiService = ApiService.getInstance();