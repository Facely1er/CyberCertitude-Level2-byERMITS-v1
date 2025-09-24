import React, { useState, useEffect } from 'react';
import { Keyboard, X, Command, Square } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts?: Shortcut[];
}

const defaultShortcuts: Shortcut[] = [
  // Navigation
  { keys: ['Tab'], description: 'Move to next element', category: 'Navigation' },
  { keys: ['Shift', 'Tab'], description: 'Move to previous element', category: 'Navigation' },
  { keys: ['Enter'], description: 'Activate focused element', category: 'Navigation' },
  { keys: ['Escape'], description: 'Close modal or cancel action', category: 'Navigation' },
  { keys: ['Arrow Up'], description: 'Move up in list', category: 'Navigation' },
  { keys: ['Arrow Down'], description: 'Move down in list', category: 'Navigation' },
  { keys: ['Home'], description: 'Go to first item', category: 'Navigation' },
  { keys: ['End'], description: 'Go to last item', category: 'Navigation' },
  
  // File Operations
  { keys: ['Ctrl', 'S'], description: 'Save current document', category: 'File Operations' },
  { keys: ['Ctrl', 'N'], description: 'Create new document', category: 'File Operations' },
  { keys: ['Ctrl', 'O'], description: 'Open document', category: 'File Operations' },
  { keys: ['Ctrl', 'P'], description: 'Print document', category: 'File Operations' },
  
  // Edit Operations
  { keys: ['Ctrl', 'Z'], description: 'Undo last action', category: 'Edit Operations' },
  { keys: ['Ctrl', 'Y'], description: 'Redo last action', category: 'Edit Operations' },
  { keys: ['Ctrl', 'A'], description: 'Select all', category: 'Edit Operations' },
  { keys: ['Ctrl', 'C'], description: 'Copy selected text', category: 'Edit Operations' },
  { keys: ['Ctrl', 'V'], description: 'Paste text', category: 'Edit Operations' },
  { keys: ['Ctrl', 'X'], description: 'Cut selected text', category: 'Edit Operations' },
  
  // Search & Find
  { keys: ['Ctrl', 'F'], description: 'Find in document', category: 'Search & Find' },
  { keys: ['F3'], description: 'Find next', category: 'Search & Find' },
  { keys: ['Shift', 'F3'], description: 'Find previous', category: 'Search & Find' },
  { keys: ['Ctrl', 'H'], description: 'Find and replace', category: 'Search & Find' },
  
  // Application
  { keys: ['F1'], description: 'Show help', category: 'Application' },
  { keys: ['F5'], description: 'Refresh page', category: 'Application' },
  { keys: ['F11'], description: 'Toggle fullscreen', category: 'Application' },
  { keys: ['Ctrl', '?'], description: 'Show keyboard shortcuts', category: 'Application' },
  
  // CMMC Specific
  { keys: ['Ctrl', 'Shift', 'A'], description: 'Start new assessment', category: 'CMMC Features' },
  { keys: ['Ctrl', 'Shift', 'E'], description: 'Open evidence collection', category: 'CMMC Features' },
  { keys: ['Ctrl', 'Shift', 'R'], description: 'Generate report', category: 'CMMC Features' },
  { keys: ['Ctrl', 'Shift', 'D'], description: 'Open dashboard', category: 'CMMC Features' },
];

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts = defaultShortcuts
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(shortcuts.map(s => s.category)))];

  // Filter shortcuts based on search and category
  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || shortcut.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group shortcuts by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const renderKey = (key: string) => {
    const keyMap: Record<string, React.ReactNode> = {
      'Ctrl': isMac ? <Command className="w-3 h-3" /> : <Square className="w-3 h-3" />,
      'Command': <Command className="w-3 h-3" />,
      'Shift': '⇧',
      'Alt': '⌥',
      'Enter': '↵',
      'Escape': '⎋',
      'Tab': '⇥',
      'Space': '␣',
      'Arrow Up': '↑',
      'Arrow Down': '↓',
      'Arrow Left': '←',
      'Arrow Right': '→',
      'Home': '⌂',
      'End': '⏎',
      'Page Up': '⇞',
      'Page Down': '⇟',
      'Delete': '⌫',
      'Backspace': '⌫'
    };

    return keyMap[key] || key;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="keyboard-shortcuts-help">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search shortcuts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Category Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {Object.keys(groupedShortcuts).length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No shortcuts found matching your search.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center space-x-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <kbd className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">
                                  {renderKey(key)}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-400">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-1 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">Esc</kbd> to close
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;