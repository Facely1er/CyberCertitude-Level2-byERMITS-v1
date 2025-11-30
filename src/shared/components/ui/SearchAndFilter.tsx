import React, { useState } from 'react';
import { Search, ListFilter as Filter, X, ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: any;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterGroups?: FilterGroup[];
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
  className?: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterGroups = [],
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(selectedFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== null && value !== undefined
  );

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-support-light dark:border-support-dark p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark hover:text-text-secondary-light"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-error-600 dark:hover:text-error-400 transition-colors"
            >
              Clear Filters
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
              hasActiveFilters
                ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-support-light dark:border-support-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-primary-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(selectedFilters).filter(v => 
                  Array.isArray(v) ? v.length > 0 : v !== '' && v !== null
                ).length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Expanded Filters */}
      {showFilters && filterGroups.length > 0 && (
        <div className="mt-6 pt-6 border-t border-support-light dark:border-support-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterGroups.map((group) => (
              <div key={group.id}>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-secondary-dark mb-2">
                  {group.label}
                </label>
                {group.multiple ? (
                  <select
                    multiple
                    value={selectedFilters[group.id] || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      onFilterChange(group.id, values);
                    }}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    size={Math.min(group.options.length, 4)}
                  >
                    {group.options.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedFilters[group.id] || ''}
                    onChange={(e) => onFilterChange(group.id, e.target.value)}
                    className="w-full px-3 py-2 border border-support-light dark:border-support-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All {group.label}</option>
                    {group.options.map(option => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};