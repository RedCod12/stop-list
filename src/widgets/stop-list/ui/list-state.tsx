'use client';

import { type UseQueryResult } from '@tanstack/react-query';

import {
  LOAD_ERROR_MESSAGE,
  type MenuItem,
  type MenuItemFilters,
} from '@/entities/menu-item';

import { StateCard } from './state-card';
import { StopListTable } from './table';

type ListStateProps = {
  query: UseQueryResult<MenuItem[]>;
  items: MenuItem[];
  filters: MenuItemFilters;
};

export function ListState({ query, items, filters }: ListStateProps) {
  if (query.isLoading) {
    return <StateCard>Загружаем меню смены…</StateCard>;
  }

  if (query.isError) {
    return (
      <StateCard tone="error">
        {query.error instanceof Error
          ? query.error.message
          : LOAD_ERROR_MESSAGE}
      </StateCard>
    );
  }

  if (items.length === 0) {
    return <StateCard>По выбранным фильтрам позиций нет.</StateCard>;
  }

  return <StopListTable items={items} filters={filters} />;
}
