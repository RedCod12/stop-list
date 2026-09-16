export const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
export const STEP_MS = 15 * 60 * 1000;

export function snapUntilToStep(value: string): string {
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return value;
  const snapped = Math.ceil(ts / STEP_MS) * STEP_MS;
  return new Date(snapped).toISOString();
}

export function validateUntil(
  value: string | null,
  now = Date.now(),
): string | null {
  if (value === null) return null;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % STEP_MS !== 0) return 'Шаг — 15 минут';
  return null;
}
