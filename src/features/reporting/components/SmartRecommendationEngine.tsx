import React, { useMemo } from 'react';
import { 
  Lightbulb, Target, Clock, DollarSign, 
  TrendingUp, AlertTriangle, CheckCircle, Star,
  ExternalLink, BookOpen, Zap
} from 'lucide-react';
import { AssessmentData, Framework } from '../../../shared/types';

interface SmartRecommendationEngineProps {
  assessment: AssessmentData;
  framework: Framework;
  className?: string;
}

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  cost: 'low' | 'medium' | 'high';
  impact: number; // Expected score improvement
  category: string;
  prerequisites?: string[];
  resources: RecommendationResource[];
  steps: string[];
  riskReduction: number;
  complianceImpact: string[];
  businessValue: string;
  successMetrics: string[];
}

interface RecommendationResource {
  type: 'tool' | 'training' | 'consultant' | 'documentation' | 'template';
  name: string;
  description: string;
  url?: string;
  cost?: string;
}

export const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({
  assessment,
  framework,
  className = ''
}) => {
  const recommendations = useMemo(() => {
    const responses = assessment.responses;
    const smartRecs: SmartRecommendation[] = [];

    // Analyze each section and generate intelligent recommendations
    framework.sections.forEach(section => {
      section.categories.forEach(category => {
        category.questions.forEach(question => {
          const response = responses[question.id];
          
          if (response !== undefined && response < 2) {
            // Generate contextual recommendations based on the specific gap
            const rec = generateSmartRecommendation(question, response, section, category);
            if (rec) {
              smartRecs.push(rec);
            }
          }
        });
      });
    });

    // Sort by priority and impact
    return smartRecs.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.impact - a.impact;
    }).slice(0, 10); // Top 10 recommendations
  }, [assessment, framework]);

  const generateSmartRecommendation = (question: any, response: number, section: any, category: any): SmartRecommendation | null => {
    const baseId = `${section.id}-${category.id}-${question.id}`;
    
    // Framework-specific recommendation logic
    if (framework.id === 'nist') {
      return generateNISTRecommendation(baseId, question, response, section, category);
    } else if (framework.id === 'iso27001') {
      return generateISO27001Recommendation(baseId, question, response, section, category);
    } else if (framework.id === 'cmmc') {
      return generateCMMCRecommendation(baseId, question, response, section, category);
    }
    
    return generateGenericRecommendation(baseId, question, response, section, category);
  };

  const generateNISTRecommendation = (id: string, question: any, response: number, section: any, category: any): SmartRecommendation => {
    const recommendations: Record<string, Partial<SmartRecommendation>> = {
      'identify-asset-management': {
        title: 'Implement Comprehensive Asset Management',
        description: 'Deploy an automated asset discovery and inventory management system to maintain real-time visibility of all organizational assets.',
        priority: 'high',
        effort: 'medium',
        timeframe: '3-6 months',
        cost: 'medium',
        impact: 15,
        resources: [
          {
            type: 'tool',
            name: 'Asset Management Tool',
            description: 'Automated network discovery and asset inventory'
          },
          {
            type: 'template',
            name: 'Asset Inventory Template',
            description: 'Standardized asset tracking spreadsheet'
          }
        ],
        steps: [
          'Deploy network discovery tools',
          'Establish asset classification scheme',
          'Implement automated inventory updates',
          'Train staff on asset management procedures'
        ],
        businessValue: 'Improves security visibility and incident response capabilities'
      },
      'protect-access-control': {
        title: 'Strengthen Identity and Access Management',
        description: 'Implement multi-factor authentication and role-based access controls across all systems.',
        priority: 'critical',
        effort: 'high',
        timeframe: '2-4 months',
        cost: 'medium',
        impact: 15,
        resources: [
          {
            type: 'tool',
            name: 'Identity Management System',
            description: 'Enterprise identity and access management'
          },
          {
            type: 'training',
            name: 'IAM Best Practices Training',
            description: 'Staff training on access control principles'
          }
        ],
        steps: [
          'Audit current access permissions',
          'Implement MFA for all users',
          'Establish role-based access controls',
          'Regular access reviews and cleanup'
        ],
        businessValue: 'Prevents unauthorized access and reduces breach risk'
      }
    };

    const key = `${section.id}-${category.id}`;
    const template = recommendations[key] || recommendations['protect-access-control'];
    
    return {
      id,
      category: category.name,
      riskReduction: response === 0 ? 25 : 15,
      complianceImpact: ['NIST CSF', 'SOC 2', 'ISO 27001'],
      successMetrics: ['Reduced security incidents', 'Improved audit scores', 'Faster incident response'],
      ...template
    } as SmartRecommendation;
  };

  const generateISO27001Recommendation = (id: string, question: any, response: number, section: any, category: any): SmartRecommendation => {
    return {
      id,
      title: `Enhance ${category.name} Controls`,
      description: `Implement ISO 27001 compliant controls for ${category.name.toLowerCase()} to meet certification requirements.`,
      priority: response === 0 ? 'critical' : 'high',
      effort: 'medium',
      timeframe: '2-6 months',
      cost: 'medium',
      impact: response === 0 ? 20 : 12,
      category: category.name,
      resources: [
        {
          type: 'documentation',
          name: 'ISO 27001 Control Templates',
          description: 'Ready-to-use policy and procedure templates'
        },
        {
          type: 'consultant',
          name: 'ISO 27001 Consultant',
          description: 'Expert guidance for certification preparation'
        }
      ],
      steps: [
        'Gap analysis against ISO 27001 requirements',
        'Develop required policies and procedures',
        'Implement technical controls',
        'Staff training and awareness',
        'Internal audit and review'
      ],
      riskReduction: response === 0 ? 25 : 15,
      complianceImpact: ['ISO 27001', 'GDPR', 'SOC 2'],
      businessValue: 'Enables ISO 27001 certification and improves customer trust',
      successMetrics: ['Certification readiness', 'Improved security posture']
    };
  };

  const generateCMMCRecommendation = (id: string, question: any, response: number, section: any, category: any): SmartRecommendation => {
    return {
      id,
      title: `Achieve CMMC ${category.name} Requirements`,

      description: `Implement CMMC 2.0 Level 2 controls for ${category.name.toLowerCase()} to maintain Military contract eligibility.`,
      priority: 'critical',
      effort: 'high',
      timeframe: '3-9 months',
      cost: 'high',
      impact: response === 0 ? 25 : 15,
      category: category.name,
      resources: [
        {
          type: 'consultant',
          name: 'CMMC Consultant',
          description: 'Certified CMMC Professional guidance'
        },
        {
          type: 'tool',
          name: 'CMMC Compliance Platform',
          description: 'Automated CMMC assessment and monitoring'
        }
      ],
      steps: [
        'CMMC gap assessment',
        'Develop System Security Plan (SSP)',
        'Implement required controls',
        'Evidence collection and documentation',
        'Third-party assessment preparation'
      ],
      riskReduction: response === 0 ? 25 : 15,

      complianceImpact: ['CMMC 2.0 Level 2', 'NIST SP 800-171', 'DFARS'],
      businessValue: 'Maintains Military contract eligibility',
      successMetrics: ['CMMC certification', 'Reduced CUI exposure risk']
    };
  };

  const generateGenericRecommendation = (id: string, question: any, response: number, section: any, category: any): SmartRecommendation => {
    return {
      id,
      title: `Improve ${category.name}`,
      description: `Address gaps in ${category.name.toLowerCase()} to enhance overall security posture.`,
      priority: response === 0 ? 'high' : 'medium',
      effort: 'medium',
      timeframe: '1-3 months',
      cost: 'low',
      impact: response === 0 ? 15 : 8,
      category: category.name,
      resources: [
        {
          type: 'documentation',
          name: 'Best Practices Guide',
          description: `Industry best practices for ${category.name.toLowerCase()}`
        }
      ],
      steps: [
        'Assess current state',
        'Develop improvement plan',
        'Implement changes',
        'Monitor and validate'
      ],
      riskReduction: response === 0 ? 20 : 10,
      complianceImpact: [framework.name],
      businessValue: 'Improves security posture and reduces risk exposure',
      successMetrics: ['Improved assessment scores', 'Reduced security incidents']
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 border-error-200 dark:border-error-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800';
      default: return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark border-support-light dark:border-support-dark';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-success-500" />;
      default: return <Clock className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const getCostIcon = (cost: string) => {
    switch (cost) {
      case 'high': return '$$$';
      case 'medium': return '$$';
      case 'low': return '$';
      default: return '$';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className={`bg-success-50 dark:bg-success-900/20 rounded-xl p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-success-800 dark:text-success-300 mb-2">
          Excellent Security Posture
        </h3>
        <p className="text-success-600 dark:text-success-400">
          Your assessment shows strong security controls. Continue monitoring and maintaining current practices.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
          <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Smart Recommendations
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Contextual improvement suggestions based on your assessment results
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-support-light dark:border-support-dark">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-primary-500" />
            <div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Total Impact</div>
              <div className="font-bold text-primary-600 dark:text-primary-400">
                +{recommendations.reduce((sum, rec) => sum + rec.impact, 0)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-support-light dark:border-support-dark">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-error-500" />
            <div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Critical Items</div>
              <div className="font-bold text-error-600 dark:text-error-400">
                {recommendations.filter(r => r.priority === 'critical').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-support-light dark:border-support-dark">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Avg Timeframe</div>
              <div className="font-bold text-orange-600 dark:text-orange-400">
                3-6 months
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-support-light dark:border-support-dark">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-success-500" />
            <div>
              <div className="text-sm text-text-secondary-light dark:text-text-muted-dark">Risk Reduction</div>
              <div className="font-bold text-success-600 dark:text-success-400">
                {Math.round(recommendations.reduce((sum, rec) => sum + rec.riskReduction, 0) / recommendations.length)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={rec.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-support-light dark:border-support-dark shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-text-muted-dark">#{index + 1}</span>
                    <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      {rec.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                  </span>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4">
                  {rec.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    +{rec.impact}%
                  </div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Expected Impact
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                {getEffortIcon(rec.effort)}
                <div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Effort</div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
                    {rec.effort}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary-500" />
                <div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Timeframe</div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {rec.timeframe}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-success-500" />
                <div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Cost</div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {getCostIcon(rec.cost)} {rec.cost.charAt(0).toUpperCase() + rec.cost.slice(1)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Risk Reduction</div>
                  <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {rec.riskReduction}%
                  </div>
                </div>
              </div>
            </div>

            {/* Business Value */}
            <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div className="flex items-start space-x-2">
                <Star className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                    Business Value
                  </div>
                  <div className="text-primary-800 dark:text-primary-200 text-sm">
                    {rec.businessValue}
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="mb-6">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                Implementation Steps
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {rec.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {stepIndex + 1}
                    </div>
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="mb-6">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-success-500" />
                Recommended Resources
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {rec.resources.map((resource, resIndex) => (
                  <div key={resIndex} className="border border-support-light dark:border-support-dark rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {resource.name}
                      </div>
                      <span className="text-xs bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded capitalize">
                        {resource.type}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                      {resource.description}
                    </div>
                    {resource.cost && (
                      <div className="text-xs text-success-600 dark:text-success-400 font-medium">
                        {resource.cost}
                      </div>
                    )}
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-2"
                      >
                        <span>Learn more</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="border-t border-support-light dark:border-support-dark pt-4">
              <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                Success Metrics
              </h4>
              <div className="flex flex-wrap gap-2">
                {rec.successMetrics.map((metric, metricIndex) => (
                  <span
                    key={metricIndex}
                    className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 text-sm rounded-full"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Implementation Roadmap
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Phase 1 (0-3 months)</div>
            <div className="text-primary-600 dark:text-primary-400">
              {recommendations.filter(r => r.priority === 'critical').length} critical items
            </div>
          </div>
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Phase 2 (3-6 months)</div>
            <div className="text-primary-600 dark:text-primary-400">
              {recommendations.filter(r => r.priority === 'high').length} high priority items
            </div>
          </div>
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Phase 3 (6+ months)</div>
            <div className="text-primary-600 dark:text-primary-400">
              {recommendations.filter(r => r.priority === 'medium' || r.priority === 'low').length} optimization items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};