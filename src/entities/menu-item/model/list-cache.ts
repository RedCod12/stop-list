import type { QueryClient, QueryKey } from '@tanstack/react-query';

import {
  applyItemToFilteredList,
  menuItemKeys,
  toResumedItem,
  toStoppedItem,
} from './lib';
import type { MenuItem, MenuItemFilters, StopItemPayload } from './types';

export type MenuItemListSnapshots = Map<QueryKey, MenuItem[] | undefined>;

function listFiltersFromKey(queryKey: QueryKey): MenuItemFilters | null {
  if (queryKey[0] !== 'menu-items' || queryKey[1] !== 'list') return null;
  const filters = queryKey[2];
  if (typeof filters !== 'object' || filters === null || Array.isArray(filters)) {
    return null;
  }
  return filters as MenuItemFilters;
}

function findMenuItem(
  qc: QueryClient,
  id: string,
): MenuItem | undefined {
  for (const [, data] of qc.getQueriesData<MenuItem[]>({
    queryKey: menuItemKeys.all,
  })) {
    const item = data?.find((entry) => entry.id === id);
    if (item) return item;
  }
  return undefined;
}

async function patchAllLists(
  qc: QueryClient,
  nextItem: MenuItem,
): Promise<MenuItemListSnapshots> {
  const snapshots: MenuItemListSnapshots = new Map();
  const entries = qc.getQueriesData<MenuItem[]>({ queryKey: menuItemKeys.all });

  await qc.cancelQueries({ queryKey: menuItemKeys.all });

  for (const [queryKey, data] of entries) {
    const filters = listFiltersFromKey(queryKey);
    if (!filters) continue;
    snapshots.set(queryKey, data);
    qc.setQueryData<MenuItem[]>(queryKey, applyItemToFilteredList(
      data ?? [],
      nextItem,
      filters,
    ));
  }

  return snapshots;
}

export async function applyStopToList(
  qc: QueryClient,
  id: string,
  payload: StopItemPayload,
): Promise<MenuItemListSnapshots | undefined> {
  const item = findMenuItem(qc, id);
  if (!item) return undefined;
  return patchAllLists(qc, toStoppedItem(item, payload));
}

export async function applyResumeToList(
  qc: QueryClient,
  id: string,
): Promise<MenuItemListSnapshots | undefined> {
  const item = findMenuItem(qc, id);
  if (!item) return undefined;
  return patchAllLists(qc, toResumedItem(item));
}

export function restoreMenuItemLists(
  qc: QueryClient,
  snapshots: MenuItemListSnapshots | undefined,
): void {
  if (!snapshots) return;
  for (const [queryKey, data] of snapshots) {
    qc.setQueryData(queryKey, data);
  }
}

export function invalidateMenuItemLists(qc: QueryClient): void {
  void qc.invalidateQueries({ queryKey: menuItemKeys.all });
}
