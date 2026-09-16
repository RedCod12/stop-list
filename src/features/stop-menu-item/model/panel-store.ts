'use client';

import { create } from 'zustand';

import type { MenuItem } from '@/entities/menu-item';

type StopPanelState = {
  selectedId: string | null;
  selectedItem: MenuItem | null;
  openPanel: (item: MenuItem) => void;
  closePanel: () => void;
};

export const useStopPanelStore = create<StopPanelState>((set) => ({
  selectedId: null,
  selectedItem: null,
  openPanel: (item) => set({ selectedId: item.id, selectedItem: item }),
  closePanel: () => set({ selectedId: null, selectedItem: null }),
}));

export function useStopPanel() {
  const selectedId = useStopPanelStore((state) => state.selectedId);
  const selectedItem = useStopPanelStore((state) => state.selectedItem);
  const openPanel = useStopPanelStore((state) => state.openPanel);
  const closePanel = useStopPanelStore((state) => state.closePanel);

  return {
    selectedId,
    selectedItem,
    panelOpen: selectedId !== null,
    openPanel,
    closePanel,
  };
}
