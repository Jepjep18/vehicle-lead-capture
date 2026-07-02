import type { LeadFormValues, LeadListParams, Pagination } from '@/types/leads';

export const DEFAULT_PAGINATION: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
};

export const DEFAULT_LEAD_PARAMS: LeadListParams = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  direction: 'desc',
};

export const DEFAULT_LEAD_FORM: LeadFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  vehicle: '',
  sourceId: 0,
  statusId: 0,
};

export const STATUS_STYLES: Record<string, string> = {
  New: 'bg-sky-50 text-sky-700 ring-sky-200',
  Contacted: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Qualified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Follow-Up': 'bg-amber-50 text-amber-800 ring-amber-200',
  Won: 'bg-teal-50 text-teal-700 ring-teal-200',
  Lost: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const DEFAULT_STATUS_STYLE = 'bg-slate-50 text-slate-700 ring-slate-200';
