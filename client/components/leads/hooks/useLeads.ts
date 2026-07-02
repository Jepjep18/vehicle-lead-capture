import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchLeads } from '@/services/api';
import type { Lead, LeadListParams, Pagination } from '@/types/leads';
import { DEFAULT_LEAD_PARAMS, DEFAULT_PAGINATION } from '../constants';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [params, setParams] = useState<LeadListParams>(DEFAULT_LEAD_PARAMS);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = useCallback(
    async (nextParams: LeadListParams = params) => {
      setIsLoading(true);

      try {
        const data = await fetchLeads(nextParams);
        setLeads(data.leads);
        setPagination(data.pagination);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load leads');
      } finally {
        setIsLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  function updateParams(nextParams: Partial<LeadListParams>) {
    setParams((current) => ({
      ...current,
      ...nextParams,
      page: nextParams.page ?? 1,
    }));
  }

  function resetParams() {
    setParams(DEFAULT_LEAD_PARAMS);
  }

  const hasFilters = Boolean(params.search || params.source || params.status);

  return {
    leads,
    pagination,
    params,
    isLoading,
    hasFilters,
    loadLeads,
    updateParams,
    resetParams,
  };
}
