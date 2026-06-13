import { create } from 'zustand';
import { inspectionApi } from '../api/inspection';
import type { InspectionItem, SafetyInspection } from '../types';

interface InspectionState {
  inspections: SafetyInspection[];
  loading: boolean;
  loadInspections: () => Promise<void>;
  executeInspection: (id: number, items: InspectionItem[]) => Promise<void>;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  inspections: [],
  loading: false,
  async loadInspections() {
    set({ loading: true });
    try {
      set({ inspections: await inspectionApi.list() });
    } finally {
      set({ loading: false });
    }
  },
  async executeInspection(id, items) {
    await inspectionApi.execute(id, items);
    set({ inspections: await inspectionApi.list() });
  },
}));
