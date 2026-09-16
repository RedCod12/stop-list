'use client';

import {
  REASON_LABELS,
  SHOP_LABELS,
  type MenuItem,
} from '@/entities/menu-item';
import { useStopPanel } from '@/features/stop-menu-item';
import { Badge, Button } from '@/shared/ui';
import { AnimatePresence, motion } from 'framer-motion';

type StopListRowProps = {
  item: MenuItem;
  pending: boolean;
  resumePending: boolean;
  onResume: () => void;
};

function formatUntil(until: string | null): string {
  if (until === null) return 'до конца смены';
  const date = new Date(until);
  if (Number.isNaN(date.getTime())) return until;
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function StopListRow({
  item,
  pending,
  resumePending,
  onResume,
}: StopListRowProps) {
  const { openPanel } = useStopPanel();
  const stopped = item.status.kind === 'stopped';
  const resumeBlocked = item.stock === 0;
  const statusKey = item.status.kind;

  return (
    <tr className={stopped ? 'bg-paper/80 text-ink/55' : 'text-ink'}>
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3">{SHOP_LABELS[item.shop]}</td>
      <td className="px-4 py-3">{item.stock}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={statusKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <Badge tone={stopped ? 'stop' : 'ok'}>
                {stopped ? 'В стоп-листе' : 'В продаже'}
              </Badge>
            </motion.span>
          </AnimatePresence>
          {item.status.kind === 'stopped' && (
            <span className="text-xs">
              {REASON_LABELS[item.status.reason]} ·{' '}
              {formatUntil(item.status.until)}
            </span>
          )}
          <AnimatePresence initial={false}>
            {pending ? (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="text-xs text-ink/45"
              >
                сохраняется
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {stopped ? (
            <>
              <Button
                variant="ghost"
                disabled={pending}
                onClick={() => openPanel(item)}
              >
                Изменить
              </Button>
              <Button
                variant="ghost"
                loading={pending && resumePending}
                disabled={resumeBlocked || pending}
                title={
                  resumeBlocked
                    ? 'Нельзя вернуть в продажу при остатке 0'
                    : undefined
                }
                onClick={onResume}
              >
                {pending && resumePending
                  ? 'Сохранение…'
                  : 'Вернуть в продажу'}
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              disabled={pending}
              onClick={() => openPanel(item)}
            >
              В стоп-лист
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
