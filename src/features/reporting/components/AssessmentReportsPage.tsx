import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, BarChart3, Download, Eye, Plus, 
  CheckCircle,
  Target, Award,
  ArrowRight, Building, Shield, Users, Activity
} from 'lucide-react';
import { Breadcrumbs } from '@/shared/components/layout/Breadcrumbs';
import { QuickNavigationPanel, RelatedLinks, EmptyState, SearchAndFilter } from '@/shared/components/ui';
import { useInternalLinking } from '@/shared/hooks/useInternalLinking';
import { AssessmentData, UserProfile } from '@/shared/types';
import { getFramework } from '@/data/frameworks';
import { reportService } from '@/services/reportService';

interface AssessmentReportsPageProps {
  savedAssessments: AssessmentData[];
  onGenerateReport: (assessment: AssessmentData) => void;
  onExportReport: (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => void;
  onStartAssessment: () => void;
  userProfile: UserProfile | null;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const AssessmentReportsPage: React.FC<AssessmentReportsPageProps> = ({
  savedAssessments,
  onGenerateReport,
  onStartAssessment,
  addNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFramework, setFilterFramework] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { breadcrumbs } = useInternalLinking();

  const calculateAssessmentScore = (assessment: AssessmentData) => {
    if (!assessment.responses) return 0;
    const responses = Object.values(assessment.responses);
    if (responses.length === 0) return 0;
    return Math.round((responses.reduce((a, b) => a + b, 0) / responses.length) * 25);
  };

  const filteredAndSortedAssessments = useMemo(() => {
    if (!savedAssessments || !Array.isArray(savedAssessments)) return [];
    
    const filtered = savedAssessments.filter(assessment => {
      // Defensive checks
      if (!assessment || typeof assessment !== 'object') {
        return false;
      }
      
      const matchesSearch = (assessment.frameworkName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (assessment.organizationInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFramework = filterFramework === 'all' || assessment.frameworkId === filterFramework;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && assessment.isComplete) ||
                           (filterStatus === 'inProgress' && !assessment.isComplete);
      
      return matchesSearch && matchesFramework && matchesStatus;
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
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [savedAssessments, searchTerm, filterFramework, filterStatus, sortBy, sortOrder]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-warning-600 dark:text-warning-400';
    if (score >= 40) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  const getFrameworkIcon = (frameworkId: string) => {
    switch (frameworkId) {
      case 'cmmc': return Building;
      case 'privacy': return Users;
      case 'nist-csf-v2-extended': return Award;
      case 'nist-csf-v2': return Shield;
      default: return FileText;
    }
  };

  const handleExportReport = async (assessment: AssessmentData, format: 'json' | 'csv' | 'pdf') => {
    try {
      const framework = getFramework(assessment.frameworkId);
      await reportService.exportReport(assessment, framework, {
        format,
        includeExecutiveSummary: true,
        includeDetailedAnalysis: true,
        includeRecommendations: true,
        includeGapAnalysis: true,
        includeNextSteps: true,
        branding: {
          organizationName: assessment.organizationInfo?.name || 'Organization'
        }
      });
      addNotification('success', `Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', `Failed to export report: ${(error as Error).message}`);
    }
  };

  const stats = useMemo(() => {
    const total = savedAssessments.length;
    const completed = savedAssessments.filter(a => a.isComplete).length;
    const avgScore = savedAssessments.length > 0 
      ? Math.round(savedAssessments.reduce((sum, assessment) => sum + calculateAssessmentScore(assessment), 0) / savedAssessments.length)
      : 0;
    const recentReports = savedAssessments.filter(a => {
      const daysSinceModified = (new Date().getTime() - new Date(a.lastModified).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceModified <= 7;
    }).length;

    return { total, completed, avgScore, recentReports };
  }, [savedAssessments]);

  return (
    <div className="container-responsive section-padding">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header */}
      <div className="card-standard mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  Assessment Reports
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Generate and export compliance assessment reports
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/reports/advanced"
                className="flex items-center space-x-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-primary-dark px-4 py-2 rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Advanced Analytics</span>
              </Link>
              
              <button
                onClick={onStartAssessment}
                className="btn-primary px-4 py-2 rounded-xl transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Assessments</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Completed</p>
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Average Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</p>
            </div>
            <Target className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Recent Reports</p>
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{stats.recentReports}</p>
            </div>
            <Activity className="w-8 h-8 text-warning-600 dark:text-warning-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchPlaceholder="Search assessments..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterGroups={[
          {
            id: 'framework',
            label: 'Framework',
            options: [
              { id: 'cmmc', label: 'CMMC 2.0 Level 2', value: 'cmmc' },
              { id: 'privacy', label: 'Privacy Framework', value: 'privacy' },
              { id: 'nist-csf-v2-extended', label: 'NIST CSF v2.0 Standard', value: 'nist-csf-v2-extended' },
              { id: 'nist-csf-v2', label: 'NIST CSF v2.0 Quick Check', value: 'nist-csf-v2' }
            ]
          },
          {
            id: 'status',
            label: 'Status',
            options: [
              { id: 'completed', label: 'Completed', value: 'completed' },
              { id: 'inProgress', label: 'In Progress', value: 'inProgress' }
            ]
          }
        ]}
        selectedFilters={{
          framework: filterFramework === 'all' ? '' : filterFramework,
          status: filterStatus === 'all' ? '' : filterStatus
        }}
        onFilterChange={(filterId, value) => {
          if (filterId === 'framework') {
            setFilterFramework(value || 'all');
          } else if (filterId === 'status') {
            setFilterStatus(value || 'all');
          }
        }}
        onClearFilters={() => {
          setFilterFramework('all');
          setFilterStatus('all');
        }}
        className="mb-8"
      />

      {/* Sort Controls */}
      <div className="card-standard p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-standard"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-support-light dark:border-support-dark rounded-xl bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
          
          <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {filteredAndSortedAssessments.length} of {savedAssessments.length} assessments
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="card-standard">
        <div className="p-6 border-b border-support-light dark:border-support-dark">
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Available Assessment Reports
          </h2>
        </div>
        
        {filteredAndSortedAssessments.length === 0 ? (
          <EmptyState
            title={savedAssessments.length === 0 ? 'No Assessments Available' : 'No Matching Assessments'}
            description={savedAssessments.length === 0 
              ? 'Start your first cybersecurity assessment to generate reports'
              : 'Try adjusting your search criteria or filters'
            }
            action={savedAssessments.length === 0 ? {
              label: 'Start First Assessment',
              onClick: onStartAssessment
            } : undefined}
            icon={FileText}
          />
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {filteredAndSortedAssessments.map((assessment) => {
                const framework = getFramework(assessment.frameworkId);
                const score = calculateAssessmentScore(assessment);
                const progress = assessment.responses ? Object.keys(assessment.responses).length : 0;
                const totalQuestions = framework?.sections?.reduce((sum, section) => 
                  sum + section.categories.reduce((catSum, category) => 
                    catSum + (category.questions?.length || 0), 0), 0) || 0;
                const FrameworkIcon = getFrameworkIcon(assessment.frameworkId);
                
                return (
                  <div key={assessment.id} className="border border-support-light dark:border-support-dark rounded-xl p-6 bg-background-light dark:bg-background-dark hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                          <FrameworkIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {assessment.frameworkName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              assessment.isComplete
                                ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                                : 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300'
                            }`}>
                              {assessment.isComplete ? 'Complete' : 'In Progress'}
                            </span>
                          </div>
                          
                          {assessment.organizationInfo?.name && (
                            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                              Organization: {assessment.organizationInfo.name}
                            </p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Overall Score:</span>
                              <div className={`font-bold text-lg ${getScoreColor(score)}`}>
                                {score}%
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Progress:</span>
                              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                                {progress}/{totalQuestions}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Last Modified:</span>
                              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                                {new Date(assessment.lastModified).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Framework:</span>
                              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                                v{framework.version}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-support-light dark:bg-support-dark rounded-full h-2 mb-4">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-secondary-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(progress / totalQuestions) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(score)} mb-1`}>
                          {score}%
                        </div>
                        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Maturity Score</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onGenerateReport(assessment)}
                        className="btn-primary px-4 py-2 rounded-xl transition font-medium flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Report</span>
                      </button>
                      
                      <button
                        onClick={() => handleExportReport(assessment, 'pdf')}
                        className="px-4 py-2 bg-error-500 text-white rounded-xl hover:bg-error-600 dark:hover:bg-error-400 transition-colors font-medium flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </button>
                      
                      <button
                        onClick={() => handleExportReport(assessment, 'json')}
                        className="px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-primary-dark rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-colors font-medium flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export JSON</span>
                      </button>
                      
                      <button
                        onClick={() => handleExportReport(assessment, 'csv')}
                        className="px-4 py-2 border border-support-light dark:border-support-dark text-text-primary-light dark:text-text-primary-dark rounded-xl hover:bg-background-light dark:hover:bg-background-dark transition-colors font-medium flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                      
                      {!assessment.isComplete && (
                        <Link
                          to={`/assessment/${assessment.id}`}
                          className="px-4 py-2 bg-success-500 text-white rounded-xl hover:bg-success-600 dark:hover:bg-success-400 transition-colors font-medium flex items-center space-x-2"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>Continue Assessment</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Framework Overview */}
      <div className="card-standard p-6 mb-8">
        <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">
          Available Assessment Frameworks
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-error-200 dark:border-error-800 rounded-xl p-6 bg-error-50 dark:bg-error-900/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Building className="w-8 h-8 text-error-600 dark:text-error-400" />
              <div>
                <h4 className="font-bold text-error-900 dark:text-error-100">CMMC 2.0 Level 2</h4>
                <p className="text-sm text-error-700 dark:text-error-300">Military Contractor Compliance</p>
              </div>
            </div>
            <p className="text-error-800 dark:text-error-200 text-sm mb-4">
              Complete CMMC 2.0 Level 2 assessment with 110 controls for Controlled Unclassified Information (CUI) protection.
            </p>
            <Link
              to="/assessment-intro"
              className="inline-flex items-center space-x-2 bg-error-500 text-white px-4 py-2 rounded-xl hover:bg-error-600 dark:hover:bg-error-400 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Start CMMC Assessment</span>
            </Link>
          </div>
          
          <div className="border border-support-light dark:border-support-dark rounded-xl p-6 bg-background-light dark:bg-background-dark hover:shadow-lg transition-shadow opacity-50">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-text-muted-light dark:text-text-muted-dark" />
              <div>
                <h4 className="font-bold text-text-muted-light dark:text-text-muted-dark">Additional Frameworks</h4>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Coming in Future Releases</p>
              </div>
            </div>
            <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4">
              Additional assessment frameworks will be available in future platform updates.
            </p>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark italic">
              Currently focused on CMMC 2.0 Level 2 compliance
            </div>
          </div>
          
          <div className="border border-primary-200 dark:border-primary-800 rounded-xl p-6 bg-primary-50 dark:bg-primary-900/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div>
                <h4 className="font-bold text-primary-900 dark:text-primary-100">NIST CSF v2.0</h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">Cybersecurity Framework</p>
              </div>
            </div>
            <p className="text-primary-800 dark:text-primary-200 text-sm mb-4">
              Quick 10-question assessment or comprehensive 106-subcategory evaluation for NIST CSF v2.0 implementation.
            </p>
            <Link
              to="/assessment-intro"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-400 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Start NIST Assessment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickNavigationPanel currentPage="/reports" />
        
        <RelatedLinks
          links={[
           {
             title: 'Security Assessment Report',
             description: 'Generate comprehensive CMMC Level 2 security assessment reports',
             href: '/reports/security-assessment',
             category: 'resource',
             priority: 'high'
           },
           {
             title: 'Implementation Workflow',
             description: 'Follow structured compliance implementation roadmap',
             href: '/compliance-workflow',
             category: 'next-step',
             priority: 'high'
           },
            {
              title: 'Advanced Analytics',
              description: 'Comprehensive dashboard with charts and trends',
              href: '/reports/advanced',
              category: 'related',
              priority: 'high'
            },
            {
              title: 'Team Performance',
              description: 'Track team productivity and collaboration',
              href: '/reports/team',
              category: 'related',
              priority: 'medium'
            },
            {
              title: 'Compliance Status',
              description: 'Real-time implementation monitoring',
              href: '/compliance',
              category: 'next-step',
              priority: 'high'
            },
            {
              title: 'Evidence Collection',
              description: 'Manage compliance documentation',
              href: '/evidence',
              category: 'next-step',
              priority: 'medium'
            }
          ]}
          title="Related Resources"
          maxItems={4}
        />
      </div>
    </div>
  );
};

export default AssessmentReportsPage;