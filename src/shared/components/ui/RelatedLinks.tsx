import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  isExternal?: boolean;
  category?: 'next-step' | 'related' | 'prerequisite' | 'resource';
  priority?: 'high' | 'medium' | 'low';
}

interface RelatedLinksProps {
  links: RelatedLink[];
  title?: string;
  className?: string;
  maxItems?: number;
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  links,
  title = 'Related Pages',
  className = '',
  maxItems = 6
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'next-step': return '→';
      case 'prerequisite': return '⚠️';
      case 'resource': return '📚';
      default: return '🔗';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'next-step': return 'Next Step';
      case 'prerequisite': return 'Prerequisite';
      case 'resource': return 'Resource';
      default: return 'Related';
    }
  };

  const sortedLinks = links
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
    })
    .slice(0, maxItems);

  if (sortedLinks.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/10 rounded-xl p-6 border border-support-light dark:border-support-dark ${className}`}>
      <h4 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center space-x-2">
        <span>🔗</span>
        <span>{title}</span>
      </h4>
      
      <div className="space-y-3">
        {sortedLinks.map((link, index) => (
          <div key={index} className="group">
            {link.isExternal ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
                aria-label={`Open ${link.title} in new tab`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">{getCategoryIcon(link.category || 'related')}</span>
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.title}
                    </span>
                    {link.category && (
                      <span className="text-xs bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded">
                        {getCategoryLabel(link.category)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {link.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-text-muted-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </a>
            ) : (
              <Link
                to={link.href}
                className="flex items-center justify-between p-3 bg-surface-light dark:bg-surface-dark rounded-lg border border-support-light dark:border-support-dark hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
                aria-label={`Navigate to ${link.title}`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">{getCategoryIcon(link.category || 'related')}</span>
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.title}
                    </span>
                    {link.category && (
                      <span className="text-xs bg-support-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark px-2 py-1 rounded">
                        {getCategoryLabel(link.category)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};