import { useEffect } from 'react';
import { Coffee, Sparkles, ChevronDown, Check } from 'lucide-react';
import type { AIProviderType, AIProviderInfo } from '@coffee/shared';
import { useAISettingsStore } from '@/store/aiSettingsStore';

const providerIcons: Record<AIProviderType, React.ReactNode> = {
  HOUSE_BLEND: <Coffee className="h-4 w-4" />,
  OPENAI: <Sparkles className="h-4 w-4" />,
  CLAUDE: <Sparkles className="h-4 w-4" />,
  GEMINI: <Sparkles className="h-4 w-4" />,
};

interface ProviderSelectProps {
  value: AIProviderType;
  onChange: (value: AIProviderType) => void;
  disabled?: boolean;
}

export function ProviderSelect({ value, onChange, disabled }: ProviderSelectProps) {
  const { providers, userKeys, freeTierUsage, fetchSettings } = useAISettingsStore();

  useEffect(() => {
    if (providers.length === 0) {
      fetchSettings();
    }
  }, [providers.length, fetchSettings]);

  const isProviderAvailable = (provider: AIProviderInfo): boolean => {
    if (provider.name === 'HOUSE_BLEND') {
      return (freeTierUsage?.remaining ?? 0) > 0;
    }
    const keyInfo = userKeys.find((k) => k.provider === provider.name);
    return keyInfo?.isConfigured ?? false;
  };

  const getProviderStatus = (provider: AIProviderInfo): string => {
    if (provider.name === 'HOUSE_BLEND') {
      if (!freeTierUsage) return '';
      return `${freeTierUsage.remaining}/${freeTierUsage.limit} left today`;
    }
    const keyInfo = userKeys.find((k) => k.provider === provider.name);
    if (!keyInfo?.isConfigured) return 'Add key in profile';
    return provider.model;
  };

  const selectedProvider = providers.find((p) => p.name === value);

  return (
    <div className="relative">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as AIProviderType)}
          disabled={disabled || providers.length === 0}
          className="w-full appearance-none bg-background border border-input rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {providers.map((provider) => (
            <option
              key={provider.name}
              value={provider.name}
              disabled={!isProviderAvailable(provider)}
            >
              {provider.displayName}
              {!isProviderAvailable(provider) && ' (unavailable)'}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
          {selectedProvider && providerIcons[selectedProvider.name]}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {selectedProvider && (
        <p className="text-xs text-muted-foreground mt-1">
          {getProviderStatus(selectedProvider)}
        </p>
      )}
    </div>
  );
}

interface ProviderChipsProps {
  value: AIProviderType;
  onChange: (value: AIProviderType) => void;
  disabled?: boolean;
}

export function ProviderChips({ value, onChange, disabled }: ProviderChipsProps) {
  const { providers, userKeys, freeTierUsage, fetchSettings } = useAISettingsStore();

  useEffect(() => {
    if (providers.length === 0) {
      fetchSettings();
    }
  }, [providers.length, fetchSettings]);

  const isProviderAvailable = (provider: AIProviderInfo): boolean => {
    if (provider.name === 'HOUSE_BLEND') {
      return (freeTierUsage?.remaining ?? 0) > 0;
    }
    const keyInfo = userKeys.find((k) => k.provider === provider.name);
    return keyInfo?.isConfigured ?? false;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {providers.map((provider) => {
        const available = isProviderAvailable(provider);
        const selected = value === provider.name;

        return (
          <button
            key={provider.name}
            type="button"
            onClick={() => available && onChange(provider.name)}
            disabled={disabled || !available}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200
              ${
                selected
                  ? 'bg-sage text-white shadow-soft'
                  : available
                  ? 'bg-muted hover:bg-muted/80 text-foreground'
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            {providerIcons[provider.name]}
            <span>{provider.displayName}</span>
            {selected && <Check className="h-3 w-3" />}
          </button>
        );
      })}
    </div>
  );
}
