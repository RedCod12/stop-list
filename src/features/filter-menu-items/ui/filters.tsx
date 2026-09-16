'use client';

import { usePathname, useRouter } from 'next/navigation';

import {
  menuItemFiltersToQuery,
  parseMenuFilters,
  SHOP_LABELS,
  STATUS_LABELS,
  type MenuItemFilters,
} from '@/entities/menu-item';

import { FilterSelect } from './filter-select';

type MenuFiltersProps = {
  filters: MenuItemFilters;
};

export function MenuFilters({ filters }: MenuFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const push = (next: MenuItemFilters) => {
    router.push(`${pathname}${menuItemFiltersToQuery(next)}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <FilterSelect
        label="Цех"
        value={filters.shop ?? ''}
        emptyLabel="Все цеха"
        options={SHOP_LABELS}
        onChange={(shop) =>
          push(parseMenuFilters({ shop, status: filters.status }))
        }
      />
      <FilterSelect
        label="Статус"
        value={filters.status ?? ''}
        emptyLabel="Все статусы"
        options={STATUS_LABELS}
        onChange={(status) =>
          push(parseMenuFilters({ shop: filters.shop, status }))
        }
      />
    </div>
  );
}
