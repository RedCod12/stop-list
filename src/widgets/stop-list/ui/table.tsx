'use client';

import type { MenuItem, MenuItemFilters } from '@/entities/menu-item';
import {
  usePendingMenuItemIds,
  useResumeMenuItem,
} from '@/features/stop-menu-item';

import { COLUMNS } from '../model';
import { StopListRow } from './table-row';

type StopListTableProps = {
  items: MenuItem[];
  filters: MenuItemFilters;
};

export function StopListTable({ items, filters }: StopListTableProps) {
  const pendingIds = new Set(usePendingMenuItemIds());
  const resume = useResumeMenuItem(filters);

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/8">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead className="bg-paper text-xs uppercase tracking-wide text-ink/50">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <StopListRow
              key={item.id}
              item={item}
              pending={pendingIds.has(item.id)}
              resumePending={resume.isPending}
              onResume={() => resume.mutate({ id: item.id })}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
