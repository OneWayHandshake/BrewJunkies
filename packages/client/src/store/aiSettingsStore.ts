import { create } from 'zustand';
import type {
  AIProviderType,
  AIProviderInfo,
  UserApiKeyInfo,
  FreeTierUsage,
} from '@coffee/shared';
import { api } from '@/services/api';

interface AISettingsState {
  providers: AIProviderInfo[];
  userKeys: UserApiKeyInfo[];
  preferredProvider: AIProviderType;
  freeTierUsage: FreeTierUsage | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSettings: () => Promise<void>;
  saveApiKey: (provider: AIProviderType, apiKey: string) => Promise<void>;
  deleteApiKey: (provider: AIProviderType) => Promise<void>;
  testApiKey: (provider: AIProviderType) => Promise<{ valid: boolean; message: string }>;
  setPreferredProvider: (provider: AIProviderType) => Promise<void>;
  fetchUsage: () => Promise<void>;
}

export const useAISettingsStore = create<AISettingsState>()((set, get) => ({
  providers: [],
  userKeys: [],
  preferredProvider: 'HOUSE_BLEND',
  freeTierUsage: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/analyze/providers');
      const { providers, userConfig, freeTierUsage } = response.data.data;

      set({
        providers,
        userKeys: userConfig?.keys || [],
        preferredProvider: userConfig?.preferredProvider || 'HOUSE_BLEND',
        freeTierUsage,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load AI settings',
      });
    }
  },

  saveApiKey: async (provider: AIProviderType, apiKey: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/keys/${provider}`, { apiKey });
      // Refresh settings to get updated state
      await get().fetchSettings();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to save API key';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  deleteApiKey: async (provider: AIProviderType) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/keys/${provider}`);
      // Refresh settings to get updated state
      await get().fetchSettings();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete API key';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  testApiKey: async (provider: AIProviderType) => {
    try {
      const response = await api.post(`/keys/${provider}/test`);
      return response.data.data;
    } catch (error: any) {
      return {
        valid: false,
        message: error?.response?.data?.message || 'Failed to test API key',
      };
    }
  },

  setPreferredProvider: async (provider: AIProviderType) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch('/keys/preferred', { provider });
      set({ preferredProvider: provider, isLoading: false });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to set preferred provider';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchUsage: async () => {
    try {
      const response = await api.get('/keys/usage');
      set({ freeTierUsage: response.data.data });
    } catch (error) {
      // Silently fail - usage info is not critical
    }
  },
}));
