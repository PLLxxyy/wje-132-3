import { create } from 'zustand';
import { certificationApi } from '../api/certification';
import type { SignInAnomaly, WorkerCertification } from '../types';
import { CertStatus } from '../types/enums';

interface CertificationState {
  certifications: WorkerCertification[];
  expiring: WorkerCertification[];
  workerAnomalies: SignInAnomaly[];
  loading: boolean;
  loadCertifications: (status?: CertStatus) => Promise<void>;
  reviewCertification: (id: number, status: CertStatus, comment?: string) => Promise<void>;
  loadWorkerAnomalies: (workerId: number) => Promise<void>;
}

export const useCertificationStore = create<CertificationState>((set) => ({
  certifications: [],
  expiring: [],
  workerAnomalies: [],
  loading: false,
  async loadCertifications(status) {
    set({ loading: true });
    try {
      const [certifications, expiring] = await Promise.all([
        certificationApi.list(status),
        certificationApi.expiring(),
      ]);
      set({ certifications, expiring });
    } finally {
      set({ loading: false });
    }
  },
  async reviewCertification(id, status, comment) {
    await certificationApi.review(id, status, comment);
    const [certifications, expiring] = await Promise.all([
      certificationApi.list(),
      certificationApi.expiring(),
    ]);
    set({ certifications, expiring });
  },
  async loadWorkerAnomalies(workerId) {
    set({ workerAnomalies: await certificationApi.getWorkerAnomalies(workerId) });
  },
}));
