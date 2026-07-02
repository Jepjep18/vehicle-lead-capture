'use client';

import { FormEvent, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lead, LeadFormValues, Source, Status } from '@/types/leads';
import { getLeadFormValues } from './utils';

type LeadFormDialogProps = {
  lead: Lead | null;
  sources: Source[];
  statuses: Status[];
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => Promise<void>;
};

export function LeadFormDialog({ lead, sources, statuses, onClose, onSubmit }: LeadFormDialogProps) {
  const [values, setValues] = useState<LeadFormValues>(() =>
    getLeadFormValues(lead, sources, statuses),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 px-4 py-6">
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {lead ? 'Edit lead' : 'Create lead'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {lead ? `${lead.firstName} ${lead.lastName}` : 'New vehicle inquiry'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              First name
              <input
                required
                value={values.firstName}
                onChange={(event) =>
                  setValues((current) => ({ ...current, firstName: event.target.value }))
                }
                className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-slate-500"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Last name
              <input
                required
                value={values.lastName}
                onChange={(event) =>
                  setValues((current) => ({ ...current, lastName: event.target.value }))
                }
                className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Email
              <input
                required
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({ ...current, email: event.target.value }))
                }
                className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-slate-500"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Phone
              <input
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({ ...current, phone: event.target.value }))
                }
                className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Vehicle
            <input
              required
              value={values.vehicle}
              onChange={(event) =>
                setValues((current) => ({ ...current, vehicle: event.target.value }))
              }
              className="h-10 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-slate-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Source
              <select
                required
                value={values.sourceId}
                onChange={(event) =>
                  setValues((current) => ({ ...current, sourceId: Number(event.target.value) }))
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-slate-500"
              >
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Status
              <select
                required
                value={values.statusId}
                onChange={(event) =>
                  setValues((current) => ({ ...current, statusId: Number(event.target.value) }))
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-slate-500"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {lead ? 'Save changes' : 'Create lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
