import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.API_KEY_ENCRYPTION_SECRET;
  if (!key || key.length !== 64) {
    throw new Error(
      'API_KEY_ENCRYPTION_SECRET must be a 64-character hex string (32 bytes). ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(key, 'hex');
}

export interface EncryptedData {
  encryptedKey: string;
  keyIv: string;
  keyTag: string;
}

export const encryptionService = {
  /**
   * Encrypts a plaintext API key using AES-256-GCM
   */
  encrypt(plaintext: string): EncryptedData {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encryptedKey: encrypted,
      keyIv: iv.toString('hex'),
      keyTag: authTag.toString('hex'),
    };
  },

  /**
   * Decrypts an encrypted API key using AES-256-GCM
   */
  decrypt(encryptedData: EncryptedData): string {
    const key = getEncryptionKey();
    const iv = Buffer.from(encryptedData.keyIv, 'hex');
    const authTag = Buffer.from(encryptedData.keyTag, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData.encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  },

  /**
   * Masks an API key for display purposes (shows first 4 and last 4 characters)
   */
  maskKey(key: string): string {
    if (key.length <= 12) {
      return '****';
    }
    return `${key.slice(0, 4)}${'*'.repeat(Math.min(key.length - 8, 20))}${key.slice(-4)}`;
  },
};
