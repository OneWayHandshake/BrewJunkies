import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BrewLogForm } from '@/components/journal/BrewLogForm';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import type { BrewLogDetail } from '@coffee/shared';

export function BrewLogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [brew, setBrew] = useState<BrewLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrew = async () => {
      try {
        const response = await api.get(`/brews/${id}`);
        setBrew(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load brew');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBrew();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !brew) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive mb-4">{error || 'Brew not found'}</p>
        <Button onClick={() => navigate('/journal')}>Back to Journal</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-semibold mb-2">Edit Brew</h1>
        <p className="text-muted-foreground mb-8">
          Update the details of your brewing session.
        </p>

        <BrewLogForm editBrew={brew} />
      </div>
    </div>
  );
}
