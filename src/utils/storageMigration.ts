/**
 * Storage Migration Utility
 * Helps migrate existing localStorage data to secure storage
 */

import { secureStorage } from './secureStorage';
import { logger } from './logger';

interface MigrationRule {
  key: string;
  secureKey: string;
  encrypt: boolean;
  ttl?: number;
  transform?: (data: any) => any;
}

class StorageMigration {
  private readonly MIGRATION_VERSION_KEY = '_migration_version';
  private readonly CURRENT_VERSION = '2.0.0';

  private migrationRules: MigrationRule[] = [
    {
      key: 'auth-token',
      secureKey: 'auth-token',
      encrypt: true,
      ttl: 8 * 60 * 60 * 1000 // 8 hours
    },
    {
      key: 'auth-user',
      secureKey: 'auth-user',
      encrypt: true,
      ttl: 8 * 60 * 60 * 1000 // 8 hours
    },
    {
      key: 'user-profile',
      secureKey: 'user-profile',
      encrypt: true,
      ttl: 24 * 60 * 60 * 1000 // 24 hours
    },
    {
      key: 'organization-data',
      secureKey: 'organization-data',
      encrypt: true,
      ttl: 24 * 60 * 60 * 1000 // 24 hours
    },
    {
      key: 'assessment-data',
      secureKey: 'assessment-data',
      encrypt: true,
      ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    {
      key: 'theme-preference',
      secureKey: 'theme-preference',
      encrypt: false,
      ttl: 365 * 24 * 60 * 60 * 1000 // 1 year
    },
    {
      key: 'ui-preferences',
      secureKey: 'ui-preferences',
      encrypt: false,
      ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  ];

  async migrate(): Promise<boolean> {
    try {
      const currentVersion = localStorage.getItem(this.MIGRATION_VERSION_KEY);
      
      if (currentVersion === this.CURRENT_VERSION) {
        logger.debug('Storage migration: Already up to date');
        return true;
      }

      logger.info('Storage migration: Starting migration to secure storage');

      let migratedCount = 0;
      let errorCount = 0;

      for (const rule of this.migrationRules) {
        try {
          const existingData = localStorage.getItem(rule.key);
          
          if (existingData) {
            let dataToMigrate;
            
            try {
              dataToMigrate = JSON.parse(existingData);
            } catch {
              // If it's not JSON, store as string
              dataToMigrate = existingData;
            }

            // Apply transformation if provided
            if (rule.transform) {
              dataToMigrate = rule.transform(dataToMigrate);
            }

            // Migrate to secure storage
            await secureStorage.setItem(
              rule.secureKey, 
              dataToMigrate, 
              { 
                encrypt: rule.encrypt, 
                ttl: rule.ttl 
              }
            );

            // Remove from old storage
            localStorage.removeItem(rule.key);
            migratedCount++;

            logger.debug(`Storage migration: Migrated ${rule.key} -> ${rule.secureKey}`);
          }
        } catch (error) {
          logger.error(`Storage migration: Failed to migrate ${rule.key}:`, error);
          errorCount++;
        }
      }

      // Mark migration as complete
      localStorage.setItem(this.MIGRATION_VERSION_KEY, this.CURRENT_VERSION);

      // Clean up any remaining old keys that might be sensitive
      this.cleanupOldKeys();

      logger.info(`Storage migration: Completed. Migrated ${migratedCount} items, ${errorCount} errors`);
      
      return errorCount === 0;
    } catch (error) {
      logger.error('Storage migration: Failed to complete migration:', error);
      return false;
    }
  }

  private cleanupOldKeys(): void {
    const sensitiveKeys = [
      'auth-token',
      'auth-user',
      'user-profile',
      'organization-data',
      'assessment-data',
      'session-data',
      'user-preferences'
    ];

    sensitiveKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        logger.debug(`Storage migration: Cleaned up old key ${key}`);
      }
    });
  }

  async rollback(): Promise<void> {
    try {
      logger.warn('Storage migration: Rolling back to insecure storage');
      
      // This is a dangerous operation and should only be used in development
      if (import.meta.env.PROD) {
        throw new Error('Rollback not allowed in production');
      }

      // Clear secure storage
      secureStorage.clear();
      
      // Remove migration version
      localStorage.removeItem(this.MIGRATION_VERSION_KEY);
      
      logger.warn('Storage migration: Rollback completed');
    } catch (error) {
      logger.error('Storage migration: Rollback failed:', error);
      throw error;
    }
  }

  getMigrationStatus(): { version: string | null; isUpToDate: boolean } {
    const version = localStorage.getItem(this.MIGRATION_VERSION_KEY);
    return {
      version,
      isUpToDate: version === this.CURRENT_VERSION
    };
  }
}

// Export singleton instance
export const storageMigration = new StorageMigration();
export default storageMigration;