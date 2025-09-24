import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
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
        setFocusedItem(null);
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
      <ul className="flex items-center space-x-0" role="menubar">
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                    item.children?.some(child => child.href && isActive(child.href))
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
                    className="absolute top-full left-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-3 z-50"
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
                        className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          isActive(child.href!)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        role="menuitem"
                        aria-label={`${child.label}: ${child.description || ''}`}
                      >
                        <child.icon className="w-5 h-5" aria-hidden="true" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
                  isActive(item.href!)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
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