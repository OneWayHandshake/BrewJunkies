import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrewTimer } from '@/components/brew/BrewTimer';
import { useBrewStore } from '@/store/brewStore';

export function BrewTimerPage() {
  const navigate = useNavigate();
  const { activeBrew, cancelBrew } = useBrewStore();

  // Redirect if no active brew
  useEffect(() => {
    if (!activeBrew) {
      navigate('/brew');
    }
  }, [activeBrew, navigate]);

  const handleComplete = () => {
    // Navigate to log the brew with recipe pre-filled
    const recipeId = activeBrew?.recipe.id;
    cancelBrew();
    navigate(`/journal/new${recipeId ? `?recipeId=${recipeId}` : ''}`);
  };

  const handleCancel = () => {
    cancelBrew();
    navigate('/brew');
  };

  if (!activeBrew) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BrewTimer onComplete={handleComplete} onCancel={handleCancel} />
    </div>
  );
}
