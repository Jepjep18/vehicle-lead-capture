export type Source = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Status = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type StatusHistory = {
  id: number;
  leadId: number;
  statusId: number;
  createdAt: string;
  status: Status;
};

export type Lead = {
  id: number;
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  vehicle: string;
  sourceId: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  source: Source;
  status: Status;
  statusHistory?: StatusHistory[];
};

export type LeadFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle: string;
  sourceId: number;
  statusId: number;
};

export type LeadListParams = {
  search?: string;
  source?: string;
  status?: string;
  page: number;
  limit: number;
  sort: 'name' | 'email' | 'createdAt';
  direction: 'asc' | 'desc';
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
};
