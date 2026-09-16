'use client';

import {
  useMutation,
  useMutationState,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import {
  SAVE_ERROR_MESSAGE,
  applyResumeToList,
  applyStopToList,
  invalidateMenuItemLists,
  restoreMenuItemLists,
  resumeMenuItem,
  stopMenuItem,
  type StopItemPayload,
} from '@/entities/menu-item';
import { toast } from '@/shared/ui';

type ListSnapshots = Awaited<ReturnType<typeof applyStopToList>>;

const statusMutationKey = ['menu-item-status'] as const;

export function usePendingMenuItemIds(): string[] {
  return useMutationState({
    filters: { mutationKey: [...statusMutationKey], status: 'pending' },
    select: (mutation): string | undefined => {
      const vars = mutation.state.variables as { id: string } | undefined;
      return vars?.id;
    },
  }).filter((id): id is string => Boolean(id));
}

function useOptimisticStatusMutation<TVars extends { id: string }>(
  key: 'stop' | 'resume',
  mutationFn: (vars: TVars) => Promise<unknown>,
  apply: (qc: QueryClient, vars: TVars) => Promise<ListSnapshots>,
  successMessage?: string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [...statusMutationKey, key],
    mutationFn,
    onMutate: async (vars) => ({ snapshots: await apply(qc, vars) }),
    onSuccess: () => {
      if (successMessage) toast.success(successMessage);
    },
    onError: (error, _vars, ctx) => {
      restoreMenuItemLists(qc, ctx?.snapshots);
      toast.error(
        error instanceof Error ? error.message : SAVE_ERROR_MESSAGE,
      );
    },
    onSettled: () => {
      invalidateMenuItemLists(qc);
    },
  });
}

export function useStopMenuItem() {
  return useOptimisticStatusMutation(
    'stop',
    (vars: { id: string; payload: StopItemPayload }) =>
      stopMenuItem(vars.id, vars.payload),
    (qc, vars) => applyStopToList(qc, vars.id, vars.payload),
  );
}

export function useResumeMenuItem() {
  return useOptimisticStatusMutation(
    'resume',
    (vars: { id: string }) => resumeMenuItem(vars.id),
    (qc, vars) => applyResumeToList(qc, vars.id),
    'Позиция возвращена в продажу',
  );
}
