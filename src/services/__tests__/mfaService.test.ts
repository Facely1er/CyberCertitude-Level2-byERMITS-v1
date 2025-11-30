import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mfaService } from '../mfaService';

// Mock Supabase
const createMockQueryBuilder = () => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      single: vi.fn()
    }))
  })),
  insert: vi.fn(() => ({
    select: vi.fn()
  })),
  update: vi.fn(() => ({
    eq: vi.fn(() => ({
      select: vi.fn()
    }))
  })),
  upsert: vi.fn(() => ({
    select: vi.fn()
  })),
  eq: vi.fn(() => ({
    select: vi.fn()
  }))
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder())
  }
}));

describe('MFAService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isMFARequired', () => {
    it('should return true for privileged roles', () => {
      expect(mfaService.isMFARequired('admin')).toBe(true);
      expect(mfaService.isMFARequired('ciso')).toBe(true);
      expect(mfaService.isMFARequired('compliance-officer')).toBe(true);
      expect(mfaService.isMFARequired('auditor')).toBe(true);
    });

    it('should return false for non-privileged roles', () => {
      expect(mfaService.isMFARequired('user')).toBe(false);
      expect(mfaService.isMFARequired('viewer')).toBe(false);
      expect(mfaService.isMFARequired('guest')).toBe(false);
    });
  });

  describe('getMFAStatus', () => {
    it('should return MFA status for a user', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              enabled: true,
              methods: ['totp'],
              last_used: '2024-01-01T00:00:00Z'
            },
            error: null
          })
        })
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const status = await mfaService.getMFAStatus('user-123', 'admin');

      expect(status.isEnabled).toBe(true);
      expect(status.isRequired).toBe(true);
      expect(status.methods).toEqual(['totp']);
    });

    it('should return default status when no MFA settings found', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }
          })
        })
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const status = await mfaService.getMFAStatus('user-123', 'admin');

      expect(status.isEnabled).toBe(false);
      expect(status.isRequired).toBe(true);
      expect(status.methods).toEqual([]);
    });
  });

  describe('setupMFA', () => {
    it('should setup TOTP MFA', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockUpsert = vi.fn().mockResolvedValue({
        data: {},
        error: null
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        upsert: mockUpsert
      } as any);

      const setup = await mfaService.setupMFA('user-123', 'totp');

      expect(setup.secret).toBeDefined();
      expect(setup.qrCode).toBeDefined();
      expect(setup.backupCodes).toHaveLength(10);
      expect(setup.recoveryCodes).toHaveLength(5);
      expect(mockUpsert).toHaveBeenCalled();
    });

    it('should setup email MFA', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockUpsert = vi.fn().mockResolvedValue({
        data: {},
        error: null
      });
      const mockInsert = vi.fn().mockResolvedValue({
        data: {},
        error: null
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        upsert: mockUpsert,
        insert: mockInsert
      } as any);

      const setup = await mfaService.setupMFA('user-123', 'email');

      expect(setup.backupCodes).toHaveLength(10);
      expect(setup.recoveryCodes).toHaveLength(5);
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('verifyMFA', () => {
    it('should verify TOTP token', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              secret: 'test-secret',
              methods: ['totp']
            },
            error: null
          })
        })
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      const { supabase } = await import('../../lib/supabase');
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        update: mockUpdate
      } as any);

      const isValid = await mfaService.verifyMFA('user-123', {
        token: '123456',
        method: 'totp'
      });

      expect(isValid).toBe(true);
    });

    it('should verify backup code', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              backup_codes: ['ABC12345', 'DEF67890']
            },
            error: null
          })
        })
      });

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      const { supabase } = await import('../../lib/supabase');
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        update: mockUpdate
      } as any);

      const isValid = await mfaService.verifyMFA('user-123', {
        token: '',
        method: 'totp',
        backupCode: 'ABC12345'
      });

      expect(isValid).toBe(true);
    });
  });

  describe('enableMFA', () => {
    it('should enable MFA for a user', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      const { supabase } = await import('../../lib/supabase');
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      await mfaService.enableMFA('user-123');

      expect(mockUpdate).toHaveBeenCalledWith({
        enabled: true,
        grace_period_ends: null
      });
    });
  });

  describe('disableMFA', () => {
    it('should disable MFA for a user', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      const { supabase } = await import('../../lib/supabase');
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      await mfaService.disableMFA('user-123');

      expect(mockUpdate).toHaveBeenCalledWith({
        enabled: false,
        secret: null,
        backup_codes: null,
        recovery_codes: null
      });
    });
  });

  describe('isInGracePeriod', () => {
    it('should return true if user is in grace period', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              enabled: false,
              grace_period_ends: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            },
            error: null
          })
        })
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const inGracePeriod = await mfaService.isInGracePeriod('user-123', 'admin');

      expect(inGracePeriod).toBe(true);
    });

    it('should return false if user is not in grace period', async () => {
      const mockSupabase = await import('../../lib/supabase');
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              enabled: false,
              grace_period_ends: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            error: null
          })
        })
      });

      vi.mocked(mockSupabase.supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const inGracePeriod = await mfaService.isInGracePeriod('user-123', 'admin');

      expect(inGracePeriod).toBe(false);
    });
  });
});