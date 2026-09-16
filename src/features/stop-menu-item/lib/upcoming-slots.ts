import { STEP_MS } from '@/entities/menu-item';

export function upcomingSlots(
  now = Date.now(),
): Array<{ value: string; label: string }> {
  const start = Math.ceil((now + STEP_MS) / STEP_MS) * STEP_MS;
  const slots: Array<{ value: string; label: string }> = [];
  for (let ts = start; ts <= now + 24 * 60 * 60 * 1000; ts += STEP_MS) {
    const date = new Date(ts);
    slots.push({
      value: date.toISOString(),
      label: date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  }
  return slots;
}
