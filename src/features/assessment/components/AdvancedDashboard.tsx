import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Upload, 
  ChartBar as BarChart3, 
  Clock, 
  CircleCheck as CheckCircle, 
  CircleAlert as AlertCircle, 
  TrendingUp, 
  FileText, 
  Shield, 
  Target, 
  Eye, 
  Trash2, 
  CreditCard as Edit3, 
  Activity, 
  Star, 
  Flag, 
  ChartPie as PieChartIcon, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  Award, 
  Zap, 
  Building, 
  ScrollText, 
  ArrowRight, 
  Lightbulb, 
  ExternalLink, 
  TriangleAlert as AlertTriangle, 
  Database 
} from 'lucide-react';

import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { QuickNavigationPanel, RelatedLinks, InternalLinkCard } from '@/shared/components/ui';
import { useInternalLinking } from '@/shared/hooks';
import { AssessmentData, UserProfile } from '@/shared/types';
import { getFramework, cmmcFramework } from '@/data/frameworks';
import { PieChart, RadarChart, BarChart } from '@/shared/components/charts';
import { dataService } from '@/services/dataService';

interface AdvancedDashboardProps {
  savedAssessments: AssessmentData[];
  onStartAssessment: () => void;
  onLoadAssessment: (assessment: AssessmentData) => void;
  onDeleteAssessment: (assessmentId: string) => void;
  onGenerateReport: (assessment: AssessmentData) => void;
  onExportAssessment: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => void;
  onImportAssessment: (file: File) => void;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({
  savedAssessments,
  onStartAssessment,
  onLoadAssessment,
  onDeleteAssessment,
  onGenerateReport,
  onExportAssessment,
  onImportAssessment: _onImportAssessment,
  userProfile,
  addNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name' | 'progress'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  
  // Internal linking hooks
  const { contextualLinks, breadcrumbs } = useInternalLinking();
  const navigate = useNavigate();

  const calculateAssessmentScore = (assessment: AssessmentData) => {
    const responses = Object.values(assessment.responses);
    if (responses.length === 0) return 0;
    return Math.round((responses.reduce((a, b) => a + b, 0) / responses.length) * 25);
  };

  // Generate recommendations based on function name and gap
  const generateRecommendation = (functionName: string, _gap: number): string => {
    const recommendations: Record<string, string> = {
      'Access Control': 'Implement multi-factor authentication and role-based access controls',
      'Asset Management': 'Deploy automated asset discovery and maintain comprehensive inventory',
      'Audit and Accountability': 'Enhance logging capabilities and implement continuous monitoring',
      'Awareness and Training': 'Develop comprehensive security awareness program',
      'Configuration Management': 'Implement change control processes and baseline configurations',
      'Identification and Authentication': 'Deploy identity management systems and authentication policies',
      'Incident Response': 'Establish formal incident response procedures and team',
      'Maintenance': 'Implement patch management and system maintenance procedures',
      'Media Protection': 'Establish data handling and media sanitization procedures',
      'Personnel Security': 'Implement background screening and access management',
      'Physical Protection': 'Enhance physical access controls and environmental protections',
      'Recovery': 'Develop business continuity and disaster recovery capabilities',
      'Risk Assessment': 'Conduct regular risk assessments and vulnerability management',
      'Security Assessment': 'Implement continuous security testing and validation',
      'System and Communications Protection': 'Deploy network security and encryption controls',
      'System and Information Integrity': 'Implement malware protection and integrity monitoring',
      'Supply Chain Risk Management': 'Establish vendor risk management program'
    };
    
    return recommendations[functionName] || 'Implement comprehensive security controls and procedures';
  };

  // Calculate CMMC-specific metrics from latest assessment
  const cmmcMetrics = useMemo(() => {
    if (!savedAssessments || savedAssessments.length === 0) {
      return {
        implementedControls: 0,
        totalControls: 110,
        gaps: 110,
        overallScore: 0,
        domainCompliance: [],
        statusDistribution: [
          { status: 'Not Implemented', count: 0, value: 0 },
          { status: 'Partially Implemented', count: 0, value: 1 },
          { status: 'Largely Implemented', count: 0, value: 2 },
          { status: 'Fully Implemented', count: 0, value: 3 }
        ]
      };
    }

    // Get the latest CMMC assessment
    const latestAssessment = savedAssessments
      .filter(a => a.frameworkId === 'cmmc')
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())[0];

    if (!latestAssessment) {
      return {
        implementedControls: 0,
        totalControls: 110,
        gaps: 110,
        overallScore: 0,
        domainCompliance: [],
        statusDistribution: [
          { status: 'Not Implemented', count: 0, value: 0 },
          { status: 'Partially Implemented', count: 0, value: 1 },
          { status: 'Largely Implemented', count: 0, value: 2 },
          { status: 'Fully Implemented', count: 0, value: 3 }
        ]
      };
    }

    const responses = latestAssessment.responses;
    
    // Count implemented controls (score of 3) and calculate gaps
    const implementedControls = Object.values(responses).filter(score => score === 3).length;
    const gaps = Object.values(responses).filter(score => score < 3).length;
    const totalControls = 110; // CMMC 2.0 Level 2 has 110 controls
    
    // Calculate overall score
    const responseValues = Object.values(responses);
    const overallScore = responseValues.length > 0 
      ? Math.round((responseValues.reduce((sum, score) => sum + score, 0) / responseValues.length) * 25)
      : 0;

    // Calculate domain compliance scores
    const domainCompliance = cmmcFramework.sections.map(section => {
      const sectionQuestions = section.categories.reduce((questions, category) => {
        return [...questions, ...category.questions];
      }, [] as any[]);
      
      const sectionResponses = sectionQuestions
        .map(q => responses[q.id])
        .filter(r => r !== undefined);
      
      const sectionScore = sectionResponses.length > 0
        ? Math.round((sectionResponses.reduce((sum, value) => sum + value, 0) / sectionResponses.length) * 25)
        : 0;

      return {
        domain: section.name,
        score: sectionScore,
        implemented: sectionResponses.filter(r => r === 3).length,
        total: sectionQuestions.length
      };
    });

    // Calculate status distribution
    const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    Object.values(responses).forEach(score => {
      statusCounts[score as keyof typeof statusCounts]++;
    });

    const statusDistribution = [
      { status: 'Not Implemented', count: statusCounts[0], value: 0 },
      { status: 'Partially Implemented', count: statusCounts[1], value: 1 },
      { status: 'Largely Implemented', count: statusCounts[2], value: 2 },
      { status: 'Fully Implemented', count: statusCounts[3], value: 3 }
    ];

    return {
      implementedControls,
      totalControls,
      gaps,
      overallScore,
      domainCompliance,
      statusDistribution
    };
  }, [savedAssessments]);

  // Calculate function-level scores from latest assessment
  const functionAnalysis = useMemo(() => {
    if (!savedAssessments || savedAssessments.length === 0) return [];

    // Get the most recent assessment
    const latestAssessment = savedAssessments.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )[0];

    if (!latestAssessment) return [];

    const framework = getFramework(latestAssessment.frameworkId);
    
    if (!framework) return [];
    
    return framework.sections.map(section => {
      const sectionQuestions = section.categories.reduce((questions, category) => {
        return [...questions, ...category.questions];
      }, [] as any[]);
      
      const sectionResponses = sectionQuestions
        .map(q => latestAssessment.responses[q.id])
        .filter(r => r !== undefined);
      
      const sectionScore = sectionResponses.length > 0
        ? Math.round((sectionResponses.reduce((sum, value) => sum + value, 0) / sectionResponses.length) * 25)
        : 0;

      return {
        name: section.name,
        score: sectionScore,
        answered: sectionResponses.length,
        total: sectionQuestions.length,
        completionRate: Math.round((sectionResponses.length / sectionQuestions.length) * 100),
        gap: Math.max(0, 75 - sectionScore), // Gap from target of 75%
        priority: sectionScore < 50 ? 'critical' : sectionScore < 65 ? 'high' : sectionScore < 75 ? 'medium' : 'low',
        assessmentId: latestAssessment.id
      };
    });
  }, [savedAssessments]);

