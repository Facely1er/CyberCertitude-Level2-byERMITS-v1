import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigation } from '../navigation';

describe('Navigation Utilities', () => {
  let originalHistory: History;

  beforeEach(() => {
    originalHistory = window.history;
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.history = originalHistory;
  });

  it('should navigate to home', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goHome();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/');
  });

  it('should navigate to dashboard', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToDashboard();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/dashboard');
  });

  it('should navigate to assessment intro', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToAssessmentIntroScreen();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/assessment-intro');
  });

  it('should navigate to reports', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToAssessmentReportsPage();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/reports');
  });

  it('should navigate to compliance status', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToRealTimeComplianceStatus();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/compliance');
  });

  it('should navigate to evidence collection', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToEvidenceCollectionDashboard();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/evidence');
  });

  it('should navigate to assets', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToAssetDashboard();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/assets');
  });

  it('should navigate to asset inventory', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToAssetInventoryView();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/assets/inventory');
  });

  it('should navigate to team collaboration', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToTeamCollaborationDashboard();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/team');
  });

  it('should navigate to task management', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToTaskManagementDashboard();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/tasks');
  });

  it('should navigate to settings', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToSettingsView();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/settings');
  });

  it('should navigate to profile', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToProfileView();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/profile');
  });

  it('should navigate to help', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToHelpView();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/help');
  });

  it('should navigate to policy templates', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToPolicyTemplates();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/policy-templates');
  });

  it('should navigate to control validation', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.goToControlValidation();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/control-validation');
  });

  it('should handle navigation with custom path', () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    
    navigation.navigate('/custom-path');
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/custom-path');
  });
});

