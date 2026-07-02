import type {
  Lead,
  LeadFormValues,
  LeadListParams,
  Pagination,
  Source,
  Status,
} from '@/types/leads';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
  pagination?: Pagination;
};

type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

type LeadListResponse = {
  leads: Lead[];
  pagination: Pagination;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (payload.success === false) {
    const error = new Error(payload.message || 'Request failed');
    Object.assign(error, { errors: payload.errors });
    throw error;
  }

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return payload.data;
}

export async function fetchLeads(params: LeadListParams): Promise<LeadListResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetch(`${apiBaseUrl}/leads?${searchParams.toString()}`);
  const payload = (await response.json()) as ApiSuccess<Lead[]> | ApiFailure;

  if (payload.success === false) {
    throw new Error(payload.message || 'Unable to load leads');
  }

  if (!response.ok || !payload.pagination) {
    throw new Error('Unable to load leads');
  }

  return {
    leads: payload.data,
    pagination: payload.pagination,
  };
}

export function fetchSources() {
  return request<Source[]>('/sources');
}

export function fetchStatuses() {
  return request<Status[]>('/statuses');
}

export function createLead(values: LeadFormValues) {
  return request<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify({
      ...values,
      phone: values.phone.trim() || null,
    }),
  });
}

export function updateLead(id: number, values: Partial<LeadFormValues>) {
  return request<Lead>(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });
}

export function deleteLead(id: number) {
  return request<void>(`/leads/${id}`, {
    method: 'DELETE',
  });
}
