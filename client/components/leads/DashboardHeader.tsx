'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DashboardHeaderProps = {
  onRefresh: () => void;
  onCreate: () => void;
};

export function DashboardHeader({ onRefresh, onCreate }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-slate-500">Vehicle Lead Capture</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
          Lead Management Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
        <Button onClick={onCreate}>
          <Plus className="size-4" />
          Create lead
        </Button>
      </div>
    </header>
  );
}
