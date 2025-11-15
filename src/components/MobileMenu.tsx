import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu, Home, BarChart3, Target, Activity, Database, Shield, Users, Calendar, CheckSquare, FileText, CheckCircle, FileBarChart } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: any[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const isActive = (href: string) => location.pathname === href;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-surface-light dark:bg-surface-dark shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-support-light dark:border-support-dark">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Navigation
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted-light hover:text-text-primary-light dark:text-text-muted-dark dark:hover:text-text-primary-light"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.children.map((child: any) => (
                      <button
                        key={child.href}
                        onClick={() => handleNavigation(child.href)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-text-primary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-surface-dark/50'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{child.label}</div>
                          {child.description && (
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                              {child.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-text-primary-light dark:text-text-secondary-dark hover:bg-support-light dark:hover:bg-surface-dark/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};