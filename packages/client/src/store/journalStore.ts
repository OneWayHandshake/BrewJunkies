import { create } from 'zustand';
import type { BrewMethod, BrewLogListItem } from '@coffee/shared';

interface JournalFilters {
  brewMethod?: BrewMethod;
  coffeeId?: string;
  minRating?: number;
  startDate?: string;
  endDate?: string;
}

interface JournalState {
  filters: JournalFilters;
  brews: BrewLogListItem[];
  isLoading: boolean;
  page: number;
  totalPages: number;

  setFilters: (filters: JournalFilters) => void;
  clearFilters: () => void;
  setBrews: (brews: BrewLogListItem[], totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  filters: {},
  brews: [],
  isLoading: false,
  page: 1,
  totalPages: 1,

  setFilters: (filters) => set({ filters, page: 1 }),
  clearFilters: () => set({ filters: {}, page: 1 }),
  setBrews: (brews, totalPages) => set({ brews, totalPages }),
  setLoading: (isLoading) => set({ isLoading }),
  setPage: (page) => set({ page }),
}));
