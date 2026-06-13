export const apiPaths = {
  dashboard: '/api/dashboard',
  auditLogs: '/api/audit-logs',
  auth: {
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  incidents: {
    base: '/api/incidents',
    detail: (id: number) => `/api/incidents/${id}`,
    assign: (id: number) => `/api/incidents/${id}/assign`,
    corrective: (id: number) => `/api/incidents/${id}/corrective`,
    close: (id: number) => `/api/incidents/${id}/close`,
  },
  inspections: {
    base: '/api/inspections',
    execute: (id: number) => `/api/inspections/${id}/execute`,
    report: (id: number) => `/api/inspections/${id}/report`,
  },
  trainings: {
    base: '/api/trainings',
    signIn: (id: number) => `/api/trainings/${id}/sign-in`,
    scores: (id: number) => `/api/trainings/${id}/scores`,
    export: (id: number) => `/api/trainings/${id}/export`,
    anomalies: '/api/trainings/anomalies',
    trainingAnomalies: (id: number) => `/api/trainings/${id}/anomalies`,
  },
  certifications: {
    base: '/api/certifications',
    review: (id: number) => `/api/certifications/${id}/review`,
    renew: (id: number) => `/api/certifications/${id}/renew`,
    expiring: '/api/certifications/alerts/expiring',
    workerAnomalies: (workerId: number) => `/api/certifications/worker/${workerId}/anomalies`,
  },
  uploads: {
    image: '/api/uploads/image',
  },
};
