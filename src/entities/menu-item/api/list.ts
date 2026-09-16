import { queryOptions } from '@tanstack/react-query';

import { errorFromPayload } from '@/shared/lib';

import { LOAD_ERROR_MESSAGE } from '../model/messages';
import { menuItemFiltersToQuery, menuItemKeys } from '../model/lib';
import type { MenuItem, MenuItemFilters } from '../model/types';

async function fetchMenuItems(filters: MenuItemFilters): Promise<MenuItem[]> {
  const response = await fetch(
    `/api/menu-items${menuItemFiltersToQuery(filters)}`,
  );
  const payload: unknown = await response.json();
  if (!response.ok) {
    throw new Error(errorFromPayload(payload, LOAD_ERROR_MESSAGE));
  }
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('items' in payload) ||
    !Array.isArray(payload.items)
  ) {
    throw new Error('Некорректный ответ сервера');
  }
  return payload.items as MenuItem[];
}

export function menuItemListOptions(filters: MenuItemFilters) {
  return queryOptions({
    queryKey: menuItemKeys.list(filters),
    queryFn: () => fetchMenuItems(filters),
  });
}
