'use client';

import { create } from 'zustand';

type StopPanelState = {
  selectedId: string | null;
  openPanel: (id: string) => void;
  closePanel: () => void;
};

export const useStopPanelStore = create<StopPanelState>((set) => ({
  selectedId: null,
  openPanel: (id) => set({ selectedId: id }),
  closePanel: () => set({ selectedId: null }),
}));

export function useStopPanel() {
  const selectedId = useStopPanelStore((state) => state.selectedId);
  const openPanel = useStopPanelStore((state) => state.openPanel);
  const closePanel = useStopPanelStore((state) => state.closePanel);

  return {
    selectedId,
    panelOpen: selectedId !== null,
    openPanel,
    closePanel,
  };
}
