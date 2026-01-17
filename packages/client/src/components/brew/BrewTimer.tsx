import { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  VolumeX,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useBrewStore } from '@/store/brewStore';
import type { BrewStep } from '@coffee/shared';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getStepTypeColor(type: BrewStep['type']): string {
  switch (type) {
    case 'bloom':
      return 'bg-amber-500';
    case 'pour':
      return 'bg-blue-500';
    case 'wait':
      return 'bg-gray-400';
    case 'stir':
      return 'bg-purple-500';
    case 'press':
      return 'bg-red-500';
    case 'finish':
      return 'bg-green-500';
    default:
      return 'bg-primary';
  }
}

function getStepTypeLabel(type: BrewStep['type']): string {
  switch (type) {
    case 'bloom':
      return 'Bloom';
    case 'pour':
      return 'Pour';
    case 'wait':
      return 'Wait';
    case 'stir':
      return 'Stir';
    case 'press':
      return 'Press';
    case 'finish':
      return 'Finish';
    default:
      return type;
  }
}

interface BrewTimerProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function BrewTimer({ onComplete, onCancel }: BrewTimerProps) {
  const {
    activeBrew,
    soundEnabled,
    pauseBrew,
    resumeBrew,
    nextStep,
    prevStep,
    tick,
    toggleSound,
  } = useBrewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastStepRef = useRef<number>(0);

  // Timer tick
  useEffect(() => {
    if (!activeBrew?.isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBrew?.isRunning, tick]);

  // Play sound on step change
  useEffect(() => {
    if (!activeBrew) return;

    if (activeBrew.currentStepIndex !== lastStepRef.current) {
      lastStepRef.current = activeBrew.currentStepIndex;

      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [activeBrew?.currentStepIndex, soundEnabled]);

  if (!activeBrew) return null;

  const {
    recipe,
    steps,
    currentStepIndex,
    stepTimeRemaining,
    totalElapsed,
    isRunning,
    isPaused,
    scale,
    scaledCoffee,
    scaledWater,
  } = activeBrew;

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isComplete = isLastStep && stepTimeRemaining === 0;

  // Calculate progress
  const stepProgress =
    currentStep.duration > 0
      ? ((currentStep.duration - stepTimeRemaining) / currentStep.duration) * 100
      : 100;

  // Calculate scaled pour amount if applicable
  const scaledPourAmount = currentStep.pourAmount
    ? Math.round(currentStep.pourAmount * scale)
    : null;
  const scaledTargetWeight = currentStep.targetWeight
    ? Math.round(currentStep.targetWeight * scale)
    : null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Hidden audio element for step change sounds */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleWpRidPIkXQtH2+o3vLJjD8LK6jw8syPOwkcse/uypE/CBur7e7JkUIKH6vo7ciTRQwgqeXryJVIDSGn4+nHl0sPI6Xi58aYThIloeHlxZlRFCef3+TDmlQVKZ3d4sKcVxcrm9vhwZ1aGC2Z2d/An10aMJfX3r6gYBwyl9Xcv6FjHjSU0tu+o2UgNpLQ2r2kZyE4kM7ZvaVpIzqOzNi8p2slO4zK1rukbCY9isrUuqVuKD+IyNO5pm8pQIbG0bmnbyqBhcXQuKhwKoODw860qHEshYHB0LercSyIf8DRsKxyLoZ+v9KxrHIuiH2+07KscjGJfL7Ss6xyMYl7vdKzrHIziXu90rKscjSKe73Ssqx0NIp6vNKxrHQ2i3q80bGsdTaLeru/qXU2i3m5sJxkNYl3saRxNYZ0rKRyMoFwp59vLnxrn5lrKnVlmJJmJW1fkYlgIG5aiH5bGWpVfnVWFWZQdWxPD2JKbmJIDl1FZlpBCVc/XlE5BlA4Vkk0AEkwTUI0aDc9SDguZjU7SDctZDM5RzctYjA3RTYrXy41QzQpXCwzQTIoWCoxPjAmVSkwPi4kUicuPCwiTyQsPCohSyEqOigfRx8pOCYdRB4nNyUcQRwmNiQaPhomNSMZOxgkMyIXOBcjMyEVNhYiMiAUMhQhMB4SMRQ=="
      />

      {/* Recipe Info */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg mb-1">{recipe.name}</h2>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{scaledCoffee}g coffee</span>
            <span>{scaledWater}ml water</span>
            {scale !== 1 && (
              <span className="text-primary">({scale}x scale)</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Timer Display */}
      <Card className="mb-4">
        <CardContent className="p-6 text-center">
          {/* Step Type Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStepTypeColor(
                currentStep.type
              )}`}
            >
              {getStepTypeLabel(currentStep.type)}
            </span>
          </div>

          {/* Timer */}
          <div className="text-6xl font-mono font-bold mb-4">
            {formatTime(stepTimeRemaining)}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${getStepTypeColor(
                currentStep.type
              )}`}
              style={{ width: `${stepProgress}%` }}
            />
          </div>

          {/* Current Instruction */}
          <p className="text-lg mb-2">{currentStep.instruction}</p>

          {/* Pour Amount Info */}
          {(scaledPourAmount || scaledTargetWeight) && (
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              {scaledPourAmount && <span>Pour: {scaledPourAmount}ml</span>}
              {scaledTargetWeight && <span>Target: {scaledTargetWeight}g</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Progress */}
      <div className="flex justify-center gap-1 mb-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 rounded-full transition-all ${
              index < currentStepIndex
                ? 'bg-green-500 w-4'
                : index === currentStepIndex
                ? `${getStepTypeColor(step.type)} w-6`
                : 'bg-muted w-4'
            }`}
          />
        ))}
      </div>

      {/* Step Counter */}
      <p className="text-center text-sm text-muted-foreground mb-4">
        Step {currentStepIndex + 1} of {steps.length}
      </p>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        <Button
          variant="outline"
          size="lg"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        {isComplete ? (
          <Button size="lg" onClick={onComplete} className="gap-2 px-8">
            <Check className="h-5 w-5" />
            Complete
          </Button>
        ) : isPaused || !isRunning ? (
          <Button size="lg" onClick={resumeBrew} className="gap-2 px-8">
            <Play className="h-5 w-5" />
            Resume
          </Button>
        ) : (
          <Button size="lg" onClick={pauseBrew} className="gap-2 px-8">
            <Pause className="h-5 w-5" />
            Pause
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={nextStep}
          disabled={isLastStep}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="flex justify-center gap-3">
        <Button variant="ghost" size="sm" onClick={toggleSound}>
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-destructive">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>

      {/* Total Time */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Total elapsed: {formatTime(totalElapsed)}
      </p>
    </div>
  );
}
