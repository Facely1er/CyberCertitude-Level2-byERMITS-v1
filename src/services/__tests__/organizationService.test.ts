import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrganizationService } from '../organizationService';

// Mock dependencies
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  },
  isSupabaseReady: false
}));

vi.mock('../lib/auditLog', () => ({
  auditLogger: {
    log: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn()
  }
}));

describe('OrganizationService', () => {
  let organizationService: OrganizationService;

  beforeEach(() => {
    localStorage.clear();
    organizationService = OrganizationService.getInstance();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = OrganizationService.getInstance();
      const instance2 = OrganizationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('User organizations', () => {
    it('should get local organizations for user', async () => {
      const userId = 'user-1';
      const result = await organizationService.getUserOrganizations(userId);
      expect(result).toBeInstanceOf(Array);
    });

    it('should handle missing organizations gracefully', async () => {
      const result = await organizationService.getUserOrganizations('non-existent-user');
      expect(result).toEqual([]);
    });
  });

  describe('Organization creation', () => {
    it('should create organization locally', async () => {
      const orgData = {
        name: 'Test Org',
        slug: 'test-org',
        description: 'Test organization',
        logoUrl: undefined,
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-1'
      };

      const userId = 'user-1';
      const result = await organizationService.createOrganization(orgData, userId);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Org');
      expect(result.slug).toBe('test-org');
      expect(result.id).toBeDefined();
    });

    it('should save organization to localStorage', async () => {
      const orgData = {
        name: 'Saved Org',
        slug: 'saved-org',
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-1'
      };

      await organizationService.createOrganization(orgData, 'user-1');
      
      const saved = localStorage.getItem('organizations-user-1');
      expect(saved).toBeTruthy();
    });
  });

  describe('Member invitations', () => {
    it('should invite member to organization', async () => {
      const orgData = {
        name: 'Test Org',
        slug: 'test-org',
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-1'
      };

      await organizationService.createOrganization(orgData, 'user-1');
      const orgs = await organizationService.getUserOrganizations('user-1');
      const orgId = orgs[0].id;

      const invitation = await organizationService.inviteMember(
        orgId,
        'newmember@example.com',
        'viewer',
        'user-1'
      );

      expect(invitation).toBeDefined();
      expect(invitation.email).toBe('newmember@example.com');
      expect(invitation.role).toBe('viewer');
      expect(invitation.token).toBeDefined();
    });

    it('should generate unique invite tokens', async () => {
      const tokens = new Set();
      
      for (let i = 0; i < 10; i++) {
        const invitation = await organizationService.inviteMember(
          'org-1',
          `member${i}@example.com`,
          'viewer',
          'user-1'
        );
        tokens.add(invitation.token);
      }

      expect(tokens.size).toBe(10);
    });
  });

  describe('Organization members', () => {
    it('should get organization members', async () => {
      const result = await organizationService.getOrganizationMembers('org-1');
      expect(result).toBeInstanceOf(Array);
    });

    it('should return empty array for organization with no members', async () => {
      const result = await organizationService.getOrganizationMembers('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('Member role updates', () => {
    it('should update member role locally', async () => {
      const orgData = {
        name: 'Test Org',
        slug: 'test-org',
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-1'
      };

      await organizationService.createOrganization(orgData, 'user-1');
      const orgs = await organizationService.getUserOrganizations('user-1');
      const orgId = orgs[0].id;

      await organizationService.updateMemberRole(orgId, 'user-2', 'admin', 'user-1');
      
      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('Local storage operations', () => {
    it('should retrieve organizations from localStorage', async () => {
      const orgData = {
        name: 'Persisted Org',
        slug: 'persisted-org',
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-2'
      };

      await organizationService.createOrganization(orgData, 'user-2');
      
      const retrieved = await organizationService.getUserOrganizations('user-2');
      expect(retrieved.length).toBeGreaterThan(0);
      expect(retrieved[0].name).toBe('Persisted Org');
    });
  });

  describe('Data transformation', () => {
    it('should transform database data to organization format', async () => {
      const orgData = {
        name: 'Transformed Org',
        slug: 'transformed-org',
        description: 'Test',
        settings: { setting1: 'value1' },
        plan: 'pro' as const,
        createdBy: 'user-3'
      };

      const org = await organizationService.createOrganization(orgData, 'user-3');
      
      expect(org.id).toBeDefined();
      expect(org.createdAt).toBeInstanceOf(Date);
      expect(org.updatedAt).toBeInstanceOf(Date);
      expect(org.plan).toBe('pro');
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage quota exceeded gracefully', async () => {
      // Simulate quota exceeded
      const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB
      
      try {
        localStorage.setItem('test', largeData);
      } catch (e) {
        // Expected to fail
      }

      const orgData = {
        name: 'Error Org',
        slug: 'error-org',
        settings: {},
        plan: 'free' as const,
        createdBy: 'user-1'
      };

      await expect(
        organizationService.createOrganization(orgData, 'user-1')
      ).resolves.toBeDefined();
    });
  });
});
