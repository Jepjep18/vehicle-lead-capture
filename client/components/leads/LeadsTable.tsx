'use client';

import { Edit3, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types/leads';
import { DEFAULT_STATUS_STYLE, STATUS_STYLES } from './constants';
import { formatDate } from './utils';

type LeadsTableProps = {
  leads: Lead[];
  isLoading: boolean;
  totalRecords: number;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export function LeadsTable({ leads, isLoading, totalRecords, onEdit, onDelete }: LeadsTableProps) {
  return (
    <>
      <div className="flex min-h-14 items-center justify-between border-b border-slate-200 px-4">
        <p className="text-sm font-medium text-slate-700">{totalRecords} leads</p>
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Loading
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-normal text-slate-500">
            <tr>
              <th className="border-b border-slate-200 px-4 py-3">Name</th>
              <th className="border-b border-slate-200 px-4 py-3">Email</th>
              <th className="border-b border-slate-200 px-4 py-3">Phone</th>
              <th className="border-b border-slate-200 px-4 py-3">Vehicle</th>
              <th className="border-b border-slate-200 px-4 py-3">Source</th>
              <th className="border-b border-slate-200 px-4 py-3">Status</th>
              <th className="border-b border-slate-200 px-4 py-3">Created</th>
              <th className="border-b border-slate-200 px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-950">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                  {lead.email}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                  {lead.phone ?? '-'}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                  {lead.vehicle}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                  {lead.source.name}
                </td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex min-w-24 justify-center rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                      STATUS_STYLES[lead.status.name] ?? DEFAULT_STATUS_STYLE,
                    )}
                  >
                    {lead.status.name}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(lead)}
                      aria-label="Edit lead"
                    >
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lead)}
                      aria-label="Delete lead"
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!isLoading && leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                  No leads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
