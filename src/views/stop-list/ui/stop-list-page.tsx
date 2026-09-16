import type { MenuItemFilters } from '@/entities/menu-item';
import { StopList } from '@/widgets/stop-list';

import { StopListHeader } from './stop-list-header';

type StopListPageProps = {
  filters: MenuItemFilters;
};

export function StopListPage({ filters }: StopListPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8">
      <StopListHeader />
      <StopList filters={filters} />
    </main>
  );
}
