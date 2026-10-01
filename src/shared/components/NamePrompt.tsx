import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NamePromptProps {
  label: string;
  initialValue?: string;
  submitLabel?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

/** A small inline "type a name and confirm" row. */
export function NamePrompt({ label, initialValue = '', submitLabel = 'Save', onSubmit, onCancel }: NamePromptProps) {
  const [value, setValue] = useState(initialValue);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };
  return (
    <form onSubmit={handle} className="flex items-center gap-2">
      <Input
        ref={input}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
        aria-label={label}
        placeholder={label}
        value={value}
        maxLength={60}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit">{submitLabel}</Button>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
