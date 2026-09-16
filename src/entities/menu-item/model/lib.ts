import type { MenuItem, MenuItemFilters, StopItemPayload } from './types';

export const menuItemKeys = {
  all: ['menu-items'] as const,
  list: (filters: MenuItemFilters) =>
    [...menuItemKeys.all, 'list', filters] as const,
};

export function menuItemFiltersToQuery({
  shop,
  status,
}: MenuItemFilters): string {
  const params = new URLSearchParams();
  if (shop) params.set('shop', shop);
  if (status) params.set('status', status);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function matchesMenuItemFilters(
  item: MenuItem,
  { shop, status }: MenuItemFilters,
): boolean {
  const matchesShop = !shop || item.shop === shop;
  const matchesStatus = !status || item.status.kind === status;
  return matchesShop && matchesStatus;
}

export function applyItemToFilteredList(
  items: MenuItem[],
  nextItem: MenuItem,
  filters: MenuItemFilters,
): MenuItem[] {
  const next = items.map((item) =>
    item.id === nextItem.id ? nextItem : item,
  );
  const exists = items.some((item) => item.id === nextItem.id);
  const withItem = exists ? next : [...next, nextItem];
  return withItem.filter((item) => matchesMenuItemFilters(item, filters));
}

export function toStoppedItem(
  item: MenuItem,
  payload: StopItemPayload,
): MenuItem {
  return {
    ...item,
    status: {
      kind: 'stopped',
      reason: payload.reason,
      until: payload.until,
    },
  };
}

export function toResumedItem(item: MenuItem): MenuItem {
  return {
    ...item,
    status: { kind: 'available' },
  };
}
