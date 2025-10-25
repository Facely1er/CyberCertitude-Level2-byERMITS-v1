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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Select CMMC Level
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Choose the appropriate CMMC level for your organization
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {levels.map((level) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.level;
          
          return (
            <div
              key={level.level}
              onClick={() => onLevelChange(level.level)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? `border-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-900/20`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? `bg-${level.color}-100 text-${level.color}-600` : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {level.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {level.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{level.controls} controls</span>
                    <span>•</span>
                    <span>{level.assessment}</span>
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
