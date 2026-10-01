import { Button } from '@/components/ui/button';
import { HOUR, MINUTE } from '@/shared/lib/format';

const STEPS = [
  { label: '+1h', ms: HOUR, aria: 'Add 1 hour' },
  { label: '+15m', ms: 15 * MINUTE, aria: 'Add 15 minutes' },
  { label: '+5m', ms: 5 * MINUTE, aria: 'Add 5 minutes' },
  { label: '+1m', ms: MINUTE, aria: 'Add 1 minute' },
];

interface DurationButtonsProps {
  onAdd: (ms: number) => void;
  size?: 'default' | 'sm';
}

/** Each click adds that amount of time to the timer being built. */
export function DurationButtons({ onAdd, size = 'default' }: DurationButtonsProps) {
  return (
    <div role="group" aria-label="Add time" className="flex flex-wrap justify-center gap-2">
      {STEPS.map((s) => (
        <Button key={s.label} variant="outline" size={size} aria-label={s.aria} onClick={() => onAdd(s.ms)}>
          {s.label}
        </Button>
      ))}
    </div>
  );
}
