import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

const VARIANT_CLASS = {
  primary: 'bg-accent text-white hover:bg-[#a83a27]',
  ghost: 'bg-white text-ink ring-1 ring-ink/10 hover:bg-paper',
  danger: 'bg-white text-accent ring-1 ring-accent/30 hover:bg-accent/5',
} as const;

const SPINNER_CLASS = {
  primary: 'border-white/40 border-t-white',
  ghost: 'border-ink/20 border-t-ink',
  danger: 'border-ink/20 border-t-ink',
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASS;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({
  variant = 'primary',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASS[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className={cn(
            'h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2',
            SPINNER_CLASS[variant],
          )}
        />
      ) : null}
      {children}
    </button>
  );
}
