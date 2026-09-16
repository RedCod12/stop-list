'use client';

import {
  REASON_LABELS,
  SHOP_LABELS,
  type MenuItem,
} from '@/entities/menu-item';
import { useStopPanel } from '@/features/stop-menu-item';
import { Badge, Button } from '@/shared/ui';

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

  return (
    <tr className={stopped ? 'bg-paper/80 text-ink/55' : 'text-ink'}>
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3">{SHOP_LABELS[item.shop]}</td>
      <td className="px-4 py-3">{item.stock}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={stopped ? 'stop' : 'ok'}>
            {stopped ? 'В стоп-листе' : 'В продаже'}
          </Badge>
          {item.status.kind === 'stopped' && (
            <span className="text-xs">
              {REASON_LABELS[item.status.reason]} ·{' '}
              {formatUntil(item.status.until)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {stopped ? (
            <>
              <Button variant="ghost" onClick={() => openPanel(item.id)}>
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
                Вернуть в продажу
              </Button>
            </>
          ) : (
            <Button variant="danger" onClick={() => openPanel(item.id)}>
              В стоп-лист
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
