import { useId, type ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';

interface SwitchRowProps {
  label: string;
  hint?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SwitchRow({ label, hint, checked, onCheckedChange }: SwitchRowProps) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id={id} className="text-sm font-medium">
          {label}
        </p>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      <Switch aria-labelledby={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
