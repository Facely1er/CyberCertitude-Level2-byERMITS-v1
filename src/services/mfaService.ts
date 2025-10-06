import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';

interface MFAConfig {
  enabled: boolean;
  requiredForRoles: string[];
  methods: ('totp' | 'sms' | 'email')[];
  backupCodes: boolean;
  gracePeriod: number; // days
}

interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  recoveryCodes: string[];
}

interface MFAVerification {
  token: string;
  method: 'totp' | 'sms' | 'email';
  backupCode?: string;
}

interface MFAStatus {
  isEnabled: boolean;
  isRequired: boolean;
  methods: string[];
  lastUsed?: Date;
  gracePeriodEnds?: Date;
}

class MFAService {
  private static instance: MFAService;
  private config: MFAConfig;

  private constructor() {
    this.config = {
      enabled: true,
      requiredForRoles: ['admin', 'ciso', 'compliance-officer', 'auditor'],
      methods: ['totp', 'email'],
      backupCodes: true,
      gracePeriod: 30 // 30 days grace period
    };
  }

  static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  // Check if MFA is required for a user role
  isMFARequired(role: string): boolean {
    return this.config.enabled && this.config.requiredForRoles.includes(role);
  }

  // Get MFA status for a user
  async getMFAStatus(userId: string, role: string): Promise<MFAStatus> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const isRequired = this.isMFARequired(role);
      const isEnabled = data?.enabled || false;
      const gracePeriodEnds = data?.grace_period_ends ? new Date(data.grace_period_ends) : undefined;

      return {
        isEnabled,
        isRequired,
        methods: data?.methods || [],
        lastUsed: data?.last_used ? new Date(data.last_used) : undefined,
        gracePeriodEnds
      };
    } catch (error) {
      logger.error('Failed to get MFA status:', error);
      throw error;
    }
  }

  // Setup MFA for a user
  async setupMFA(userId: string, method: 'totp' | 'email'): Promise<MFASetup> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      let setup: MFASetup;

      if (method === 'totp') {
        setup = await this.setupTOTP(userId);
      } else if (method === 'email') {
        setup = await this.setupEmailMFA(userId);
      } else {
        throw new Error('Unsupported MFA method');
      }

      // Store MFA setup in database
      const { error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          enabled: false, // Will be enabled after verification
          methods: [method],
          secret: method === 'totp' ? setup.secret : null,
          backup_codes: setup.backupCodes,
          recovery_codes: setup.recoveryCodes,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      return setup;
    } catch (error) {
      logger.error('Failed to setup MFA:', error);
      throw error;
    }
  }

  // Verify MFA token
  async verifyMFA(userId: string, verification: MFAVerification): Promise<boolean> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      let isValid = false;

      if (verification.method === 'totp') {
        isValid = await this.verifyTOTP(data.secret, verification.token);
      } else if (verification.method === 'email') {
        isValid = await this.verifyEmailToken(userId, verification.token);
      } else if (verification.backupCode) {
        isValid = await this.verifyBackupCode(data.backup_codes, verification.backupCode);
      }

      if (isValid) {
        // Update last used timestamp
        await supabase
          .from('user_mfa_settings')
          .update({ last_used: new Date().toISOString() })
          .eq('user_id', userId);
      }

      return isValid;
    } catch (error) {
      logger.error('Failed to verify MFA:', error);
      throw error;
    }
  }

  // Enable MFA after successful verification
  async enableMFA(userId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('user_mfa_settings')
        .update({ 
          enabled: true,
          grace_period_ends: null // Clear grace period
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      logger.info('MFA enabled for user:', userId);
    } catch (error) {
      logger.error('Failed to enable MFA:', error);
      throw error;
    }
  }

  // Disable MFA
  async disableMFA(userId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('user_mfa_settings')
        .update({ 
          enabled: false,
          secret: null,
          backup_codes: null,
          recovery_codes: null
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      logger.info('MFA disabled for user:', userId);
    } catch (error) {
      logger.error('Failed to disable MFA:', error);
      throw error;
    }
  }

  // Generate backup codes
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateRandomCode(8));
    }
    return codes;
  }

  // Generate recovery codes
  private generateRecoveryCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 5; i++) {
      codes.push(this.generateRandomCode(12));
    }
    return codes;
  }

  // Generate random code
  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Setup TOTP (Time-based One-Time Password)
  private async setupTOTP(userId: string): Promise<MFASetup> {
    // In a real implementation, you would use a library like 'otplib' or 'speakeasy'
    // For now, we'll generate a mock secret
    const secret = this.generateRandomCode(32);
    const qrCode = `otpauth://totp/CyberCertitude:${userId}?secret=${secret}&issuer=CyberCertitude`;
    
    return {
      secret,
      qrCode,
      backupCodes: this.generateBackupCodes(),
      recoveryCodes: this.generateRecoveryCodes()
    };
  }

  // Setup Email MFA
  private async setupEmailMFA(userId: string): Promise<MFASetup> {
    // Send verification email
    await this.sendMFAEmail(userId);
    
    return {
      secret: '',
      qrCode: '',
      backupCodes: this.generateBackupCodes(),
      recoveryCodes: this.generateRecoveryCodes()
    };
  }

  // Verify TOTP token
  private async verifyTOTP(secret: string, token: string): Promise<boolean> {
    // In a real implementation, you would use a library like 'otplib' or 'speakeasy'
    // For now, we'll do a simple validation
    return token.length === 6 && /^\d{6}$/.test(token);
  }

  // Verify email token
  private async verifyEmailToken(userId: string, token: string): Promise<boolean> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('mfa_email_tokens')
        .select('*')
        .eq('user_id', userId)
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        return false;
      }

      // Mark token as used
      await supabase
        .from('mfa_email_tokens')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', data.id);

      return true;
    } catch (error) {
      logger.error('Failed to verify email token:', error);
      return false;
    }
  }

  // Verify backup code
  private async verifyBackupCode(backupCodes: string[], code: string): Promise<boolean> {
    return backupCodes.includes(code);
  }

  // Send MFA email
  private async sendMFAEmail(userId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const token = this.generateRandomCode(6);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store token in database
      await supabase
        .from('mfa_email_tokens')
        .insert({
          user_id: userId,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });

      // In a real implementation, you would send an actual email
      logger.info(`MFA email token for user ${userId}: ${token}`);
    } catch (error) {
      logger.error('Failed to send MFA email:', error);
      throw error;
    }
  }

  // Check if user is in grace period
  async isInGracePeriod(userId: string, role: string): Promise<boolean> {
    if (!this.isMFARequired(role)) {
      return false;
    }

    const status = await this.getMFAStatus(userId, role);
    return status.gracePeriodEnds ? new Date() < status.gracePeriodEnds : false;
  }

  // Start grace period for new privileged users
  async startGracePeriod(userId: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const gracePeriodEnds = new Date(Date.now() + this.config.gracePeriod * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          enabled: false,
          grace_period_ends: gracePeriodEnds.toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      logger.info(`Grace period started for user ${userId}, ends at ${gracePeriodEnds}`);
    } catch (error) {
      logger.error('Failed to start grace period:', error);
      throw error;
    }
  }
}

export const mfaService = MFAService.getInstance();