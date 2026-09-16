import { NextResponse } from 'next/server';

import { stopItemPayloadSchema } from '@/entities/menu-item';
import {
  delay,
  getMenuItem,
  shouldFail,
  updateMenuItem,
} from '@/entities/menu-item/server';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  await delay(600);

  const { id } = await context.params;
  const item = getMenuItem(id);
  if (!item) {
    return NextResponse.json({ error: 'Позиция не найдена' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Некорректное тело запроса' },
      { status: 400 },
    );
  }

  const parsed = stopItemPayloadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Некорректные данные';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (shouldFail()) {
    return NextResponse.json(
      { error: 'Не удалось сохранить. Попробуйте ещё раз.' },
      { status: 503 },
    );
  }

  const updated = updateMenuItem(id, {
    status: {
      kind: 'stopped',
      reason: parsed.data.reason,
      until: parsed.data.until,
    },
  });

  return NextResponse.json({ item: updated });
}
