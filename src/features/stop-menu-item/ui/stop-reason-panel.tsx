'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';

import type { MenuItem } from '@/entities/menu-item';
import { Button } from '@/shared/ui';

import { useStopPanel } from '../model';
import { StopReasonForm } from './stop-reason-form';

type StopReasonPanelProps = {
  items: MenuItem[];
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function StopReasonPanel({ items }: StopReasonPanelProps) {
  const { panelOpen, selectedId, selectedItem, closePanel } = useStopPanel();
  const fromList = items.find((item) => item.id === selectedId);
  const selected = fromList ?? selectedItem;
  const editing = selected?.status.kind === 'stopped';
  const panelRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!panelOpen || !selected) return;

    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (node) => !node.hasAttribute('disabled'),
          )
        : [];

    const first = focusables()[0];
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;
      const nodes = focusables();
      if (nodes.length === 0) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && active === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previousFocus.current?.focus();
    };
  }, [closePanel, panelOpen, selected]);

  return (
    <AnimatePresence>
      {panelOpen && selected ? (
        <>
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Закрыть панель"
            className="fixed inset-0 z-30 bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closePanel}
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-0 right-0 z-40 flex h-full w-[400px] max-w-full flex-col bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="text-lg font-semibold">
                  {editing ? 'Изменить стоп' : 'Поставить в стоп-лист'}
                </h2>
                <p id={descId} className="mt-1 text-sm text-ink/60">
                  {selected.title}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                aria-label="Закрыть"
                className="shrink-0 px-2"
                onClick={closePanel}
              >
                ×
              </Button>
            </div>
            <StopReasonForm
              selected={selected}
              editing={Boolean(editing)}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
