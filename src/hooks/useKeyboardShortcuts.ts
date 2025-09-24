import { useEffect, useRef, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const shortcutsRef = useRef(shortcuts);
  
  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const shortcut = shortcutsRef.current.find(s => 
      event.key.toLowerCase() === s.key.toLowerCase() &&
      !!event.ctrlKey === !!s.ctrlKey &&
      !!event.shiftKey === !!s.shiftKey &&
      !!event.altKey === !!s.altKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return shortcuts;
};