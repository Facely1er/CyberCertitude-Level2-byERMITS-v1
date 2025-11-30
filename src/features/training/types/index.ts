export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  level: TrainingLevel;
  duration: number; // in minutes
  objectives: string[];
  content: TrainingContent[];
  assessments: TrainingAssessment[];
  prerequisites: string[];
  targetAudience: string[];
  cmmcPractices: string[];
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'published' | 'archived';
  version: string;
  author: string;
  tags: string[];
}

export type TrainingCategory = 
  | 'CMMC Compliance'
  | 'Security Awareness'
  | 'Technical Training'
  | 'Policy Training'
  | 'Incident Response'
  | 'Data Protection'
  | 'Access Control'
  | 'Risk Management';

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface TrainingContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'document';
  title: string;
  content: string;
  duration: number; // in minutes
  order: number;
  resources?: TrainingResource[];
}

interface TrainingResource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  description?: string;
}

export interface TrainingAssessment {
  id: string;
  title: string;
  questions: TrainingQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  attempts: number;
  order: number;
}

export interface TrainingQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress: number; // percentage
  currentContentId?: string;
  startDate?: Date;
  completionDate?: Date;
  lastAccessed: Date;
  scores: TrainingScore[];
  timeSpent: number; // in minutes
}

interface TrainingScore {
  assessmentId: string;
  score: number;
  maxScore: number;
  attempts: number;
  passed: boolean;
  completedDate: Date;
}

export interface AwarenessCampaign {
  id: string;
  title: string;
  description: string;
  type: CampaignType;
  targetAudience: string[];
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  content: CampaignContent[];
  metrics: CampaignMetrics;
  createdDate: Date;
  lastUpdated: Date;
  owner: string;
  budget?: number;
  tags: string[];
}

export type CampaignType = 
  | 'Email Campaign'
  | 'Workshop'
  | 'Webinar'
  | 'Poster Campaign'
  | 'Video Series'
  | 'Interactive Training'
  | 'Gamification'
  | 'Newsletter';

export interface CampaignContent {
  id: string;
  type: 'email' | 'poster' | 'video' | 'webinar' | 'workshop' | 'newsletter';
  title: string;
  content: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'published';
  targetAudience: string[];
  resources: CampaignResource[];
}

interface CampaignResource {
  id: string;
  name: string;
  type: 'template' | 'image' | 'video' | 'document' | 'link';
  url: string;
  description?: string;
}

export interface CampaignMetrics {
  totalSent: number;
  openRate: number;
  clickRate: number;
  completionRate: number;
  engagementRate: number;
  feedback: CampaignFeedback[];
}

export interface CampaignFeedback {
  id: string;
  userId: string;
  rating: number; // 1-5
  comments: string;
  date: Date;
  helpful: boolean;
}