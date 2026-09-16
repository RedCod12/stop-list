import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

const TONE_CLASS = {
  neutral: 'bg-ink/8 text-ink/80',
  stop: 'bg-accent/10 text-accent',
  ok: 'bg-emerald-100 text-emerald-800',
} as const;

type BadgeTone = keyof typeof TONE_CLASS;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        TONE_CLASS[tone],
        className,
      )}
      {...props}
    />
  );
}
