import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { clampDuration } from '@/modules/timer-engine/lib/timer';
import type { TimerDef } from '@/modules/timer-engine/types/timer';
import { MINUTE } from '@/shared/lib/format';

interface QueueItemEditorProps {
  name: string;
  def: TimerDef;
  onSave: (draft: { name: string; def: TimerDef }) => void;
  onCancel: () => void;
}

const toMinutes = (ms: number) => Math.round((ms / MINUTE) * 100) / 100;
const fromMinutes = (min: number) => clampDuration(Math.max(0.1, min) * MINUTE);

/** Inline editor for one queue item: name plus duration (simple) or phases and cycles (alternating). */
export function QueueItemEditor({ name, def, onSave, onCancel }: QueueItemEditorProps) {
  const [draftName, setDraftName] = useState(name);
  const [draftDef, setDraftDef] = useState<TimerDef>(def);
  const nameId = useId();
  const minutesId = useId();
  const cyclesId = useId();
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => nameInput.current?.focus(), []);

  const setPhaseMinutes = (index: number, min: number) =>
    setDraftDef((d) =>
      d.kind === 'alternating'
        ? { ...d, phases: d.phases.map((p, i) => (i === index ? { ...p, durationMs: fromMinutes(min) } : p)) }
        : d,
    );

  return (
    <form
      className="space-y-3 rounded-lg border bg-muted/40 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name: draftName, def: draftDef });
      }}
    >
      <div className="space-y-1 text-sm">
        <label htmlFor={nameId} className="block font-medium">
          Name
        </label>
        <Input
          id={nameId}
          ref={nameInput}
          value={draftName}
          maxLength={60}
          onKeyDown={(e) => e.key === 'Escape' && onCancel()}
          onChange={(e) => setDraftName(e.target.value)}
        />
      </div>

      {draftDef.kind === 'simple' ? (
        <div className="space-y-1 text-sm">
          <label htmlFor={minutesId} className="block font-medium">
            Minutes
          </label>
          <Input
            id={minutesId}
            type="number"
            min={0.1}
            step="any"
            value={toMinutes(draftDef.durationMs)}
            onChange={(e) => setDraftDef({ kind: 'simple', durationMs: fromMinutes(Number(e.target.value)) })}
          />
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <p className="font-medium">Phases (minutes)</p>
          <div className="flex flex-wrap gap-2">
            {draftDef.phases.map((p, i) => (
              <Input
                key={p.id}
                type="number"
                min={0.1}
                step="any"
                className="w-24"
                aria-label={`Phase ${i + 1} minutes`}
                value={toMinutes(p.durationMs)}
                onChange={(e) => setPhaseMinutes(i, Number(e.target.value))}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor={cyclesId}>Cycles</label>
              <Input
                id={cyclesId}
                type="number"
                min={1}
                max={99}
                className="w-20"
                disabled={draftDef.cycles === null}
                value={draftDef.cycles ?? ''}
                onChange={(e) => setDraftDef({ ...draftDef, cycles: Math.max(1, Number(e.target.value) || 1) })}
              />
            </div>
            <span className="flex items-center gap-2">
              <Switch
                aria-label="Repeat forever"
                checked={draftDef.cycles === null}
                onCheckedChange={(forever) => setDraftDef({ ...draftDef, cycles: forever ? null : 4 })}
              />
              Repeat forever
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
