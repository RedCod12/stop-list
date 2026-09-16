import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import {
  applyStopToList,
  restoreMenuItemLists,
} from './list-cache';
import { menuItemKeys } from './lib';
import type { MenuItem } from './types';

const availableItem: MenuItem = {
  id: '1',
  title: 'Борщ',
  shop: 'kitchen',
  stock: 12,
  status: { kind: 'available' },
  updatedAt: '2026-09-16T08:00:00.000Z',
};

describe('optimistic stop list cache', () => {
  it('updates filtered caches immediately and restores snapshots on rollback', async () => {
    const qc = new QueryClient();
    const allKey = menuItemKeys.list({});
    const availableKey = menuItemKeys.list({ status: 'available' });
    const stoppedKey = menuItemKeys.list({ status: 'stopped' });

    qc.setQueryData(allKey, [availableItem]);
    qc.setQueryData(availableKey, [availableItem]);
    qc.setQueryData(stoppedKey, []);

    const snapshots = await applyStopToList(qc, '1', {
      reason: 'out_of_stock',
      until: null,
    });

    expect(snapshots).toBeDefined();
    expect(qc.getQueryData<MenuItem[]>(allKey)?.[0]?.status).toEqual({
      kind: 'stopped',
      reason: 'out_of_stock',
      until: null,
    });
    expect(qc.getQueryData<MenuItem[]>(availableKey)).toEqual([]);
    expect(qc.getQueryData<MenuItem[]>(stoppedKey)).toHaveLength(1);
    expect(qc.getQueryData<MenuItem[]>(stoppedKey)?.[0]?.id).toBe('1');

    restoreMenuItemLists(qc, snapshots);

    expect(qc.getQueryData(allKey)).toEqual([availableItem]);
    expect(qc.getQueryData(availableKey)).toEqual([availableItem]);
    expect(qc.getQueryData(stoppedKey)).toEqual([]);
  });
});
