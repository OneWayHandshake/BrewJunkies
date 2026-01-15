import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Loader2,
  Coffee,
  Sparkles,
  MapPin,
  Flame,
  Beaker,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProviderChips } from '@/components/ai/ProviderSelect';
import { useAISettingsStore } from '@/store/aiSettingsStore';
import { uploadImage, getImageUrl } from '@/services/uploadService';
import { api } from '@/services/api';
import {
  ROAST_LEVEL_LABELS,
  PROCESS_METHOD_LABELS,
  COMMON_TASTING_NOTES,
  COFFEE_ORIGINS,
  type RoastLevel,
  type ProcessMethod,
  type AIProviderType,
  type AIAnalysisResult,
  type BrewParameters,
} from '@coffee/shared';

export function CoffeeCreatePage() {
  const navigate = useNavigate();
  const { preferredProvider } = useAISettingsStore();

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // AI Analysis state
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>(preferredProvider);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [origin, setOrigin] = useState('');
  const [region, setRegion] = useState('');
  const [farm, setFarm] = useState('');
  const [altitude, setAltitude] = useState('');
  const [process, setProcess] = useState<ProcessMethod>('WASHED');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('MEDIUM');
  const [roaster, setRoaster] = useState('');
  const [variety, setVariety] = useState('');
  const [tastingNotes, setTastingNotes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [acidity, setAcidity] = useState<number>(5);
  const [body, setBody] = useState<number>(5);
  const [sweetness, setSweetness] = useState<number>(5);
  const [brewParams, setBrewParams] = useState<BrewParameters>({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);

    // Upload immediately
    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setImageId(uploaded.id);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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

      const analysis: AIAnalysisResult = response.data.data.analysis;
      setAnalysisResult(analysis);

      // Auto-populate form fields from analysis
      if (analysis.brandName && !roaster) {
        setRoaster(analysis.brandName);
      }
      if (analysis.coffeeName && !name) {
        setName(analysis.coffeeName);
      }
      if (analysis.roastLevel) {
        setRoastLevel(analysis.roastLevel);
      }
      if (analysis.possibleOrigin) {
        setOrigin(analysis.possibleOrigin);
      }
      // Combine tasting notes from bag with AI predictions
      const allNotes = [
        ...(analysis.tastingNotes || []),
        ...(analysis.tastingNotesLikely || []),
      ].filter((note, index, arr) => arr.indexOf(note) === index);
      if (allNotes.length) {
        setTastingNotes(allNotes);
      }
      if (analysis.flavorProfile && !description) {
        setDescription(analysis.flavorProfile);
      }
      if (analysis.brewParameters) {
        setBrewParams(analysis.brewParameters);
      }
      if (analysis.beanType) {
        setVariety(analysis.beanType);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTastingNote = (note: string) => {
    setTastingNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const addCustomNote = () => {
    if (customNote.trim() && !tastingNotes.includes(customNote.trim())) {
      setTastingNotes((prev) => [...prev, customNote.trim()]);
      setCustomNote('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !origin.trim()) {
      setError('Name and Origin are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const coffeeData = {
        name: name.trim(),
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
        origin: origin.trim(),
        region: region.trim() || undefined,
        farm: farm.trim() || undefined,
        altitude: altitude.trim() || undefined,
        process,
        roastLevel,
        roaster: roaster.trim() || undefined,
        variety: variety.trim() || undefined,
        tastingNotes,
        acidity,
        body,
        sweetness,
        brewParams,
        imageUrl: imageId ? getImageUrl(imageId) : undefined,
      };

      const response = await api.post('/coffees', coffeeData);
      navigate(`/coffees/${response.data.data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create coffee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageId(null);
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold mb-2">Spill the Beans</h1>
          <p className="text-muted-foreground">
            Add a new coffee to your collection. Upload a photo of the coffee bag to auto-fill details with AI, or enter everything manually.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload & AI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Coffee Bag Image & AI Analysis
              </CardTitle>
              <CardDescription>
                Upload a photo of your coffee bag to automatically extract brand, name, origin, roast level, and tasting notes. Or skip this and enter details manually below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-sage bg-sage/5'
                    : 'border-muted-foreground/25 hover:border-sage/50'
                }`}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {isUploading && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                    {imageId && !isUploading && (
                      <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                        <Check className="h-4 w-4" />
                        Image uploaded
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop your coffee bag image here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PNG, JPG, WEBP up to 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {imageId && (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Provider
                    </p>
                    <ProviderChips
                      value={selectedProvider}
                      onChange={setSelectedProvider}
                      disabled={isAnalyzing}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || isUploading}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze & Auto-Fill
                      </>
                    )}
                  </Button>
                </div>
              )}

              {analysisResult && (
                <div className="bg-sage/10 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-sage-dark flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    AI Analysis Complete
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Detected: {analysisResult.roastLevel?.replace('_', '-')} roast
                    {analysisResult.possibleOrigin && ` • Possibly from ${analysisResult.possibleOrigin}`}
                  </p>
                  {analysisResult.observations?.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.observations[0]}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Coffee Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ethiopian Yirgacheffe"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this coffee (flavor profile, characteristics...)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Personal Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Your personal notes, comments, brewing tips, purchase info..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roaster</label>
                  <Input
                    value={roaster}
                    onChange={(e) => setRoaster(e.target.value)}
                    placeholder="e.g., Local Roasters Co."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Variety</label>
                  <Input
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g., Heirloom, Bourbon, SL28"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Origin Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Origin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select origin...</option>
                    {COFFEE_ORIGINS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <Input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g., Sidama, Huehuetenango"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Farm/Producer</label>
                  <Input
                    value={farm}
                    onChange={(e) => setFarm(e.target.value)}
                    placeholder="e.g., Finca El Paraiso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Altitude</label>
                  <Input
                    value={altitude}
                    onChange={(e) => setAltitude(e.target.value)}
                    placeholder="e.g., 1800-2000 masl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roast & Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Roast & Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Roast Level</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ROAST_LEVEL_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRoastLevel(key as RoastLevel)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        roastLevel === key
                          ? 'bg-sage text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Process Method</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PROCESS_METHOD_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProcess(key as ProcessMethod)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        process === key
                          ? 'bg-sage text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasting Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Tasting Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tasting Notes</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_TASTING_NOTES.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => toggleTastingNote(note)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        tastingNotes.includes(note)
                          ? 'bg-terracotta text-white'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Add custom note..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomNote())}
                  />
                  <Button type="button" variant="outline" onClick={addCustomNote}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tastingNotes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Selected:</span>
                    {tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="bg-terracotta/20 text-terracotta-dark px-2 py-0.5 rounded text-sm flex items-center gap-1"
                      >
                        {note}
                        <button type="button" onClick={() => toggleTastingNote(note)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Acidity: {acidity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={acidity}
                    onChange={(e) => setAcidity(Number(e.target.value))}
                    className="w-full accent-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Body: {body}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={body}
                    onChange={(e) => setBody(Number(e.target.value))}
                    className="w-full accent-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sweetness: {sweetness}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sweetness}
                    onChange={(e) => setSweetness(Number(e.target.value))}
                    className="w-full accent-sage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brew Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Brew Parameters</CardTitle>
              <CardDescription>
                Recommended brewing parameters. {analysisResult ? 'Auto-filled from AI - edit as needed.' : 'Enter your preferred settings.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Espresso */}
              <div className="space-y-3">
                <h4 className="font-medium">Espresso</h4>
                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Dose (g)</label>
                    <Input
                      type="number"
                      value={brewParams.espresso?.dose || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        espresso: { ...prev.espresso, dose: Number(e.target.value) || undefined }
                      }))}
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Yield (g)</label>
                    <Input
                      type="number"
                      value={brewParams.espresso?.yield || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        espresso: { ...prev.espresso, yield: Number(e.target.value) || undefined }
                      }))}
                      placeholder="36"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Temp (°C)</label>
                    <Input
                      type="number"
                      value={brewParams.espresso?.temperature || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        espresso: { ...prev.espresso, temperature: Number(e.target.value) || undefined }
                      }))}
                      placeholder="93"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Grind Size</label>
                    <Input
                      value={brewParams.espresso?.grindSize || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        espresso: { ...prev.espresso, grindSize: e.target.value || undefined }
                      }))}
                      placeholder="Fine"
                    />
                  </div>
                </div>
              </div>

              {/* Pour Over */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Pour Over</h4>
                <div className="grid sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Dose (g)</label>
                    <Input
                      type="number"
                      value={brewParams.pourOver?.dose || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        pourOver: { ...prev.pourOver, dose: Number(e.target.value) || undefined }
                      }))}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Water (ml)</label>
                    <Input
                      type="number"
                      value={brewParams.pourOver?.waterAmount || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        pourOver: { ...prev.pourOver, waterAmount: Number(e.target.value) || undefined }
                      }))}
                      placeholder="250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Temp (°C)</label>
                    <Input
                      type="number"
                      value={brewParams.pourOver?.temperature || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        pourOver: { ...prev.pourOver, temperature: Number(e.target.value) || undefined }
                      }))}
                      placeholder="94"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Grind Size</label>
                    <Input
                      value={brewParams.pourOver?.grindSize || ''}
                      onChange={(e) => setBrewParams(prev => ({
                        ...prev,
                        pourOver: { ...prev.pourOver, grindSize: e.target.value || undefined }
                      }))}
                      placeholder="Medium"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/coffees')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Coffee className="mr-2 h-4 w-4" />
                  Add Coffee
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
