import { create } from 'zustand';
import { incidentApi } from '../api/incident';
import type { IncidentQuery, SafetyIncident } from '../types';

interface IncidentState {
  incidents: SafetyIncident[];
  selectedIncident?: SafetyIncident;
  total: number;
  loading: boolean;
  loadIncidents: (query?: IncidentQuery) => Promise<void>;
  selectIncident: (id: number) => Promise<void>;
  reportIncident: (payload: Partial<SafetyIncident> | FormData) => Promise<void>;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  total: 0,
  loading: false,
  async loadIncidents(query) {
    set({ loading: true });
    try {
      const result = await incidentApi.list(query);
      set({ incidents: result.items, total: result.total });
    } finally {
      set({ loading: false });
    }
  },
  async selectIncident(id) {
    set({ selectedIncident: await incidentApi.detail(id) });
  },
  async reportIncident(payload) {
    await incidentApi.report(payload);
    const result = await incidentApi.list();
    set({ incidents: result.items, total: result.total });
  },
}));
