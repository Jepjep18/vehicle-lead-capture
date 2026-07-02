'use client';

import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeadListParams, Source, Status } from '@/types/leads';

type LeadsFilterBarProps = {
  params: LeadListParams;
  sources: Source[];
  statuses: Status[];
  hasFilters: boolean;
  onChange: (nextParams: Partial<LeadListParams>) => void;
  onClear: () => void;
};

export function LeadsFilterBar({
  params,
  sources,
  statuses,
  hasFilters,
  onChange,
  onClear,
}: LeadsFilterBarProps) {
  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_150px_120px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={params.search ?? ''}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search leads"
            className="h-10 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
          />
        </label>
        <select
          value={params.source ?? ''}
          onChange={(event) => onChange({ source: event.target.value || undefined })}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500"
          aria-label="Source filter"
        >
          <option value="">All sources</option>
          {sources.map((source) => (
            <option key={source.id} value={source.name}>
              {source.name}
            </option>
          ))}
        </select>
        <select
          value={params.status ?? ''}
          onChange={(event) => onChange({ status: event.target.value || undefined })}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500"
          aria-label="Status filter"
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.name}>
              {status.name}
            </option>
          ))}
        </select>
        <select
          value={params.sort}
          onChange={(event) => onChange({ sort: event.target.value as LeadListParams['sort'] })}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-500"
          aria-label="Sort column"
        >
          <option value="createdAt">Created date</option>
          <option value="name">Last Name</option>
          <option value="email">Email</option>
        </select>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ direction: params.direction === 'asc' ? 'desc' : 'asc' })}
        >
          {params.direction === 'asc' ? (
            <ArrowUpAZ className="size-4" />
          ) : (
            <ArrowDownAZ className="size-4" />
          )}
          {params.direction.toUpperCase()}
        </Button>
      </div>

      {hasFilters ? (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            <X className="size-4" />
            Clear filters
          </Button>
        </div>
      ) : null}
    </section>
  );
}
