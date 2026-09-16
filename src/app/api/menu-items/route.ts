import { NextRequest, NextResponse } from 'next/server';

import {
  matchesMenuItemFilters,
  parseMenuFilters,
} from '@/entities/menu-item';
import { delay, listMenuItems } from '@/entities/menu-item/server';

export async function GET(request: NextRequest) {
  await delay(450);

  const filters = parseMenuFilters({
    shop: request.nextUrl.searchParams.get('shop') ?? undefined,
    status: request.nextUrl.searchParams.get('status') ?? undefined,
  });

  const items = listMenuItems().filter((item) =>
    matchesMenuItemFilters(item, filters),
  );

  return NextResponse.json({ items });
}
