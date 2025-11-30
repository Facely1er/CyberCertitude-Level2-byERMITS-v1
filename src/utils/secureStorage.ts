/**
 * Secure Storage Utility
 * Provides encrypted localStorage/sessionStorage with proper security measures
 */

import { logger } from './logger';

interface StorageOptions {
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
  compress?: boolean;
}

interface StoredData<T = any> {
  data: T;
  timestamp: number;
  ttl?: number;
  encrypted: boolean;
  version: string;
}

class SecureStorage {
  private readonly VERSION = '1.0.0';
  private readonly ENCRYPTION_KEY = this.getOrCreateEncryptionKey();
  private readonly COMPRESSION_THRESHOLD = 1024; // 1KB

  private getOrCreateEncryptionKey(): string {
    // In a real application, this should be derived from user credentials
    // or stored securely on the server
    const key = localStorage.getItem('_secure_key');
    if (!key) {
      const newKey = this.generateKey();
      localStorage.setItem('_secure_key', newKey);
      return newKey;
    }
    return key;
  }

  private generateKey(): string {
    // Generate a secure random key
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async encrypt(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const keyBuffer = encoder.encode(this.ENCRYPTION_KEY.slice(0, 32));
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        dataBuffer
      );

      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...result));
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private async decrypt(encryptedData: string): Promise<string> {
    try {
      const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);

      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(this.ENCRYPTION_KEY.slice(0, 32));

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private compress(data: string): string {
    // Simple compression using LZ-string algorithm
    // In production, consider using a proper compression library
    try {
      return btoa(data);
    } catch {
      return data;
    }
  }

  private decompress(compressedData: string): string {
    try {
      return atob(compressedData);
    } catch {
      return compressedData;
    }
  }

  private isExpired(storedData: StoredData): boolean {
    if (!storedData.ttl) return false;
    return Date.now() - storedData.timestamp > storedData.ttl;
  }

  private validateData(storedData: StoredData): boolean {
    return (
      storedData &&
      typeof storedData === 'object' &&
      storedData.version === this.VERSION &&
      typeof storedData.data !== 'undefined' &&
      typeof storedData.timestamp === 'number' &&
      typeof storedData.encrypted === 'boolean'
    );
  }

  async setItem<T>(
    key: string, 
    value: T, 
    options: StorageOptions = {},
    storage: Storage = localStorage
  ): Promise<void> {
    try {
      const {
        encrypt = true,
        ttl,
        compress = false
      } = options;

      let dataString = JSON.stringify(value);
      
      // Compress if enabled and data is large enough
      if (compress && dataString.length > this.COMPRESSION_THRESHOLD) {
        dataString = this.compress(dataString);
      }

      // Encrypt if enabled
      if (encrypt) {
        dataString = await this.encrypt(dataString);
      }

      const storedData: StoredData<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        encrypted: encrypt,
        version: this.VERSION
      };

      // Store the metadata separately for quick access
      const metadata = {
        timestamp: storedData.timestamp,
        ttl: storedData.ttl,
        encrypted: storedData.encrypted,
        version: storedData.version,
        compressed: compress && dataString.length > this.COMPRESSION_THRESHOLD
      };

      storage.setItem(`_meta_${key}`, JSON.stringify(metadata));
      storage.setItem(key, dataString);

      logger.debug(`Secure storage: Set item ${key}`, { encrypted, ttl, compress });
    } catch (error) {
      logger.error(`Failed to set secure storage item ${key}:`, error);
      throw new Error(`Failed to store data for key: ${key}`);
    }
  }

  async getItem<T>(
    key: string, 
    defaultValue: T | null = null,
    storage: Storage = localStorage
  ): Promise<T | null> {
    try {
      const metadataStr = storage.getItem(`_meta_${key}`);
      if (!metadataStr) {
        return defaultValue;
      }

      const metadata = JSON.parse(metadataStr);
      const dataString = storage.getItem(key);
      
      if (!dataString) {
        return defaultValue;
      }

      // Check if data is expired
      if (metadata.ttl && Date.now() - metadata.timestamp > metadata.ttl) {
        this.removeItem(key, storage);
        return defaultValue;
      }

      let processedData = dataString;

      // Decompress if it was compressed
      if (metadata.compressed) {
        processedData = this.decompress(processedData);
      }

      // Decrypt if it was encrypted
      if (metadata.encrypted) {
        processedData = await this.decrypt(processedData);
      }

      const parsedData = JSON.parse(processedData);
      
      logger.debug(`Secure storage: Retrieved item ${key}`, { 
        encrypted: metadata.encrypted, 
        compressed: metadata.compressed 
      });

      return parsedData;
    } catch (error) {
      logger.error(`Failed to get secure storage item ${key}:`, error);
      // Remove corrupted data
      this.removeItem(key, storage);
      return defaultValue;
    }
  }

  removeItem(key: string, storage: Storage = localStorage): void {
    try {
      storage.removeItem(key);
      storage.removeItem(`_meta_${key}`);
      logger.debug(`Secure storage: Removed item ${key}`);
    } catch (error) {
      logger.error(`Failed to remove secure storage item ${key}:`, error);
    }
  }

  clear(storage: Storage = localStorage): void {
    try {
      const keysToRemove: string[] = [];
      
      // Find all secure storage keys
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && (key.startsWith('_meta_') || this.isSecureStorageKey(key))) {
          keysToRemove.push(key);
        }
      }

      // Remove all secure storage keys
      keysToRemove.forEach(key => storage.removeItem(key));
      
      logger.debug('Secure storage: Cleared all items');
    } catch (error) {
      logger.error('Failed to clear secure storage:', error);
    }
  }

  private isSecureStorageKey(key: string): boolean {
    // Check if this is a secure storage key (not a metadata key)
    return !key.startsWith('_meta_') && !key.startsWith('_secure_');
  }

  // Utility methods for common use cases
  async setAuthToken(token: string, ttl?: number): Promise<void> {
    await this.setItem('auth-token', token, { encrypt: true, ttl });
  }

  async getAuthToken(): Promise<string | null> {
    return await this.getItem('auth-token', null);
  }

  async setUserData<T>(userData: T, ttl?: number): Promise<void> {
    await this.setItem('auth-user', userData, { encrypt: true, ttl });
  }

  async getUserData<T>(): Promise<T | null> {
    return await this.getItem('auth-user', null);
  }

  async setSessionData<T>(key: string, data: T, ttl?: number): Promise<void> {
    await this.setItem(key, data, { encrypt: true, ttl }, sessionStorage);
  }

  async getSessionData<T>(key: string): Promise<T | null> {
    return await this.getItem(key, null, sessionStorage);
  }

  // Clean up expired items
  cleanup(storage: Storage = localStorage): void {
    try {
      const keysToCheck: string[] = [];
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith('_meta_')) {
          keysToCheck.push(key.replace('_meta_', ''));
        }
      }

      keysToCheck.forEach(key => {
        const metadataStr = storage.getItem(`_meta_${key}`);
        if (metadataStr) {
          try {
            const metadata = JSON.parse(metadataStr);
            if (metadata.ttl && Date.now() - metadata.timestamp > metadata.ttl) {
              this.removeItem(key, storage);
            }
          } catch {
            // Remove corrupted metadata
            this.removeItem(key, storage);
          }
        }
      });

      logger.debug('Secure storage: Cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup secure storage:', error);
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

// Export types
export type { StorageOptions, StoredData };
export default secureStorage;