import { asItemPayload, readApiError } from '@/shared/lib';

import { SAVE_ERROR_MESSAGE } from '../model/messages';
import type { MenuItem, StopItemPayload } from '../model/types';

export async function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, SAVE_ERROR_MESSAGE),
    );
  }
  return asItemPayload<MenuItem>(await response.json());
}
