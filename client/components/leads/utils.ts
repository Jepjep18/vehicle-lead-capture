import type { Lead, LeadFormValues, Source, Status } from '@/types/leads';
import { DEFAULT_LEAD_FORM } from './constants';

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function getLeadFormValues(
  lead: Lead | null,
  sources: Source[],
  statuses: Status[],
): LeadFormValues {
  if (!lead) {
    return {
      ...DEFAULT_LEAD_FORM,
      sourceId: sources[0]?.id ?? 0,
      statusId: statuses[0]?.id ?? 0,
    };
  }

  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone ?? '',
    vehicle: lead.vehicle,
    sourceId: lead.sourceId,
    statusId: lead.statusId,
  };
}
