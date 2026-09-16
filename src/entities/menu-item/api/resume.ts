import { asItemPayload, readApiError } from '@/shared/lib';

import { SAVE_ERROR_MESSAGE } from '../model/messages';
import type { MenuItem } from '../model/types';

export async function resumeMenuItem(id: string): Promise<MenuItem> {
  const response = await fetch(`/api/menu-items/${id}/resume`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, SAVE_ERROR_MESSAGE),
    );
  }
  return asItemPayload<MenuItem>(await response.json());
}
