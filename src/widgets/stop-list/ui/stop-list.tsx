'use client';

import { useQuery } from '@tanstack/react-query';

import {
  menuItemListOptions,
  type MenuItemFilters,
} from '@/entities/menu-item';
import { MenuFilters } from '@/features/filter-menu-items';
import { StopReasonPanel } from '@/features/stop-menu-item';
import { ToastStack } from '@/shared/ui';

import { ListState } from './list-state';

type StopListProps = {
  filters: MenuItemFilters;
};

export function StopList({ filters }: StopListProps) {
  const query = useQuery(menuItemListOptions(filters));
  const items = query.data ?? [];

  return (
    <>
      <MenuFilters filters={filters} />
      <ListState query={query} items={items} />
      <StopReasonPanel items={items} />
      <ToastStack />
    </>
  );
}
