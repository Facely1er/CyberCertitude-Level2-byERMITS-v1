import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  children?: NavItem[];
  description?: string;
}

interface AccessibleNavigationProps {
  items: NavItem[];
  className?: string;
}

export const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({ 
  items, 
  className = '' 
}) => {
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, item: NavItem) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (item.children) {
          toggleDropdown(item.label);
        } else if (item.href) {
          navigate(item.href);
        }
        break;
      case 'Escape':
        setOpenDropdowns(new Set());
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Focus next item logic
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Focus previous item logic
        break;
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav 
      ref={navRef}
      className={`${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex items-center gap-1" role="menubar">
        {items.map((item) => (
          <li key={item.label} className="relative" role="none">
            {item.children ? (
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdowns(prev => new Set(prev).add(item.label))}
                onMouseLeave={() => {
                  // Add a small delay to allow moving to dropdown items
                  setTimeout(() => {
                    setOpenDropdowns(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(item.label);
                      return newSet;
                    });
                  }, 150);
                }}
              >
                <button
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.children?.some(child => child.href && isActive(child.href))
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-text-primary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
                  }`}
                  onClick={() => {
                    // Toggle dropdown on click
                    setOpenDropdowns(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(item.label)) {
                        newSet.delete(item.label);
                      } else {
                        newSet.add(item.label);
                      }
                      return newSet;
                    });
                  }}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  aria-expanded={openDropdowns.has(item.label)}
                  aria-haspopup="true"
                  role="menuitem"
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                  <ChevronDown 
                    className={`w-3 h-3 ml-1 transition-transform ${
                      openDropdowns.has(item.label) ? 'rotate-180' : ''
                    }`} 
                    aria-hidden="true"
                  />
                </button>
                
                {openDropdowns.has(item.label) && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-72 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-support-light dark:border-support-dark py-2 z-50"
                    role="menu"
                    tabIndex={-1}
                    aria-label={`${item.label} submenu`}
                    onMouseEnter={() => setOpenDropdowns(prev => new Set(prev).add(item.label))}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        setOpenDropdowns(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.label);
                          return newSet;
                        });
                      }, 150);
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href!}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-background-light dark:hover:bg-surface-dark/50 transition-colors ${
                          isActive(child.href!)
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'text-text-primary-light dark:text-text-secondary-dark'
                        }`}
                        role="menuitem"
                        aria-label={`${child.label}: ${child.description || ''}`}
                      >
                        <child.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark truncate mt-0.5">
                              {child.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href!}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href!)
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-text-primary-light dark:text-text-secondary-dark hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
                }`}
                role="menuitem"
                aria-label={item.description || item.label}
              >
                <item.icon className="w-5 h-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};