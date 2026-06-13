import { useCallback, useState } from 'react';
import { incidentApi } from '../api/incident';
import type { SafetyIncident } from '../types';

export function useIncident(id?: number) {
  const [incident, setIncident] = useState<SafetyIncident>();
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setIncident(await incidentApi.detail(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const submitCorrective = useCallback(
    async (correctiveAction: string, correctiveDeadline: string) => {
      if (!id) return;
      const updated = await incidentApi.corrective(id, correctiveAction, correctiveDeadline);
      setIncident(updated);
    },
    [id],
  );

  const closeIncident = useCallback(
    async (note?: string) => {
      if (!id) return;
      const updated = await incidentApi.close(id, note);
      setIncident(updated);
    },
    [id],
  );

  return { incident, loading, refresh, submitCorrective, closeIncident };
}
