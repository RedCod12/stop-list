'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  REASON_LABELS,
  snapUntilToStep,
  stopItemPayloadSchema,
  type MenuItem,
  type StopReason,
} from '@/entities/menu-item';
import { Button, Select, toast } from '@/shared/ui';

import { upcomingSlots } from '../lib';
import { useStopMenuItem, useStopPanel } from '../model';

type StopReasonFormProps = {
  selected: MenuItem;
  editing: boolean;
};

type FormValues = {
  reason: '' | StopReason;
  untilMode: 'shift' | 'time';
  until: string;
};

export function StopReasonForm({
  selected,
  editing,
}: StopReasonFormProps) {
  const { closePanel } = useStopPanel();
  const stop = useStopMenuItem();
  const slots = useMemo(() => upcomingSlots(), []);
  const defaultUntil = slots[0]?.value ?? '';

  const form = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      reason: '',
      untilMode: 'shift',
      until: defaultUntil,
    },
  });

  useEffect(() => {
    if (selected.status.kind === 'stopped') {
      form.reset({
        reason: selected.status.reason,
        untilMode: selected.status.until ? 'time' : 'shift',
        until: selected.status.until ?? defaultUntil,
      });
      return;
    }
    form.reset({
      reason: '',
      untilMode: 'shift',
      until: defaultUntil,
    });
  }, [defaultUntil, form, selected]);

  const reason = useWatch({ control: form.control, name: 'reason' });
  const untilMode = useWatch({ control: form.control, name: 'untilMode' });
  const until = useWatch({ control: form.control, name: 'until' });

  const submit = form.handleSubmit((values) => {
    const until =
      values.untilMode === 'shift' ? null : snapUntilToStep(values.until);
    const parsed = stopItemPayloadSchema.safeParse({
      reason: values.reason,
      until,
    });
    if (!parsed.success) {
      const untilError = parsed.error.issues.find(
        (issue) => issue.path[0] === 'until',
      );
      const reasonError = parsed.error.issues.find(
        (issue) => issue.path[0] === 'reason',
      );
      if (reasonError)
        form.setError('reason', { message: reasonError.message });
      if (untilError) form.setError('until', { message: untilError.message });
      return;
    }
    stop.mutate(
      { id: selected.id, payload: parsed.data },
      {
        onSuccess: () => {
          toast.success(
            editing
              ? 'Стоп обновлён'
              : 'Позиция поставлена в стоп-лист',
          );
          closePanel();
        },
      },
    );
  });

  return (
    <form className="mt-6 flex flex-1 flex-col gap-4" onSubmit={submit}>
      <label className="flex flex-col gap-1 text-xs text-ink/60">
        Причина
        <Select
          invalid={Boolean(form.formState.errors.reason)}
          value={reason}
          {...form.register('reason', {
            validate: (value) => value !== '' || 'Укажите причину',
          })}
        >
          <option value="">Выберите причину</option>
          {Object.entries(REASON_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {form.formState.errors.reason ? (
          <span className="text-xs text-accent">
            {form.formState.errors.reason.message}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink/60">
        Срок
        <Select value={untilMode} {...form.register('untilMode')}>
          <option value="shift">До конца смены</option>
          <option value="time">Конкретное время</option>
        </Select>
      </label>

      {untilMode === 'time' ? (
        <label className="flex flex-col gap-1 text-xs text-ink/60">
          Время (шаг 15 минут)
          <Select
            invalid={Boolean(form.formState.errors.until)}
            value={until}
            {...form.register('until')}
          >
            {slots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </Select>
          {form.formState.errors.until ? (
            <span className="text-xs text-accent">
              {form.formState.errors.until.message}
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="mt-auto flex gap-2">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={closePanel}
        >
          Отмена
        </Button>
        <Button type="submit" className="flex-1" loading={stop.isPending}>
          {stop.isPending
            ? 'Сохранение…'
            : editing
              ? 'Сохранить'
              : 'Поставить в стоп'}
        </Button>
      </div>
    </form>
  );
}
