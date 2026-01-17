import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, Coffee, ThermometerSun, Clock, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { uploadImage } from '@/services/uploadService';
import { api } from '@/services/api';
import { ProviderChips } from '@/components/ai/ProviderSelect';
import { useAISettingsStore } from '@/store/aiSettingsStore';
import type { AIAnalysisResult, AIProviderType } from '@coffee/shared';

export function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('HOUSE_BLEND');
  const [usedProvider, setUsedProvider] = useState<string | null>(null);

  const { preferredProvider, fetchSettings } = useAISettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setSelectedProvider(preferredProvider);
  }, [preferredProvider]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setImageId(null);

      // Upload immediately
      setIsUploading(true);
      try {
        const uploaded = await uploadImage(selectedFile);
        setImageId(uploaded.id);
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!imageId) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await api.post('/analyze', {
        imageId,
        provider: selectedProvider,
      });
      setResult(response.data.data.analysis);
      setUsedProvider(response.data.data.providerDisplayName);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Analysis failed. Please try again.';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setPreview(null);
    setImageId(null);
    setResult(null);
    setError(null);
    setUsedProvider(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Beanalysis</h1>
          <p className="text-muted-foreground">
            Snap your beans, scan your bags. Get instant roast identification, personalized
            brew parameters, and one-tap import to your collection.
          </p>
        </div>

        {!result ? (
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">{file?.name}</p>
                    {isUploading && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    )}
                    {imageId && (
                      <p className="text-sm text-green-600">Image uploaded successfully</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop your coffee bean image here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PNG, JPG, WEBP up to 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}

              {preview && (
                <div className="mt-6 space-y-4">
                  {/* Provider Selection */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Choose AI Provider
                    </p>
                    <ProviderChips
                      value={selectedProvider}
                      onChange={setSelectedProvider}
                      disabled={isAnalyzing}
                    />
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={resetAnalysis}>
                      Choose Different Image
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || isUploading || !imageId}
                    >
                      {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Run Beanalysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                {usedProvider && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Sparkles className="h-3 w-3" />
                    Analyzed with {usedProvider}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={resetAnalysis}>
                New Beanalysis
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image */}
              <Card>
                <CardContent className="p-4">
                  <img
                    src={preview!}
                    alt="Analyzed beans"
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Beanalysis Results
                  </CardTitle>
                  <CardDescription>
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Roast Level</p>
                    <p className="font-medium">
                      {result.roastLevel?.replace('_', '-')} (
                      {(result.roastLevelConfidence * 100).toFixed(0)}% confidence)
                    </p>
                  </div>
                  {result.beanType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bean Type</p>
                      <p className="font-medium">{result.beanType}</p>
                    </div>
                  )}
                  {result.possibleOrigin && (
                    <div>
                      <p className="text-sm text-muted-foreground">Possible Origin</p>
                      <p className="font-medium">{result.possibleOrigin}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Likely Tasting Notes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.tastingNotesLikely.map((note) => (
                        <span
                          key={note}
                          className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Observations */}
            <Card>
              <CardHeader>
                <CardTitle>Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.observations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <Card className="border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="text-yellow-600">Warnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2 text-yellow-700">
                        <span>⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Brew Parameters */}
            {result.brewParameters.espresso && (
              <Card>
                <CardHeader>
                  <CardTitle>Espresso Parameters</CardTitle>
                  <CardDescription>Recommended settings based on roast analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dose / Yield</p>
                        <p className="font-medium">
                          {result.brewParameters.espresso.dose}g /{' '}
                          {result.brewParameters.espresso.yield}g
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">
                          {result.brewParameters.espresso.temperature}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pull Time</p>
                        <p className="font-medium">
                          {result.brewParameters.espresso.pullTime.min}-
                          {result.brewParameters.espresso.pullTime.max}s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono text-lg">⚙</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Grind</p>
                        <p className="font-medium">{result.brewParameters.espresso.grindSize}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pour Over Parameters */}
            {result.brewParameters.pourOver && (
              <Card>
                <CardHeader>
                  <CardTitle>Pour Over Parameters</CardTitle>
                  <CardDescription>Recommended settings for V60, Chemex, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Scale className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Dose / Water</p>
                        <p className="font-medium">
                          {result.brewParameters.pourOver.dose}g /{' '}
                          {result.brewParameters.pourOver.waterAmount}ml
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">
                          {result.brewParameters.pourOver.temperature}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Time</p>
                        <p className="font-medium">
                          {Math.floor(result.brewParameters.pourOver.totalTime.min / 60)}:
                          {(result.brewParameters.pourOver.totalTime.min % 60).toString().padStart(2, '0')}-
                          {Math.floor(result.brewParameters.pourOver.totalTime.max / 60)}:
                          {(result.brewParameters.pourOver.totalTime.max % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono text-lg">⚙</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Grind</p>
                        <p className="font-medium">{result.brewParameters.pourOver.grindSize}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button>Save Beanalysis to Profile</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
