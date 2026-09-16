export function errorFromPayload(payload: unknown, fallback: string): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string'
  ) {
    return payload.error;
  }
  return fallback;
}

export async function readApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  const payload: unknown = await response.json().catch(() => null);
  return errorFromPayload(payload, fallback);
}

export function asItemPayload<T>(payload: unknown): T {
  if (typeof payload !== 'object' || payload === null || !('item' in payload)) {
    throw new Error('Некорректный ответ сервера');
  }
  return payload.item as T;
}
