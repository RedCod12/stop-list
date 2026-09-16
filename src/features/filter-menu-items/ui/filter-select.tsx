import { Select } from '@/shared/ui';

type FilterSelectProps = {
  label: string;
  value: string;
  emptyLabel: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  emptyLabel,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-xs text-ink/60">
      {label}
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{emptyLabel}</option>
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </Select>
    </label>
  );
}
