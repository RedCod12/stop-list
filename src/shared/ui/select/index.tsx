'use client';

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
} from 'react';

import { cn } from '@/shared/lib';

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  invalid?: boolean;
  ref?: Ref<HTMLSelectElement>;
};

type OptionData = {
  value: string;
  label: string;
  disabled: boolean;
};

function readOptions(children: ReactNode): OptionData[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') return [];
    const option = child as ReactElement<{
      value?: string | number;
      disabled?: boolean;
      children?: ReactNode;
    }>;
    const value = String(option.props.value ?? '');
    const label = String(option.props.children ?? value);
    return [{ value, label, disabled: Boolean(option.props.disabled) }];
  });
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  if (ref && typeof ref === 'object') {
    ref.current = value;
  }
}

export function Select({
  className,
  invalid,
  children,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  id,
  name,
  required,
  ref,
  ...props
}: SelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const options = useMemo(() => readOptions(children), [children]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    String(defaultValue ?? options[0]?.value ?? ''),
  );
  const [open, setOpen] = useState(false);
  const selectedValue = isControlled ? String(value) : internalValue;
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ??
    (selectedValue || '—');

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (next: string) => {
    if (!isControlled) setInternalValue(next);
    const el = selectRef.current;
    if (el) el.value = next;
    onChange?.({
      target: { value: next, name },
      currentTarget: { value: next, name },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <select
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        value={selectedValue}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-px w-px opacity-0"
        onChange={onChange}
        onBlur={onBlur}
        ref={(node) => {
          selectRef.current = node;
          assignRef(ref, node);
        }}
        {...props}
      >
        {children}
      </select>

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onBlur={() => {
          if (!onBlur || !selectRef.current) return;
          onBlur({
            target: selectRef.current,
            currentTarget: selectRef.current,
          } as FocusEvent<HTMLSelectElement>);
        }}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-lg border bg-white py-2 pl-3 pr-3 text-left text-sm text-ink outline-none',
          invalid ? 'border-accent' : 'border-ink/15 focus:border-accent',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4 shrink-0 text-ink"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m4 6 4 4 4-4"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-ink/10 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const selected = option.value === selectedValue;
            return (
              <li key={option.value || '__empty'}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  onClick={() => pick(option.value)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                    selected
                      ? 'bg-accent/10 text-ink'
                      : 'text-ink hover:bg-paper',
                    option.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-flex w-4 shrink-0 justify-center text-xs"
                  >
                    {selected ? '✓' : ''}
                  </span>
                  <span className="min-w-0 truncate">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
