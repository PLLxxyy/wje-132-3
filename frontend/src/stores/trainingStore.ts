import { create } from 'zustand';
import { trainingApi } from '../api/training';
import type { SafetyTraining, SignInAnomaly, SignInResult } from '../types';

interface TrainingState {
  trainings: SafetyTraining[];
  anomalies: SignInAnomaly[];
  loading: boolean;
  loadTrainings: () => Promise<void>;
  signIn: (id: number, workerId: number) => Promise<SignInResult>;
  loadAnomalies: () => Promise<void>;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  trainings: [],
  anomalies: [],
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
    const result = await trainingApi.signIn(id, workerId);
    set({ trainings: await trainingApi.list() });
    return result;
  },
  async loadAnomalies() {
    set({ anomalies: await trainingApi.getAnomalies() });
  },
}));
