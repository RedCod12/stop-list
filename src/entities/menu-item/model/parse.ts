import { menuItemFilterStatusSchema, shopSchema } from './schemas';
import type { MenuItemFilters } from './types';

export function parseMenuFilters(input: {
  shop?: string | string[];
  status?: string | string[];
}): MenuItemFilters {
  const shopRaw = Array.isArray(input.shop) ? input.shop[0] : input.shop;
  const statusRaw = Array.isArray(input.status)
    ? input.status[0]
    : input.status;
  const shop = shopRaw ? shopSchema.safeParse(shopRaw) : null;
  const status = statusRaw
    ? menuItemFilterStatusSchema.safeParse(statusRaw)
    : null;

  return {
    shop: shop?.success ? shop.data : undefined,
    status: status?.success ? status.data : undefined,
  };
}
