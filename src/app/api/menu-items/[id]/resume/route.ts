import { NextResponse } from 'next/server';

import {
  delay,
  getMenuItem,
  shouldFail,
  updateMenuItem,
} from '@/entities/menu-item/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  await delay(600);

  const { id } = await context.params;
  const item = getMenuItem(id);
  if (!item) {
    return NextResponse.json({ error: 'Позиция не найдена' }, { status: 404 });
  }

  if (item.stock === 0) {
    return NextResponse.json(
      { error: 'Нельзя вернуть в продажу: остаток 0' },
      { status: 409 },
    );
  }

  if (shouldFail()) {
    return NextResponse.json(
      { error: 'Не удалось сохранить. Попробуйте ещё раз.' },
      { status: 503 },
    );
  }

  const updated = updateMenuItem(id, { status: { kind: 'available' } });
  return NextResponse.json({ item: updated });
}
