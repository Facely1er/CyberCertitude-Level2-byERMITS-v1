import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LevelSelector from '../LevelSelector';

describe('LevelSelector', () => {
  const mockOnLevelChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render level selector', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    expect(screen.getByText('Select CMMC Level')).toBeDefined();
    expect(screen.getByText('Level 1 - Foundational')).toBeDefined();
    expect(screen.getByText('Level 2 - Advanced')).toBeDefined();
  });

  it('should display level descriptions', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    expect(screen.getByText(/Basic cyber hygiene for Federal Contract Information/i)).toBeDefined();
    expect(screen.getByText(/Intermediate cyber hygiene for Controlled Unclassified Information/i)).toBeDefined();
  });

  it('should call onLevelChange when level is clicked', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    const level2Card = screen.getByText('Level 2 - Advanced').closest('div[class*="cursor-pointer"]');
    expect(level2Card).toBeDefined();
    
    fireEvent.click(level2Card!);
    expect(mockOnLevelChange).toHaveBeenCalledWith(2);
  });

  it('should highlight selected level', () => {
    const { rerender } = render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    const level1Card = screen.getByText('Level 1 - Foundational').closest('div');
    const level2Card = screen.getByText('Level 2 - Advanced').closest('div');
    
    // Level 1 should be selected
    expect(level1Card?.className).toContain('border-success-500');

    // Change selection
    rerender(
      <LevelSelector 
        selectedLevel={2} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    // Level 2 should be selected
    expect(level2Card?.className).toContain('border-yellow-500');
  });

  it('should display control counts', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    expect(screen.getByText('17 controls')).toBeDefined();
    expect(screen.getByText('110 controls')).toBeDefined();
  });

  it('should display assessment types', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    expect(screen.getByText('Self-Assessment')).toBeDefined();
    expect(screen.getByText('C3PAO Assessment')).toBeDefined();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper?.className).toContain('custom-class');
  });

  it('should render icons for each level', () => {
    render(
      <LevelSelector 
        selectedLevel={1} 
        onLevelChange={mockOnLevelChange} 
      />
    );

    // Icons should be present (CheckCircle for Level 1, Shield for Level 2)
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });
});

