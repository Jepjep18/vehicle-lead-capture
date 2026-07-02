import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchSources, fetchStatuses } from '@/services/api';
import type { Source, Status } from '@/types/leads';

export function useLeadLookups() {
  const [sources, setSources] = useState<Source[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [sourceData, statusData] = await Promise.all([fetchSources(), fetchStatuses()]);

        if (!isMounted) {
          return;
        }

        setSources(sourceData);
        setStatuses(statusData);
      } catch {
        toast.error('Unable to load filters');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { sources, statuses, isLoading };
}
