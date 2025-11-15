import React from 'react';
import { Calendar, Clock, Target, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, TrendingUp } from 'lucide-react';

interface RemediationItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  phase: number;
  dependencies?: string[];
  expectedImpact: string;
  resources: string[];
}

interface RemediationTimelineProps {
  gaps: Array<{
    category: string;
    score: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  className?: string;
}

export const RemediationTimeline: React.FC<RemediationTimelineProps> = ({ gaps, className = '' }) => {
  // Generate remediation items based on gaps
  const generateRemediationItems = (): RemediationItem[] => {
    const items: RemediationItem[] = [];
    
    gaps.forEach((gap, index) => {
      const gapSize = 75 - gap.score;
      let phase = 1;
      let timeline = '1-3 months';
      let effort: 'low' | 'medium' | 'high' = 'medium';
      
      // Determine phase and timeline based on priority and gap size
      if (gap.priority === 'high' || gapSize > 50) {
        phase = 1;
        timeline = '1-3 months';
        effort = gapSize > 60 ? 'high' : 'medium';
      } else if (gap.priority === 'medium' || gapSize > 25) {
        phase = 2;
        timeline = '3-6 months';
        effort = 'medium';
      } else {
        phase = 3;
        timeline = '6-12 months';
        effort = 'low';
      }

      items.push({
        id: `remediation-${index}`,
        title: `Improve ${gap.category}`,
        description: `Address security gaps in ${gap.category.toLowerCase()} to reach target maturity level`,
        priority: gap.priority === 'high' ? 'critical' : gap.priority as 'high' | 'medium' | 'low',
        effort,
        timeline,
        phase,
        expectedImpact: `+${Math.min(gapSize, 25)}% improvement`,
        resources: getResourcesForCategory(gap.category)
      });
    });

    return items.sort((a, b) => a.phase - b.phase || (a.priority === 'critical' ? -1 : 1));
  };

  const getResourcesForCategory = (category: string): string[] => {
    const resourceMap: Record<string, string[]> = {
      'Asset Management': ['IT Team', 'Security Team', 'Asset Management Tool'],
      'Business Environment': ['Executive Team', 'Risk Manager', 'Compliance Officer'],
      'Governance': ['CISO', 'Legal Team', 'Board of Directors'],
      'Risk Assessment': ['Risk Manager', 'Security Analyst', 'External Consultant'],
      'Access Control': ['IT Team', 'Identity Management System', 'Security Team'],
      'Awareness and Training': ['HR Team', 'Training Platform', 'Security Team'],
      'Data Security': ['Data Protection Officer', 'Encryption Tools', 'Backup Systems'],
      'Information Protection': ['Security Team', 'DLP Solution', 'Classification Tools'],
      'Maintenance': ['IT Operations', 'Patch Management System', 'Change Control'],
      'Protective Technology': ['Security Team', 'Firewall', 'Endpoint Protection'],
      'Anomalies and Events': ['SOC Team', 'SIEM System', 'Monitoring Tools'],
      'Security Continuous Monitoring': ['Security Analyst', 'Monitoring Platform', 'Dashboards'],
      'Detection Processes': ['Incident Response Team', 'Detection Tools', 'Playbooks'],
      'Response Planning': ['Incident Response Team', 'Communication Plan', 'Legal Team'],
      'Communications': ['PR Team', 'Communication Tools', 'Stakeholder List'],
      'Analysis': ['Forensics Team', 'Analysis Tools', 'External Experts'],
      'Mitigation': ['Technical Team', 'Containment Tools', 'Recovery Procedures'],
      'Improvements': ['Process Owner', 'Lessons Learned', 'Training Updates'],
      'Recovery Planning': ['Business Continuity Team', 'Backup Systems', 'Recovery Sites']
    };

    return resourceMap[category] || ['Security Team', 'IT Team', 'Management'];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300 border-error-200 dark:border-error-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800';
      default:
        return 'bg-support-light dark:bg-background-dark/30 text-text-primary-light dark:text-text-secondary-dark border-support-light dark:border-support-dark';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      default:
        return <Clock className="w-4 h-4 text-text-muted-light" />;
    }
  };

  const remediationItems = generateRemediationItems();
  const phases = [
    { number: 1, title: 'Immediate Actions', description: 'Critical security gaps requiring immediate attention', timeframe: '0-3 months' },
    { number: 2, title: 'Short-term Improvements', description: 'Important enhancements to strengthen security posture', timeframe: '3-6 months' },
    { number: 3, title: 'Long-term Optimization', description: 'Strategic improvements for advanced maturity', timeframe: '6-12 months' }
  ];

  if (remediationItems.length === 0) {
    return (
      <div className={`bg-success-50 dark:bg-success-900/20 rounded-xl p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-success-800 dark:text-success-300 mb-2">
          Excellent Security Posture
        </h3>
        <p className="text-success-600 dark:text-success-400">
          No critical gaps identified. Continue monitoring and maintaining current security controls.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Timeline Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {phases.map((phase) => {
          const phaseItems = remediationItems.filter(item => item.phase === phase.number);
          return (
            <div key={phase.number} className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 border border-support-light dark:border-support-dark">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {phase.number}
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{phase.title}</h4>
                  <p className="text-xs text-text-secondary-light dark:text-text-muted-dark">{phase.timeframe}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">{phase.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted-light dark:text-text-muted-dark">{phaseItems.length} items</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span className="text-primary-600 dark:text-primary-400 font-medium">
                    {phaseItems.reduce((sum, item) => sum + parseInt(item.expectedImpact.replace(/[^\d]/g, '')), 0)}% impact
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Timeline */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseItems = remediationItems.filter(item => item.phase === phase.number);
          
          if (phaseItems.length === 0) return null;

          return (
            <div key={phase.number} className="relative">
              {/* Phase Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {phase.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">{phase.title}</h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">{phase.timeframe}</p>
                </div>
              </div>

              {/* Phase Items */}
              <div className="ml-5 border-l-2 border-support-light dark:border-support-dark pl-6 space-y-4">
                {phaseItems.map((item, _index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-8 w-4 h-4 bg-primary-600 rounded-full border-2 border-white dark:border-support-dark"></div>
                    
                    {/* Item Card */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 border border-support-light dark:border-support-dark shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                            {item.title}
                          </h4>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                          </span>
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {item.expectedImpact}
                          </span>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-text-muted-light" />
                          <div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Timeline</div>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                              {item.timeline}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {getEffortIcon(item.effort)}
                          <div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Effort</div>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                              {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-text-muted-light" />
                          <div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Impact</div>
                            <div className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                              {item.expectedImpact}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="mt-4 pt-4 border-t border-support-light dark:border-support-dark">
                        <div className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">Required Resources</div>
                        <div className="flex flex-wrap gap-2">
                          {item.resources.map((resource, resourceIndex) => (
                            <span
                              key={resourceIndex}
                              className="px-2 py-1 bg-support-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark text-xs rounded"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Remediation Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Total Items</div>
            <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {remediationItems.length}
            </div>
          </div>
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Expected Timeline</div>
            <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              6-12 months
            </div>
          </div>
          <div>
            <div className="text-primary-700 dark:text-primary-300 font-medium">Projected Improvement</div>
            <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              +{remediationItems.reduce((sum, item) => sum + parseInt(item.expectedImpact.replace(/[^\d]/g, '')), 0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};