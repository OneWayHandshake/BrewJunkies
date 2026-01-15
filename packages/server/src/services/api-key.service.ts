import { PrismaClient, AIProvider } from '@prisma/client';
import { encryptionService } from './encryption.service.js';
import { getProvider, requiresUserKey, PROVIDERS_REQUIRING_KEY } from './ai-providers/index.js';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

export interface UserApiKeyInfo {
  provider: AIProvider;
  isConfigured: boolean;
  isValid: boolean;
  maskedKey?: string;
  lastUsedAt?: Date;
}

export interface AllUserApiKeysInfo {
  keys: UserApiKeyInfo[];
  preferredProvider: AIProvider;
}

export const apiKeyService = {
  /**
   * Get all API key info for a user
   */
  async getUserApiKeys(userId: string): Promise<AllUserApiKeysInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { apiKeys: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Build info for all providers
    const keysInfo: UserApiKeyInfo[] = PROVIDERS_REQUIRING_KEY.map((provider) => {
      const key = user.apiKeys.find((k) => k.provider === provider);

      if (key) {
        // Decrypt to get masked version
        const decrypted = encryptionService.decrypt({
          encryptedKey: key.encryptedKey,
          keyIv: key.keyIv,
          keyTag: key.keyTag,
        });

        return {
          provider,
          isConfigured: true,
          isValid: key.isValid,
          maskedKey: encryptionService.maskKey(decrypted),
          lastUsedAt: key.lastUsedAt ?? undefined,
        };
      }

      return {
        provider,
        isConfigured: false,
        isValid: false,
      };
    });

    // Add House Blend (always available)
    keysInfo.unshift({
      provider: 'HOUSE_BLEND',
      isConfigured: true,
      isValid: true,
    });

    return {
      keys: keysInfo,
      preferredProvider: user.preferredProvider,
    };
  },

  /**
   * Save or update an API key for a user
   */
  async saveApiKey(
    userId: string,
    provider: AIProvider,
    apiKey: string
  ): Promise<void> {
    if (!requiresUserKey(provider)) {
      throw new AppError(400, 'This provider does not require an API key');
    }

    // Validate key format
    const providerInstance = getProvider(provider);
    if (!providerInstance.validateKeyFormat(apiKey)) {
      throw new AppError(400, `Invalid ${provider} API key format`);
    }

    // Encrypt the key
    const encrypted = encryptionService.encrypt(apiKey);

    // Upsert the key
    await prisma.userApiKey.upsert({
      where: {
        userId_provider: { userId, provider },
      },
      update: {
        encryptedKey: encrypted.encryptedKey,
        keyIv: encrypted.keyIv,
        keyTag: encrypted.keyTag,
        isValid: true, // Will be validated on first use
        updatedAt: new Date(),
      },
      create: {
        userId,
        provider,
        encryptedKey: encrypted.encryptedKey,
        keyIv: encrypted.keyIv,
        keyTag: encrypted.keyTag,
        isValid: true,
      },
    });
  },

  /**
   * Delete an API key for a user
   */
  async deleteApiKey(userId: string, provider: AIProvider): Promise<void> {
    if (!requiresUserKey(provider)) {
      throw new AppError(400, 'This provider does not require an API key');
    }

    // Check if this is the user's preferred provider
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.preferredProvider === provider) {
      // Reset to House Blend
      await prisma.user.update({
        where: { id: userId },
        data: { preferredProvider: 'HOUSE_BLEND' },
      });
    }

    await prisma.userApiKey.deleteMany({
      where: { userId, provider },
    });
  },

  /**
   * Test an API key
   */
  async testApiKey(
    userId: string,
    provider: AIProvider
  ): Promise<{ valid: boolean; message: string }> {
    if (!requiresUserKey(provider)) {
      throw new AppError(400, 'This provider does not require an API key');
    }

    // Get the saved key
    const keyRecord = await prisma.userApiKey.findUnique({
      where: { userId_provider: { userId, provider } },
    });

    if (!keyRecord) {
      return { valid: false, message: 'No API key configured for this provider' };
    }

    // Decrypt the key
    const apiKey = encryptionService.decrypt({
      encryptedKey: keyRecord.encryptedKey,
      keyIv: keyRecord.keyIv,
      keyTag: keyRecord.keyTag,
    });

    // Test the connection
    const providerInstance = getProvider(provider);
    const valid = await providerInstance.testConnection({ apiKey });

    // Update validity status
    await prisma.userApiKey.update({
      where: { id: keyRecord.id },
      data: { isValid: valid },
    });

    return {
      valid,
      message: valid
        ? `${providerInstance.displayName} connection successful`
        : `Failed to connect to ${providerInstance.displayName}. Please check your API key.`,
    };
  },

  /**
   * Set user's preferred provider
   */
  async setPreferredProvider(
    userId: string,
    provider: AIProvider
  ): Promise<void> {
    // If not House Blend, verify the user has a key configured
    if (requiresUserKey(provider)) {
      const keyRecord = await prisma.userApiKey.findUnique({
        where: { userId_provider: { userId, provider } },
      });

      if (!keyRecord) {
        throw new AppError(
          400,
          `You need to configure an API key for ${provider} before setting it as your preferred provider`
        );
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { preferredProvider: provider },
    });
  },

  /**
   * Get the decrypted API key for a user's provider
   */
  async getDecryptedKey(
    userId: string,
    provider: AIProvider
  ): Promise<string | null> {
    if (!requiresUserKey(provider)) {
      return null; // House Blend doesn't need user key
    }

    const keyRecord = await prisma.userApiKey.findUnique({
      where: { userId_provider: { userId, provider } },
    });

    if (!keyRecord) {
      return null;
    }

    // Update last used timestamp
    await prisma.userApiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return encryptionService.decrypt({
      encryptedKey: keyRecord.encryptedKey,
      keyIv: keyRecord.keyIv,
      keyTag: keyRecord.keyTag,
    });
  },
};
