import { useEffect, useState } from 'react';
import {
  Key,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  Coffee,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { AIProviderType } from '@coffee/shared';
import { useAISettingsStore } from '@/store/aiSettingsStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const providerIcons: Record<AIProviderType, React.ReactNode> = {
  HOUSE_BLEND: <Coffee className="h-5 w-5" />,
  OPENAI: <Sparkles className="h-5 w-5" />,
  CLAUDE: <Sparkles className="h-5 w-5" />,
  GEMINI: <Sparkles className="h-5 w-5" />,
};

const providerColors: Record<AIProviderType, string> = {
  HOUSE_BLEND: 'bg-sage/20 text-sage-dark',
  OPENAI: 'bg-emerald-100 text-emerald-700',
  CLAUDE: 'bg-orange-100 text-orange-700',
  GEMINI: 'bg-blue-100 text-blue-700',
};

interface ApiKeyInputProps {
  provider: AIProviderType;
  isConfigured: boolean;
  maskedKey?: string;
  onSave: (key: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onTest: () => Promise<{ valid: boolean; message: string }>;
}

function ApiKeyInput({
  provider,
  isConfigured,
  maskedKey,
  onSave,
  onDelete,
  onTest,
}: ApiKeyInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [keyValue, setKeyValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);

  const handleSave = async () => {
    if (!keyValue.trim()) return;
    setIsLoading(true);
    try {
      await onSave(keyValue);
      setKeyValue('');
      setIsEditing(false);
      setTestResult(null);
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
      setTestResult(null);
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await onTest();
      setTestResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? 'text' : 'password'}
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="Paste your API key..."
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button onClick={handleSave} disabled={isLoading || !keyValue.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIsEditing(false);
              setKeyValue('');
            }}
          >
            Cancel
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your API key is encrypted and stored securely. It will never be shared.
        </p>
      </div>
    );
  }

  if (isConfigured) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
            {maskedKey}
          </code>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Change
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {testResult && (
          <div
            className={`flex items-center gap-2 text-sm ${
              testResult.valid ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {testResult.valid ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {testResult.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={() => setIsEditing(true)}>
      <Key className="h-4 w-4 mr-2" />
      Add API Key
    </Button>
  );
}

export function AISettingsPanel() {
  const {
    providers,
    userKeys,
    preferredProvider,
    freeTierUsage,
    isLoading,
    error,
    fetchSettings,
    saveApiKey,
    deleteApiKey,
    testApiKey,
    setPreferredProvider,
  } = useAISettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getKeyInfo = (provider: AIProviderType) =>
    userKeys.find((k) => k.provider === provider);

  if (isLoading && providers.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Settings
        </CardTitle>
        <CardDescription>
          Configure AI providers for bean analysis. Use House Blend for free or add your own API keys for unlimited access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Free Tier Usage */}
        {freeTierUsage && (
          <div className="bg-sage/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">House Blend Usage Today</span>
              <span className="text-sm text-muted-foreground">
                {freeTierUsage.used} / {freeTierUsage.limit} analyses
              </span>
            </div>
            <div className="w-full bg-sage/20 rounded-full h-2">
              <div
                className="bg-sage h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((freeTierUsage.used / freeTierUsage.limit) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Resets at midnight UTC. Add your own API key for unlimited analyses.
            </p>
          </div>
        )}

        {/* Provider List */}
        <div className="space-y-4">
          {providers.map((provider) => {
            const keyInfo = getKeyInfo(provider.name);
            const isPreferred = preferredProvider === provider.name;
            const isHouseBlend = provider.name === 'HOUSE_BLEND';

            return (
              <div
                key={provider.name}
                className={`border rounded-lg p-4 ${
                  isPreferred ? 'border-sage bg-sage/5' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${providerColors[provider.name]}`}
                    >
                      {providerIcons[provider.name]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{provider.displayName}</h4>
                        {isPreferred && (
                          <span className="text-xs bg-sage text-white px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {provider.model}
                      </p>
                    </div>
                  </div>
                  {!isPreferred && (keyInfo?.isConfigured || isHouseBlend) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreferredProvider(provider.name)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>

                {!isHouseBlend && (
                  <ApiKeyInput
                    provider={provider.name}
                    isConfigured={keyInfo?.isConfigured ?? false}
                    maskedKey={keyInfo?.maskedKey}
                    onSave={(key) => saveApiKey(provider.name, key)}
                    onDelete={() => deleteApiKey(provider.name)}
                    onTest={() => testApiKey(provider.name)}
                  />
                )}

                {isHouseBlend && (
                  <p className="text-sm text-muted-foreground">
                    Free tier with daily limits. No API key required.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
