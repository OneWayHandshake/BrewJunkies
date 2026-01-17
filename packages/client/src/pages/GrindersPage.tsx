import { useState, useEffect } from 'react';
import {
  Loader2,
  Plus,
  Settings,
  Lightbulb,
  Coffee,
  X,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { GrinderCard } from '@/components/grinder/GrinderCard';
import { GrindSettingCard } from '@/components/grinder/GrindSettingCard';
import { GrindSuggestionCard } from '@/components/grinder/GrindSuggestionCard';
import { api } from '@/services/api';
import {
  BrewMethod,
  BREW_METHOD_LABELS,
  type GrinderListItem,
  type GrindSettingListItem,
  type GrindSuggestion,
  type CoffeeListItem,
  type CreateGrinderData,
  type CreateGrindSettingData,
} from '@coffee/shared';

export function GrindersPage() {
  // Grinders state
  const [grinders, setGrinders] = useState<GrinderListItem[]>([]);
  const [selectedGrinder, setSelectedGrinder] = useState<GrinderListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Grind settings state
  const [grindSettings, setGrindSettings] = useState<GrindSettingListItem[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<BrewMethod | ''>('');

  // Suggestions state
  const [suggestions, setSuggestions] = useState<GrindSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionCoffeeId, setSuggestionCoffeeId] = useState('');
  const [suggestionMethod, setSuggestionMethod] = useState<BrewMethod>('POUR_OVER');

  // Coffee list for selection
  const [coffees, setCoffees] = useState<CoffeeListItem[]>([]);
  const [coffeeSearch, setCoffeeSearch] = useState('');
  const [showCoffeeDropdown, setShowCoffeeDropdown] = useState(false);

  // Dialog states
  const [showGrinderDialog, setShowGrinderDialog] = useState(false);
  const [showSettingDialog, setShowSettingDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'grinder' | 'setting';
    id: string;
  } | null>(null);
  const [editingGrinder, setEditingGrinder] = useState<GrinderListItem | null>(null);
  const [editingSetting, setEditingSetting] = useState<GrindSettingListItem | null>(null);

  // Grinder form state
  const [grinderForm, setGrinderForm] = useState<CreateGrinderData>({
    name: '',
    brand: '',
    model: '',
    burrType: '',
    notes: '',
  });

  // Setting form state
  const [settingForm, setSettingForm] = useState({
    setting: '',
    brewMethod: 'POUR_OVER' as BrewMethod,
    coffeeId: '',
    notes: '',
    rating: null as number | null,
    isDialedIn: false,
  });
  const [settingCoffeeSearch, setSettingCoffeeSearch] = useState('');
  const [showSettingCoffeeDropdown, setShowSettingCoffeeDropdown] = useState(false);

  // Load grinders and coffees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [grindersRes, coffeesRes] = await Promise.all([
          api.get('/grinders'),
          api.get('/coffees?limit=100'),
        ]);
        setGrinders(grindersRes.data.data);
        setCoffees(coffeesRes.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load grinders');
        console.error('Error fetching grinders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Load settings when grinder or method changes
  useEffect(() => {
    if (!selectedGrinder) {
      setGrindSettings([]);
      return;
    }

    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const params = new URLSearchParams();
        params.append('grinderId', selectedGrinder.id);
        if (selectedMethod) params.append('brewMethod', selectedMethod);

        const response = await api.get(`/grinders/settings/all?${params.toString()}`);
        setGrindSettings(response.data.data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, [selectedGrinder, selectedMethod]);

  // Fetch suggestions
  const fetchSuggestions = async () => {
    if (!selectedGrinder || !suggestionMethod) return;

    try {
      setSuggestionsLoading(true);
      const params = new URLSearchParams();
      params.append('brewMethod', suggestionMethod);
      params.append('grinderId', selectedGrinder.id);
      if (suggestionCoffeeId) params.append('coffeeId', suggestionCoffeeId);

      const response = await api.get(`/grinders/settings/suggestions?${params.toString()}`);
      setSuggestions(response.data.data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Filter coffees by search
  const filteredCoffees = coffees.filter(
    (c) =>
      c.name.toLowerCase().includes(coffeeSearch.toLowerCase()) ||
      c.origin.toLowerCase().includes(coffeeSearch.toLowerCase())
  );

  const settingFilteredCoffees = coffees.filter(
    (c) =>
      c.name.toLowerCase().includes(settingCoffeeSearch.toLowerCase()) ||
      c.origin.toLowerCase().includes(settingCoffeeSearch.toLowerCase())
  );

  // Grinder CRUD
  const handleSaveGrinder = async () => {
    try {
      if (editingGrinder) {
        const response = await api.patch(`/grinders/${editingGrinder.id}`, grinderForm);
        setGrinders((prev) =>
          prev.map((g) => (g.id === editingGrinder.id ? { ...g, ...response.data.data } : g))
        );
        if (selectedGrinder?.id === editingGrinder.id) {
          setSelectedGrinder({ ...selectedGrinder, ...response.data.data });
        }
      } else {
        const response = await api.post('/grinders', grinderForm);
        setGrinders((prev) => [{ ...response.data.data, settingsCount: 0 }, ...prev]);
      }
      setShowGrinderDialog(false);
      resetGrinderForm();
    } catch (err: any) {
      console.error('Error saving grinder:', err);
    }
  };

  const handleDeleteGrinder = async (id: string) => {
    try {
      await api.delete(`/grinders/${id}`);
      setGrinders((prev) => prev.filter((g) => g.id !== id));
      if (selectedGrinder?.id === id) {
        setSelectedGrinder(null);
      }
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting grinder:', err);
    }
  };

  // Setting CRUD
  const handleSaveSetting = async () => {
    if (!selectedGrinder) return;

    try {
      const data: CreateGrindSettingData = {
        setting: settingForm.setting,
        brewMethod: settingForm.brewMethod,
        grinderId: selectedGrinder.id,
        coffeeId: settingForm.coffeeId || undefined,
        notes: settingForm.notes || undefined,
        rating: settingForm.rating || undefined,
        isDialedIn: settingForm.isDialedIn,
      };

      if (editingSetting) {
        const response = await api.patch(`/grinders/settings/${editingSetting.id}`, data);
        setGrindSettings((prev) =>
          prev.map((s) => (s.id === editingSetting.id ? response.data.data : s))
        );
      } else {
        const response = await api.post('/grinders/settings', data);
        setGrindSettings((prev) => [response.data.data, ...prev]);
        // Update grinder settings count
        setGrinders((prev) =>
          prev.map((g) =>
            g.id === selectedGrinder.id ? { ...g, settingsCount: g.settingsCount + 1 } : g
          )
        );
      }
      setShowSettingDialog(false);
      resetSettingForm();
    } catch (err: any) {
      console.error('Error saving setting:', err);
    }
  };

  const handleDeleteSetting = async (id: string) => {
    try {
      await api.delete(`/grinders/settings/${id}`);
      setGrindSettings((prev) => prev.filter((s) => s.id !== id));
      // Update grinder settings count
      if (selectedGrinder) {
        setGrinders((prev) =>
          prev.map((g) =>
            g.id === selectedGrinder.id ? { ...g, settingsCount: g.settingsCount - 1 } : g
          )
        );
      }
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting setting:', err);
    }
  };

  const handleToggleDialedIn = async (setting: GrindSettingListItem) => {
    try {
      const response = await api.patch(`/grinders/settings/${setting.id}`, {
        isDialedIn: !setting.isDialedIn,
      });
      setGrindSettings((prev) =>
        prev.map((s) => {
          if (s.id === setting.id) {
            return response.data.data;
          }
          // If we're marking one as dialed in, unmark others with same combo
          if (
            !setting.isDialedIn &&
            s.brewMethod === setting.brewMethod &&
            s.coffee?.id === setting.coffee?.id
          ) {
            return { ...s, isDialedIn: false };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Error toggling dialed in:', err);
    }
  };

  const resetGrinderForm = () => {
    setGrinderForm({ name: '', brand: '', model: '', burrType: '', notes: '' });
    setEditingGrinder(null);
  };

  const resetSettingForm = () => {
    setSettingForm({
      setting: '',
      brewMethod: 'POUR_OVER',
      coffeeId: '',
      notes: '',
      rating: null,
      isDialedIn: false,
    });
    setSettingCoffeeSearch('');
    setEditingSetting(null);
  };

  const openEditGrinder = (grinder: GrinderListItem) => {
    setEditingGrinder(grinder);
    setGrinderForm({
      name: grinder.name,
      brand: grinder.brand || '',
      model: grinder.model || '',
      burrType: grinder.burrType || '',
      notes: '',
    });
    setShowGrinderDialog(true);
  };

  const openEditSetting = (setting: GrindSettingListItem) => {
    setEditingSetting(setting);
    setSettingForm({
      setting: setting.setting,
      brewMethod: setting.brewMethod,
      coffeeId: setting.coffee?.id || '',
      notes: setting.notes || '',
      rating: setting.rating,
      isDialedIn: setting.isDialedIn,
    });
    setShowSettingDialog(true);
  };

  const selectedCoffee = coffees.find((c) => c.id === suggestionCoffeeId);
  const selectedSettingCoffee = coffees.find((c) => c.id === settingForm.coffeeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold mb-2">Grinder Dial-in</h1>
        <p className="text-muted-foreground">
          Track your grind settings and get suggestions for new coffees.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Grinders List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Grinders
            </h2>
            <Button
              size="sm"
              onClick={() => {
                resetGrinderForm();
                setShowGrinderDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {grinders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No grinders added yet.</p>
                <Button
                  onClick={() => {
                    resetGrinderForm();
                    setShowGrinderDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Grinder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {grinders.map((grinder) => (
                <GrinderCard
                  key={grinder.id}
                  grinder={grinder}
                  isSelected={selectedGrinder?.id === grinder.id}
                  onSelect={setSelectedGrinder}
                  onEdit={openEditGrinder}
                  onDelete={(g) => setShowDeleteConfirm({ type: 'grinder', id: g.id })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Grind Settings & Suggestions */}
        <div className="lg:col-span-2 space-y-8">
          {selectedGrinder ? (
            <>
              {/* Suggestion Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Get Grind Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Brew Method</Label>
                      <select
                        value={suggestionMethod}
                        onChange={(e) => setSuggestionMethod(e.target.value as BrewMethod)}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Coffee (Optional)</Label>
                      <div className="relative">
                        <Input
                          placeholder="Search coffees..."
                          value={coffeeSearch}
                          onChange={(e) => {
                            setCoffeeSearch(e.target.value);
                            setShowCoffeeDropdown(true);
                          }}
                          onFocus={() => setShowCoffeeDropdown(true)}
                        />
                        {showCoffeeDropdown && coffeeSearch && filteredCoffees.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-auto">
                            {filteredCoffees.slice(0, 8).map((coffee) => (
                              <button
                                key={coffee.id}
                                type="button"
                                className="w-full px-3 py-2 text-left hover:bg-muted flex flex-col"
                                onClick={() => {
                                  setSuggestionCoffeeId(coffee.id);
                                  setCoffeeSearch('');
                                  setShowCoffeeDropdown(false);
                                }}
                              >
                                <span className="font-medium text-sm">{coffee.name}</span>
                                <span className="text-xs text-muted-foreground">{coffee.origin}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {selectedCoffee && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded text-sm">
                          <Coffee className="h-4 w-4" />
                          <span>{selectedCoffee.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-5 w-5 p-0"
                            onClick={() => setSuggestionCoffeeId('')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button onClick={fetchSuggestions} disabled={suggestionsLoading}>
                    {suggestionsLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Lightbulb className="h-4 w-4 mr-2" />
                    )}
                    Get Suggestion
                  </Button>

                  {suggestions.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {suggestions.map((suggestion, idx) => (
                        <GrindSuggestionCard key={idx} suggestion={suggestion} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Grind Settings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Grind Settings for {selectedGrinder.name}
                  </h2>
                  <Button size="sm" onClick={() => setShowSettingDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Setting
                  </Button>
                </div>

                {/* Method Filter */}
                <div className="mb-4 overflow-x-auto">
                  <div className="flex gap-2 min-w-max pb-2">
                    <Button
                      variant={selectedMethod === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMethod('')}
                    >
                      All Methods
                    </Button>
                    {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
                      <Button
                        key={key}
                        variant={selectedMethod === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedMethod(key as BrewMethod)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {settingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : grindSettings.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        No grind settings recorded yet. Add your first one!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {grindSettings.map((setting) => (
                      <GrindSettingCard
                        key={setting.id}
                        setting={setting}
                        onEdit={openEditSetting}
                        onDelete={(s) => setShowDeleteConfirm({ type: 'setting', id: s.id })}
                        onToggleDialedIn={handleToggleDialedIn}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Select a grinder to view and manage its settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Grinder Dialog */}
      <Dialog open={showGrinderDialog} onOpenChange={setShowGrinderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGrinder ? 'Edit Grinder' : 'Add New Grinder'}</DialogTitle>
            <DialogDescription>
              Add details about your grinder to track settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="grinderName">Name *</Label>
              <Input
                id="grinderName"
                placeholder="e.g., Home Grinder, Office 1Zpresso"
                value={grinderForm.name}
                onChange={(e) => setGrinderForm({ ...grinderForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grinderBrand">Brand</Label>
                <Input
                  id="grinderBrand"
                  placeholder="e.g., 1Zpresso, Comandante"
                  value={grinderForm.brand}
                  onChange={(e) => setGrinderForm({ ...grinderForm, brand: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="grinderModel">Model</Label>
                <Input
                  id="grinderModel"
                  placeholder="e.g., JX-Pro, C40"
                  value={grinderForm.model}
                  onChange={(e) => setGrinderForm({ ...grinderForm, model: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="burrType">Burr Type</Label>
              <Input
                id="burrType"
                placeholder="e.g., Flat 64mm, Conical 48mm"
                value={grinderForm.burrType}
                onChange={(e) => setGrinderForm({ ...grinderForm, burrType: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="grinderNotes">Notes</Label>
              <textarea
                id="grinderNotes"
                placeholder="Any notes about this grinder..."
                value={grinderForm.notes}
                onChange={(e) => setGrinderForm({ ...grinderForm, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px] resize-y"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrinderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGrinder} disabled={!grinderForm.name}>
              {editingGrinder ? 'Save Changes' : 'Add Grinder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setting Dialog */}
      <Dialog open={showSettingDialog} onOpenChange={setShowSettingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSetting ? 'Edit Grind Setting' : 'Add Grind Setting'}</DialogTitle>
            <DialogDescription>Record a grind setting for this grinder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settingValue">Grind Setting *</Label>
                <Input
                  id="settingValue"
                  placeholder="e.g., 18, 2.5 turns"
                  value={settingForm.setting}
                  onChange={(e) => setSettingForm({ ...settingForm, setting: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="settingMethod">Brew Method *</Label>
                <select
                  id="settingMethod"
                  value={settingForm.brewMethod}
                  onChange={(e) =>
                    setSettingForm({ ...settingForm, brewMethod: e.target.value as BrewMethod })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  {Object.entries(BREW_METHOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Coffee (Optional)</Label>
              <div className="relative">
                <Input
                  placeholder="Search coffees..."
                  value={settingCoffeeSearch}
                  onChange={(e) => {
                    setSettingCoffeeSearch(e.target.value);
                    setShowSettingCoffeeDropdown(true);
                  }}
                  onFocus={() => setShowSettingCoffeeDropdown(true)}
                />
                {showSettingCoffeeDropdown &&
                  settingCoffeeSearch &&
                  settingFilteredCoffees.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-auto">
                      {settingFilteredCoffees.slice(0, 8).map((coffee) => (
                        <button
                          key={coffee.id}
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-muted flex flex-col"
                          onClick={() => {
                            setSettingForm({ ...settingForm, coffeeId: coffee.id });
                            setSettingCoffeeSearch('');
                            setShowSettingCoffeeDropdown(false);
                          }}
                        >
                          <span className="font-medium text-sm">{coffee.name}</span>
                          <span className="text-xs text-muted-foreground">{coffee.origin}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              {selectedSettingCoffee && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Coffee className="h-4 w-4" />
                  <span>{selectedSettingCoffee.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-5 w-5 p-0"
                    onClick={() => setSettingForm({ ...settingForm, coffeeId: '' })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setSettingForm({
                        ...settingForm,
                        rating: settingForm.rating === value ? null : value,
                      })
                    }
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        settingForm.rating && value <= settingForm.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="settingNotes">Notes</Label>
              <textarea
                id="settingNotes"
                placeholder="How was this setting? Any observations?"
                value={settingForm.notes}
                onChange={(e) => setSettingForm({ ...settingForm, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background min-h-[80px] resize-y"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSettingForm({ ...settingForm, isDialedIn: !settingForm.isDialedIn })}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                  settingForm.isDialedIn
                    ? 'border-green-500 bg-green-500/10 text-green-700'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Dialed In
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSetting} disabled={!settingForm.setting}>
              {editingSetting ? 'Save Changes' : 'Add Setting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {showDeleteConfirm?.type}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteConfirm?.type === 'grinder') {
                  handleDeleteGrinder(showDeleteConfirm.id);
                } else if (showDeleteConfirm?.type === 'setting') {
                  handleDeleteSetting(showDeleteConfirm.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
