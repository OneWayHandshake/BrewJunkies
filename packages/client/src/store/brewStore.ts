import { create } from 'zustand';
import type { BrewStep, BrewRecipe } from '@coffee/shared';

interface ActiveBrew {
  recipe: BrewRecipe;
  steps: BrewStep[];
  currentStepIndex: number;
  stepTimeRemaining: number;
  totalElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  scale: number;
  scaledCoffee: number;
  scaledWater: number;
}

interface BrewState {
  activeBrew: ActiveBrew | null;
  soundEnabled: boolean;

  startBrew: (recipe: BrewRecipe, scale?: number) => void;
  pauseBrew: () => void;
  resumeBrew: () => void;
  nextStep: () => void;
  prevStep: () => void;
  tick: () => void;
  completeBrew: () => void;
  cancelBrew: () => void;
  toggleSound: () => void;
}

export const useBrewStore = create<BrewState>((set, get) => ({
  activeBrew: null,
  soundEnabled: true,

  startBrew: (recipe: BrewRecipe, scale = 1) => {
    const steps = recipe.steps as BrewStep[];
    if (steps.length === 0) return;

    set({
      activeBrew: {
        recipe,
        steps,
        currentStepIndex: 0,
        stepTimeRemaining: steps[0].duration,
        totalElapsed: 0,
        isRunning: true,
        isPaused: false,
        scale,
        scaledCoffee: Math.round(recipe.coffeeAmount * scale * 10) / 10,
        scaledWater: Math.round(recipe.waterAmount * scale),
      },
    });
  },

  pauseBrew: () => {
    set((state) => {
      if (!state.activeBrew) return state;
      return {
        activeBrew: {
          ...state.activeBrew,
          isRunning: false,
          isPaused: true,
        },
      };
    });
  },

  resumeBrew: () => {
    set((state) => {
      if (!state.activeBrew) return state;
      return {
        activeBrew: {
          ...state.activeBrew,
          isRunning: true,
          isPaused: false,
        },
      };
    });
  },

  nextStep: () => {
    set((state) => {
      if (!state.activeBrew) return state;
      const { currentStepIndex, steps } = state.activeBrew;

      if (currentStepIndex >= steps.length - 1) {
        // Last step - don't advance
        return state;
      }

      const nextIndex = currentStepIndex + 1;
      return {
        activeBrew: {
          ...state.activeBrew,
          currentStepIndex: nextIndex,
          stepTimeRemaining: steps[nextIndex].duration,
        },
      };
    });
  },

  prevStep: () => {
    set((state) => {
      if (!state.activeBrew) return state;
      const { currentStepIndex, steps } = state.activeBrew;

      if (currentStepIndex <= 0) {
        // First step - don't go back
        return state;
      }

      const prevIndex = currentStepIndex - 1;
      return {
        activeBrew: {
          ...state.activeBrew,
          currentStepIndex: prevIndex,
          stepTimeRemaining: steps[prevIndex].duration,
        },
      };
    });
  },

  tick: () => {
    set((state) => {
      if (!state.activeBrew || !state.activeBrew.isRunning) return state;

      const { stepTimeRemaining, currentStepIndex, steps, totalElapsed } = state.activeBrew;

      // Decrement time
      const newTimeRemaining = Math.max(0, stepTimeRemaining - 1);
      const newTotalElapsed = totalElapsed + 1;

      // Check if step is complete
      if (newTimeRemaining === 0 && currentStepIndex < steps.length - 1) {
        // Auto-advance to next step
        const nextIndex = currentStepIndex + 1;
        return {
          activeBrew: {
            ...state.activeBrew,
            currentStepIndex: nextIndex,
            stepTimeRemaining: steps[nextIndex].duration,
            totalElapsed: newTotalElapsed,
          },
        };
      }

      return {
        activeBrew: {
          ...state.activeBrew,
          stepTimeRemaining: newTimeRemaining,
          totalElapsed: newTotalElapsed,
        },
      };
    });
  },

  completeBrew: () => {
    set({ activeBrew: null });
  },

  cancelBrew: () => {
    set({ activeBrew: null });
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },
}));
