'use client';

import { useState } from 'react';
import type { Lead } from '@/types/leads';
import { DashboardHeader } from './DashboardHeader';
import { DeleteLeadDialog } from './DeleteLeadDialog';
import { LeadFormDialog } from './LeadFormDialog';
import { LeadsFilterBar } from './LeadsFilterBar';
import { LeadsPagination } from './LeadsPagination';
import { LeadsTable } from './LeadsTable';
import { useLeadActions } from './hooks/useLeadActions';
import { useLeadLookups } from './hooks/useLeadLookups';
import { useLeads } from './hooks/useLeads';

export function LeadDashboard() {
  const { sources, statuses } = useLeadLookups();
  const { leads, pagination, params, isLoading, hasFilters, loadLeads, updateParams, resetParams } =
    useLeads();
  const { saveLead, removeLead } = useLeadActions({ onMutated: loadLeads });

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  function closeFormDialog() {
    setIsCreating(false);
    setEditingLead(null);
  }

  async function handleFormSubmit(values: Parameters<typeof saveLead>[1]) {
    await saveLead(editingLead, values);
    closeFormDialog();
  }

  async function handleDeleteConfirm() {
    if (!deletingLead) {
      return;
    }

    await removeLead(deletingLead);
    setDeletingLead(null);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader onRefresh={() => void loadLeads()} onCreate={() => setIsCreating(true)} />

        <LeadsFilterBar
          params={params}
          sources={sources}
          statuses={statuses}
          hasFilters={hasFilters}
          onChange={updateParams}
          onClear={resetParams}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            totalRecords={pagination.totalRecords}
            onEdit={setEditingLead}
            onDelete={setDeletingLead}
          />
          <LeadsPagination
            pagination={pagination}
            onPageChange={(page) => updateParams({ page })}
          />
        </section>
      </div>

      {isCreating || editingLead ? (
        <LeadFormDialog
          lead={editingLead}
          sources={sources}
          statuses={statuses}
          onClose={closeFormDialog}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {deletingLead ? (
        <DeleteLeadDialog
          lead={deletingLead}
          onClose={() => setDeletingLead(null)}
          onConfirm={handleDeleteConfirm}
        />
      ) : null}
    </main>
  );
}
