import { useId } from 'react';
import { Slider } from '@/components/ui/slider';

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}

export function SliderRow({ label, value, min = 0, max = 100, step = 1, format, onChange }: SliderRowProps) {
  const id = useId();
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span id={id} className="font-medium">
          {label}
        </span>
        <span className="text-muted-foreground tabular-nums">{format ? format(value) : value}</span>
      </div>
      <Slider
        aria-labelledby={id}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}
