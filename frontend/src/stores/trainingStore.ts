import { create } from 'zustand';
import { trainingApi } from '../api/training';
import type { SafetyTraining } from '../types';

interface TrainingState {
  trainings: SafetyTraining[];
  loading: boolean;
  loadTrainings: () => Promise<void>;
  signIn: (id: number, workerId: number) => Promise<void>;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  trainings: [],
  loading: false,
  async loadTrainings() {
    set({ loading: true });
    try {
      set({ trainings: await trainingApi.list() });
    } finally {
      set({ loading: false });
    }
  },
  async signIn(id, workerId) {
    await trainingApi.signIn(id, workerId);
    set({ trainings: await trainingApi.list() });
  },
}));
