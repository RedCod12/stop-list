import { cn } from '@/shared/lib';

type StateCardProps = {
  tone?: 'muted' | 'error';
  children: string;
};

export function StateCard({ tone = 'muted', children }: StateCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white px-4 py-16 text-center text-sm ring-1',
        tone === 'error'
          ? 'text-accent ring-accent/20'
          : 'text-ink/50 ring-ink/8',
      )}
    >
      {children}
    </div>
  );
}
