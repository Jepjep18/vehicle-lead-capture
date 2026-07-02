import { useState } from 'react';
import { toast } from 'sonner';
import { createLead, deleteLead, updateLead } from '@/services/api';
import type { Lead, LeadFormValues } from '@/types/leads';

type UseLeadActionsOptions = {
  onMutated: () => Promise<void> | void;
};

export function useLeadActions({ onMutated }: UseLeadActionsOptions) {
  const [isMutatingStatusId, setIsMutatingStatusId] = useState<number | null>(null);

  async function saveLead(lead: Lead | null, values: LeadFormValues) {
    try {
      if (lead) {
        await updateLead(lead.id, values);
        toast.success('Lead updated');
      } else {
        await createLead(values);
        toast.success('Lead created');
      }

      await onMutated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save lead');
      throw error;
    }
  }

  async function changeStatus(lead: Lead, statusId: number) {
    setIsMutatingStatusId(lead.id);

    try {
      await updateLead(lead.id, { statusId });
      toast.success('Status changed');
      await onMutated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update status');
    } finally {
      setIsMutatingStatusId(null);
    }
  }

  async function removeLead(lead: Lead) {
    try {
      await deleteLead(lead.id);
      toast.success('Lead deleted');
      await onMutated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete lead');
      throw error;
    }
  }

  return { saveLead, changeStatus, removeLead, isMutatingStatusId };
}
