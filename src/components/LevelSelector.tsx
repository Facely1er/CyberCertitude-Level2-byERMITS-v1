import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface LevelSelectorProps {
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  className?: string;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onLevelChange,
  className = ''
}) => {
  const levels = [
    {
      level: 1,
      name: 'Level 1 - Foundational',
      description: 'Basic cyber hygiene for Federal Contract Information (FCI)',
      controls: 17,
      assessment: 'Self-Assessment',
      color: 'green',
      icon: CheckCircle
    },
    {
      level: 2,
      name: 'Level 2 - Advanced',
      description: 'Intermediate cyber hygiene for Controlled Unclassified Information (CUI)',
      controls: 110,
      assessment: 'C3PAO Assessment',
      color: 'yellow',
      icon: Shield
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
          Select CMMC Level
        </h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Choose the appropriate CMMC level for your organization
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.level;
          
          return (
            <div
              key={level.level}
              onClick={() => onLevelChange(level.level)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                isSelected
                  ? `border-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-900/20`
                  : 'border-support-light dark:border-support-dark hover:border-support-light dark:hover:border-support-light'
              }`}
            >
              <div className="flex items-start gap-3 h-full">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  isSelected ? `bg-${level.color}-100 text-${level.color}-600` : 'bg-support-light text-text-secondary-light'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm leading-tight mb-1 break-words">
                    {level.name}
                  </h4>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2 leading-relaxed break-words">
                    {level.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-muted-light dark:text-text-muted-dark flex-wrap">
                    <span className="whitespace-nowrap">{level.controls} controls</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">{level.assessment}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
