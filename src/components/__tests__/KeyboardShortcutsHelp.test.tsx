import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';

describe('KeyboardShortcutsHelp', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <KeyboardShortcutsHelp isOpen={false} onClose={mockOnClose} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Keyboard Shortcuts')).toBeDefined();
  });

  it('should display default shortcuts', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('Move to next element')).toBeDefined();
    expect(screen.getByText('Save current document')).toBeDefined();
    expect(screen.getByText('Start new assessment')).toBeDefined();
  });

  it('should display custom shortcuts when provided', () => {
    const customShortcuts = [
      {
        keys: ['Ctrl', 'K'],
        description: 'Custom shortcut',
        category: 'Custom'
      }
    ];

    render(
      <KeyboardShortcutsHelp 
        isOpen={true} 
        onClose={mockOnClose}
        shortcuts={customShortcuts}
      />
    );

    expect(screen.getByText('Custom shortcut')).toBeDefined();
  });

  it('should filter shortcuts by search term', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    const searchInput = screen.getByPlaceholderText('Search shortcuts...');
    fireEvent.change(searchInput, { target: { value: 'save' } });

    expect(screen.getByText('Save current document')).toBeDefined();
    expect(screen.queryByText('Move to next element')).toBeNull();
  });

  it('should filter shortcuts by category', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'File Operations' } });

    expect(screen.getByText('Save current document')).toBeDefined();
    expect(screen.getByText('Create new document')).toBeDefined();
  });

  it('should close when close button is clicked', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close when backdrop is clicked', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    const backdrop = document.querySelector('.fixed.inset-0.bg-black');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should close when Escape key is pressed', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should prevent body scroll when open', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <KeyboardShortcutsHelp isOpen={false} onClose={mockOnClose} />
    );

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should display categories in filter dropdown', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('Navigation')).toBeDefined();
    expect(screen.getByText('File Operations')).toBeDefined();
  });

  it('should show empty state when no shortcuts match search', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    const searchInput = screen.getByPlaceholderText('Search shortcuts...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent12345' } });

    expect(screen.getByText('No shortcuts found matching your search.')).toBeDefined();
  });

  it('should render key symbols correctly', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    // Keys should be rendered as kbd elements
    const kbdElements = document.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
  });

  it('should group shortcuts by category', () => {
    render(
      <KeyboardShortcutsHelp isOpen={true} onClose={mockOnClose} />
    );

    // Should show category headers
    expect(screen.getByText('Navigation')).toBeDefined();
    expect(screen.getByText('File Operations')).toBeDefined();
  });
});