  // Calculate top gaps for remediation focus
  const topGaps = useMemo(() => {
    return functionAnalysis
      .filter(func => func.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5);
  }, [functionAnalysis]);

  // Generate smart recommendations based on gaps
  const smartRecommendations = useMemo(() => {
    return topGaps.map(gap => ({
      function: gap.name,
      priority: gap.priority,
      recommendation: generateRecommendation(gap.name, gap.gap),
      effort: gap.gap > 30 ? 'high' : gap.gap > 15 ? 'medium' : 'low',
      timeframe: gap.gap > 30 ? '6-12 months' : gap.gap > 15 ? '3-6 months' : '1-3 months',
      impact: `+${Math.min(gap.gap, 25)}% improvement`
    }));
  }, [topGaps]);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!savedAssessments) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        avgScore: 0,
        riskDistribution: {},
        totalTimeSpent: 0,
        recentAssessments: 0,
        recentCompletions: 0
      };
    }
    
    const total = savedAssessments.length;
    const completed = savedAssessments.filter(a => a.isComplete).length;
    const inProgress = total - completed;
    const avgScore = savedAssessments.length > 0 
      ? Math.round(savedAssessments.reduce((sum, assessment) => {
          const responses = Object.values(assessment.responses);
          const score = responses.length > 0 
            ? (responses.reduce((a, b) => a + b, 0) / responses.length) * 25
            : 0;
          return sum + score;
        }, 0) / savedAssessments.length)
      : 0;

    // Risk analysis
    const riskDistribution = savedAssessments.reduce((acc, assessment) => {
      const score = calculateAssessmentScore(assessment);
      const risk = score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'critical';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Time analysis
    const totalTimeSpent = savedAssessments.reduce((sum, assessment) => sum + (assessment.timeSpent || 0), 0);

    // Recent activity
    const recentAssessments = savedAssessments
      .filter(a => {
        const daysSinceModified = (new Date().getTime() - new Date(a.lastModified).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceModified <= 7;
      }).length;

    // Completion trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = savedAssessments.filter(a => 
      a.isComplete && new Date(a.lastModified) >= thirtyDaysAgo
    ).length;

    return { 
      total, 
      completed, 
      inProgress, 
      avgScore, 
      riskDistribution, 
      totalTimeSpent,
      recentAssessments,
      recentCompletions
    };
  }, [savedAssessments]);

  // Filter and sort assessments
  const filteredAndSortedAssessments = useMemo(() => {
    if (!savedAssessments || !Array.isArray(savedAssessments)) return [];
    
    const filtered = savedAssessments.filter(assessment => {
      // Defensive checks
      if (!assessment || typeof assessment !== 'object') {
        return false;
      }
      
      const frameworkName = assessment.frameworkName || '';
      const orgName = assessment.organizationInfo?.name || '';
      
      const matchesSearch = frameworkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           orgName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && assessment.isComplete) ||
                           (filterStatus === 'inProgress' && !assessment.isComplete);
      
      const score = calculateAssessmentScore(assessment);
      const risk = score >= 80 ? 'low' : score >= 60 ? 'medium' : score >= 40 ? 'high' : 'critical';
      const matchesRisk = filterRisk === 'all' || risk === filterRisk;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });

    // Sort assessments
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          comparison = bTime - aTime;
          break;
        case 'score':
          comparison = calculateAssessmentScore(b) - calculateAssessmentScore(a);
          break;
        case 'name':
          comparison = (a.frameworkName || '').localeCompare(b.frameworkName || '');
          break;
        case 'progress':
          const progressA = a.responses ? Object.keys(a.responses).length : 0;
          const progressB = b.responses ? Object.keys(b.responses).length : 0;
          comparison = progressB - progressA;
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [savedAssessments, searchTerm, filterStatus, filterRisk, sortBy, sortOrder]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        addNotification('error', 'Please select a valid JSON backup file');
        return;
      }
      
      // Read and import file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Import using data service
          if (importedData.backupDate || importedData.backupId) {
            dataService.restoreFromBackup(e.target?.result as string);
          } else {
            dataService.importAllData(importedData);
          }
          
          addNotification('success', 'Backup restored successfully');
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          addNotification('error', `Failed to restore backup: ${(error as Error).message}`);
        }
      };
      
      reader.onerror = () => {
        addNotification('error', 'Failed to read backup file');
      };
      
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  const handleBulkAction = (action: 'delete' | 'export') => {
    if (selectedAssessments.length === 0 || !savedAssessments) return;
    
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedAssessments.length} selected assessments?`)) {
        selectedAssessments.forEach(id => onDeleteAssessment(id));
        setSelectedAssessments([]);
      }
    } else if (action === 'export') {
      selectedAssessments.forEach(id => {
        const assessment = savedAssessments.find(a => a.id === id);
        if (assessment) {
          onExportAssessment(assessment, 'json');
        }
      });
    }
  };

  const toggleAssessmentSelection = (assessmentId: string) => {
    setSelectedAssessments(prev => 
      prev.includes(assessmentId)
        ? prev.filter(id => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Enhanced Welcome Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-responsive-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              {userProfile ? `Welcome back, ${userProfile.name}` : 'CMMC 2.0 Cybersecurity Compliance'}
            </h1>
            <p className="text-responsive-md text-gray-600 dark:text-gray-300">
              {userProfile 
                ? `Manage CMMC 2.0 compliance for ${userProfile.organization}`
                : 'Comprehensive CMMC 2.0 certification readiness platform'
              }
            </p>
            {userProfile && (
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>{userProfile?.role || 'User'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>Last login: {userProfile?.lastLogin?.toLocaleDateString() || 'Today'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{stats.totalTimeSpent || 0} min total</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            {dataService.isDemoDataLoaded() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Demo Mode</span>
              </div>
            )}
            <label htmlFor="import-backup-input" className="btn-secondary px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center space-x-2 shadow-sm hover:shadow-md">
              <Upload className="w-4 h-4" />
              <span className="font-medium">Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                id="import-backup-input"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* CMMC 2.0 Overall Score Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  CMMC 2.0 Level 2 Readiness
                </h2>
                <p className="text-blue-700 dark:text-blue-300">
                  Overall implementation progress for Military contractor certification
                </p>
              </div>
            </div>
            
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              {cmmcMetrics.overallScore}%
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="card-standard p-6">
                <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                  {cmmcMetrics.implementedControls}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Implemented Controls / 110
                </div>
                <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2 mt-3">
                  <div
                    className="bg-success-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(cmmcMetrics.implementedControls / 110) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="card-standard p-6">
                <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">
                  {cmmcMetrics.gaps}
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Implementation Gaps
                </div>
                <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2 mt-3">
                  <div
                    className="bg-warning-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(cmmcMetrics.gaps / 110) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="card-standard p-6">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  Level 2
                </div>
                <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  CMMC 2.0 Target Level
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                  CUI Protection Required
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CMMC 2.0 Analytics Section */}
        {savedAssessments && savedAssessments.some(a => a.frameworkId === 'cmmc') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Domain Compliance Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  CMMC 2.0 Domain Compliance
                </h3>
              </div>
              <div className="h-80">
                <BarChart
                  data={{
                    labels: cmmcMetrics.domainCompliance.map(domain => 
                      domain.domain.length > 15 ? domain.domain.substring(0, 15) + '...' : domain.domain
                    ),
                    datasets: [{
                      label: 'Compliance Score (%)',
                      data: cmmcMetrics.domainCompliance.map(domain => domain.score),
                      backgroundColor: cmmcMetrics.domainCompliance.map(domain => {
                        if (domain.score >= 75) return 'rgba(34, 197, 94, 0.8)'; // Green
                        if (domain.score >= 50) return 'rgba(234, 179, 8, 0.8)'; // Yellow
                        if (domain.score >= 25) return 'rgba(249, 115, 22, 0.8)'; // Orange
                        return 'rgba(239, 68, 68, 0.8)'; // Red
                      }),
                      borderColor: cmmcMetrics.domainCompliance.map(domain => {
                        if (domain.score >= 75) return 'rgba(34, 197, 94, 1)';
                        if (domain.score >= 50) return 'rgba(234, 179, 8, 1)';
                        if (domain.score >= 25) return 'rgba(249, 115, 22, 1)';
                        return 'rgba(239, 68, 68, 1)';
                      }),
                      borderWidth: 2
                    }]
                  }}
                  title="Compliance by CMMC 2.0 Domain"
                  height={320}
                  showLegend={false}
                />
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                14 CMMC 2.0 domains • Target: 75% for C3PAO readiness
              </div>
            </div>

            {/* Implementation Status Distribution Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Implementation Status Distribution
                </h3>
              </div>
              <div className="h-80">
                <PieChart
                  labels={cmmcMetrics.statusDistribution.map(status => status.status)}
                  data={cmmcMetrics.statusDistribution.map(status => status.count)}
                  backgroundColor={[
                    'rgba(239, 68, 68, 0.8)',   // Not Implemented - Red
                    'rgba(249, 115, 22, 0.8)',  // Partially - Orange
                    'rgba(234, 179, 8, 0.8)',   // Largely - Yellow
                    'rgba(34, 197, 94, 0.8)',   // Fully - Green
                  ]}
                  className="h-full"
                  title="Control Implementation Status"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {cmmcMetrics.statusDistribution.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{status.status}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{status.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Enhanced CMMC Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Implemented Controls</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {cmmcMetrics.implementedControls}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  of 110 CMMC controls
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Implementation Gaps</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {cmmcMetrics.gaps}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  controls need attention
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Assessments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {stats.total}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    {stats.recentAssessments} this week
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CMMC Readiness</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {cmmcMetrics.overallScore}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  C3PAO assessment ready
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Risk Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <PieChartIcon className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
              Risk Distribution
            </h3>
            <div className="h-64">
              <PieChart
                labels={Object.keys(stats.riskDistribution).map(risk => `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`)}
                data={Object.values(stats.riskDistribution)}
                backgroundColor={[
                  'rgba(239, 68, 68, 0.8)',   // Critical - Red
                  'rgba(249, 115, 22, 0.8)',  // High - Orange
                  'rgba(234, 179, 8, 0.8)',   // Medium - Yellow
                  'rgba(34, 197, 94, 0.8)',   // Low - Green
                ]}
                className="h-full"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Assessments: {stats.total}
              </p>
            </div>
          </div>

          {/* Risk Distribution Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {Object.entries(stats.riskDistribution).map(([risk, count]) => (
              <div key={risk} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {risk} Risk
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform">
                      {count}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}% of total
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${
                    risk === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                    risk === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    risk === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {risk === 'critical' ? <AlertCircle className="w-6 h-6 text-red-600" /> :
                     risk === 'high' ? <AlertCircle className="w-6 h-6 text-orange-600" /> :
                     risk === 'medium' ? <Info className="w-6 h-6 text-yellow-600" /> :
                     <CheckCircle className="w-6 h-6 text-green-600" />}
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      risk === 'critical' ? 'bg-red-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - NIST CSF v2.0 Focused */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              CMMC Certification Readiness Journey
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Complete CMMC 2.0 Level 2 certification workflow from initial assessment to C3PAO evaluation readiness
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={onStartAssessment}
              className="p-6 border-2 border-dashed border-red-300 dark:border-red-600 rounded-xl hover:border-red-500 dark:hover:border-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all duration-300 text-left group hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl group-hover:from-red-200 group-hover:to-orange-300 dark:group-hover:from-red-800/50 dark:group-hover:to-orange-700/50 transition-all duration-300 group-hover:scale-110">
                  <Building className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    CMMC 2.0 Level 2
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {cmmcFramework?.estimatedTime || 240} minutes • {cmmcFramework?.sections?.reduce((sum, section) => 
                      sum + section.categories.reduce((catSum, category) => 
                        catSum + category.questions.length, 0), 0) || 110} controls
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">

                Complete CMMC 2.0 Level 2 assessment with all 110 controls for Government contractors handling Controlled Unclassified Information (CUI).
              </p>
            </button>
            
            <Link
              to="/policies"
              className="p-6 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl hover:border-purple-500 dark:hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 text-left group hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl group-hover:from-purple-200 group-hover:to-purple-300 dark:group-hover:from-purple-800/50 dark:group-hover:to-purple-700/50 transition-all duration-300 group-hover:scale-110">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    CMMC Policy Templates
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    14 domains • Policy templates • SSP components
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Complete CMMC policy template library for all 14 domains with System Security Plan (SSP) components.
              </p>
            </Link>
            
            <Link
              to="/compliance-workflow"
              className="p-6 border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 text-left group hover:shadow-lg hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl group-hover:from-green-200 group-hover:to-green-300 dark:group-hover:from-green-800/50 dark:group-hover:to-green-700/50 transition-all duration-300 group-hover:scale-110">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    CMMC Implementation Workflow
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    Complete workflow • 4 phases • Structured roadmap
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Complete CMMC implementation workflow with detailed phases, activities, and C3PAO assessment preparation.
              </p>
            </Link>
          </div>
        </div>

        {/* Enhanced Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search CMMC and cybersecurity assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="inProgress">In Progress</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAssessments.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {selectedAssessments.length} assessment(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Export Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedAssessments([])}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assessments Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                 Complete Compliance Implementation System
                </h2>
              </div>
              {filteredAndSortedAssessments.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.completed} completed • {stats.inProgress} in progress
                </div>
              )}
            </div>
          </div>
          
          {filteredAndSortedAssessments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full"></div>
                </div>
                <Shield className="w-16 h-16 text-gray-400 mx-auto relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {(!savedAssessments || savedAssessments.length === 0) ? 'No Assessments Yet' : 'No Matching Assessments'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                {(!savedAssessments || savedAssessments.length === 0) 
                  ? 'Start your first cybersecurity assessment to begin compliance journey'
                  : 'Try adjusting your search or filter criteria'
                } Follow structured implementation workflows for CMMC 2.0 Level 2, Privacy Framework, and NIST CSF v2.0 compliance
              </p>
              {(!savedAssessments || savedAssessments.length === 0) && (
               <Link
                 to="/compliance-workflow"
                 className="p-6 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 text-left group hover:shadow-lg hover:scale-105"
               >
                 <div className="flex items-center space-x-4 mb-4">
                   <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-300 dark:group-hover:from-blue-800/50 dark:group-hover:to-indigo-700/50 transition-all duration-300 group-hover:scale-110">
                     <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                       Implementation Workflow
                     </h3>
                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                       Multi-framework • 4 phases • Structured roadmap
                     </p>
                   </div>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                   Complete implementation roadmap with detailed phases, activities, deliverables, and timelines for CMMC, Privacy, and NIST CSF compliance.
                 </p>
               </Link>
               )}
               
                <button
                  onClick={onStartAssessment}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Start CMMC Assessment</span>
                </button>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedAssessments.map((assessment) => {
                const framework = getFramework(assessment.frameworkId);
                if (!framework) return null;
                
                const score = calculateAssessmentScore(assessment);
                const progress = Object.keys(assessment.responses).length;
                const totalQuestions = framework.sections.reduce((sum, section) => 
                  sum + section.categories.reduce((catSum, category) => 
                    catSum + category.questions.length, 0), 0);

                return (
                  <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAssessments.includes(assessment.id)}
                          onChange={() => toggleAssessmentSelection(assessment.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {assessment.frameworkName}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.isComplete
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {assessment.isComplete ? 'Complete' : 'In Progress'}
                      </span>
                    </div>
                    
                    {assessment.organizationInfo?.name && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {assessment.organizationInfo.name}
                      </p>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {progress}/{totalQuestions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Risk Level</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(score)}`}>
                          {score >= 80 ? 'Low' : score >= 60 ? 'Medium' : score >= 40 ? 'High' : 'Critical'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(progress / totalQuestions) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>{new Date(assessment.lastModified).toLocaleDateString()}</span>
                      {assessment.timeSpent && (
                        <span>{assessment.timeSpent} min</span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onLoadAssessment(assessment)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => onGenerateReport(assessment)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Report
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(assessment.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Assessment
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to delete this cybersecurity assessment? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteAssessment(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Function Performance Analysis - Show only if assessments exist */}
        {savedAssessments && savedAssessments.length > 0 && functionAnalysis.length > 0 && (
          <>
            {/* Radar Chart and Function Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Radar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                  CMMC Domain Performance
                </h3>
                <div className="h-80">
                  <RadarChart
                    sectionScores={functionAnalysis.map(func => ({
                      name: func.name.length > 15 ? func.name.substring(0, 15) + '...' : func.name,
                      score: func.score
                    }))}
                    className="h-full"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 text-center">
                  Current implementation vs. target (75%)
                </p>
              </div>

              {/* Function Scores Bar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                  Domain Implementation Progress
                </h3>
                <div className="h-80">
                  <BarChart
                    data={{
                      labels: functionAnalysis.map(func => func.name.length > 12 ? func.name.substring(0, 12) + '...' : func.name),
                      datasets: [
                        {
                          label: 'Current Score',
                          data: functionAnalysis.map(func => func.score),
                          backgroundColor: functionAnalysis.map(func => 
                            func.score >= 75 ? 'rgba(34, 197, 94, 0.8)' :
                            func.score >= 50 ? 'rgba(234, 179, 8, 0.8)' :
                            func.score >= 25 ? 'rgba(249, 115, 22, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                          ),
                          borderColor: functionAnalysis.map(func => 
                            func.score >= 75 ? 'rgba(34, 197, 94, 1)' :
                            func.score >= 50 ? 'rgba(234, 179, 8, 1)' :
                            func.score >= 25 ? 'rgba(249, 115, 22, 1)' : 'rgba(239, 68, 68, 1)'
                          ),
                          borderWidth: 2
                        }
                      ]
                    }}
                    height={320}
                    showLegend={false}
                  />
                </div>
              </div>
            </div>

            {/* Gap Analysis Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      CMMC Gap Analysis & Remediation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Priority areas requiring immediate attention for certification readiness
                    </p>
                  </div>
                </div>
                
                <Link
                  to="/reports/compliance"
                  className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Target className="w-5 h-5" />
                  <span>Detailed Gap Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {topGaps.length > 0 ? (
                <>
                  {/* Gap Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {topGaps.filter(gap => gap.priority === 'critical').length}
                      </div>
                      <div className="text-sm font-medium text-red-800 dark:text-red-300">Critical Gaps</div>
                    </div>
                    
                    <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {Math.round(topGaps.reduce((sum, gap) => sum + gap.gap, 0) / topGaps.length)}%
                      </div>
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-300">Average Gap</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {(() => {
                          if (smartRecommendations.length === 0) return 0;
                          const months = smartRecommendations.map(rec => {
                            const match = rec.timeframe?.match(/(\d+)/);
                            return match ? parseInt(match[1]) : 0;
                          }).filter(month => month > 0);
                          return months.length > 0 ? Math.min(...months) : 0;
                        })()}
                      </div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Months to Target</div>
                    </div>
                  </div>

                  {/* Top Priority Gaps */}
                  <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Flag className="w-5 h-5 mr-2 text-red-500" />
                      Top Priority Gaps Requiring Attention
                    </h3>
                    
                    {topGaps.slice(0, 3).map((gap, index) => (
                      <div key={gap.name} className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20 hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {gap.name}
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  gap.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                  gap.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {gap.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <span className="text-sm text-orange-700 dark:text-orange-300">Current Score:</span>
                                  <div className="font-bold text-orange-900 dark:text-orange-100">{gap.score}%</div>
                                </div>
                                <div>
                                  <span className="text-sm text-orange-700 dark:text-orange-300">Gap to Target:</span>
                                  <div className="font-bold text-red-600 dark:text-red-400">{gap.gap}%</div>
                                </div>
                                <div>
                                  <span className="text-sm text-orange-700 dark:text-orange-300">Completion:</span>
                                  <div className="font-bold text-orange-900 dark:text-orange-100">{gap.completionRate}%</div>
                                </div>
                                <div>
                                  <span className="text-sm text-orange-700 dark:text-orange-300">Questions:</span>
                                  <div className="font-bold text-orange-900 dark:text-orange-100">{gap.answered}/{gap.total}</div>
                                </div>
                              </div>
                              
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                <div
                                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
                                  style={{ width: `${gap.score}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                              {gap.gap}%
                            </div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">Gap</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => gap.assessmentId && navigate(`/assessment/${gap.assessmentId}`)}
                            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                            disabled={!gap.assessmentId}
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Complete Assessment</span>
                          </button>
                          
                          <div className="flex items-center space-x-4 text-sm text-orange-700 dark:text-orange-300">
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>Target: 75%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Need: +{gap.gap}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Smart Recommendations */}
                  {smartRecommendations.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800 mb-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <div>
                          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            Smart Remediation Recommendations
                          </h3>
                          <p className="text-blue-700 dark:text-blue-300">
                            AI-powered suggestions based on your assessment results
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {smartRecommendations.slice(0, 4).map((rec, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {rec.function}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rec.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                rec.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                              }`}>
                                {rec.priority}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                              {rec.recommendation}
                            </p>
                            
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{rec.timeframe}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Timeline</div>
                              </div>
                              <div className="text-center">
                                <div className={`text-lg font-bold ${
                                  rec.effort === 'high' ? 'text-red-600 dark:text-red-400' :
                                  rec.effort === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-green-600 dark:text-green-400'
                                }`}>
                                  {rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Effort</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">{rec.impact}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Impact</div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Link
                                to="/compliance-workflow"
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                              >
                                View Workflow
                              </Link>
                              <Link
                                to="/evidence"
                                className="flex-1 border border-blue-600 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium text-center"
                              >
                                Collect Evidence
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mt-6">
                        <Link
                          to="/reports/compliance"
                          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                          <BarChart3 className="w-5 h-5" />
                          <span>Complete Gap Analysis Report</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Function Performance Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Award className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
                      Detailed CMMC Domain Performance
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              CMMC Domain
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Score
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Gap to 75%
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {functionAnalysis.map((func, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="py-4 px-4">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {func.name}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`text-lg font-bold ${
                                  func.score >= 75 ? 'text-green-600 dark:text-green-400' :
                                  func.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                  func.score >= 25 ? 'text-orange-600 dark:text-orange-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {func.score}%
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {func.answered}/{func.total}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {func.completionRate}%
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`font-bold ${
                                  func.gap === 0 ? 'text-green-600 dark:text-green-400' :
                                  func.gap <= 10 ? 'text-yellow-600 dark:text-yellow-400' :
                                  func.gap <= 25 ? 'text-orange-600 dark:text-orange-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {func.gap > 0 ? `+${func.gap}%` : 'Target Met'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  func.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                  func.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                  func.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                }`}>
                                  {func.priority}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                {func.gap > 0 ? (
                                  <Link
                                    to={`/assessment/${func.assessmentId}`}
                                    className="inline-flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                                  >
                                    <Target className="w-3 h-3" />
                                    <span>Improve</span>
                                  </Link>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-lg text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Complete</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                    Excellent CMMC Implementation
                  </h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    All CMMC domains are meeting or exceeding target implementation levels.
                  </p>
                  <Link
                    to="/compliance"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
                  >
                    <Activity className="w-5 h-5" />
                    <span>Monitor Compliance Status</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Quick Navigation & Related Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <QuickNavigationPanel currentPage="/dashboard" />
          
          <RelatedLinks
            links={[
              ...contextualLinks,
              {
                title: 'Gap Analysis Report',
                description: 'Comprehensive analysis of implementation gaps with remediation roadmap',
                href: '/reports/compliance',
                category: 'next-step',
                priority: 'high'
              },
              {
                title: 'Implementation Workflow',
                description: 'Structured roadmap for CMMC implementation phases',
                href: '/compliance-workflow',
                category: 'next-step',
                priority: 'high'
              }
            ]}
            title="Recommended Next Steps"
            maxItems={4}
          />
          
          {/* New Security Audit Logs Card */}
          <InternalLinkCard
            title="Security Audit Logs"
            description="Review detailed audit trails for all system activities and user actions across compliance frameworks."
            href="/audit-logs"
            icon={ScrollText}
            badge="New"
            badgeColor="purple"
            priority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;