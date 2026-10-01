import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { XIcon } from 'lucide-react';
import { formatClock, formatHuman, MAX_DURATION_MS } from '@/shared/lib/format';
import { MAX_CYCLES, type useBuilder } from '../hooks/use-builder';
import { DurationButtons } from './DurationButtons';

type Builder = ReturnType<typeof useBuilder>;

/** Mode toggle, duration buttons, phases and cycles. Shared by the stage and the queue's add form. */
export function TimerDefinitionEditor({ builder: b, compact = false }: { builder: Builder; compact?: boolean }) {
  const alternating = b.mode === 'alternating';
  const cyclesId = useId();
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div role="group" aria-label="Timer type" className="inline-flex rounded-lg border p-1">
        {(['simple', 'alternating'] as const).map((mode) => (
          <Button
            key={mode}
            size="sm"
            variant={b.mode === mode ? 'secondary' : 'ghost'}
            aria-pressed={b.mode === mode}
            onClick={() => b.setMode(mode)}
          >
            {mode === 'simple' ? 'Simple' : 'Alternating'}
          </Button>
        ))}
      </div>

      {alternating && (
        <div className="w-full space-y-3">
          {b.phases.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Build a duration below, then click “Add phase”. Phases run in turn, e.g. 25 min work, 5 min break.
            </p>
          ) : (
            <ol aria-label="Phases" className="flex flex-wrap justify-center gap-2">
              {b.phases.map((p, i) => (
                <li key={p.id} className="flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 text-sm">
                  <span>
                    Phase {i + 1}: <strong>{formatHuman(p.durationMs)}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove phase ${i + 1}`}
                    onClick={() => b.removePhase(p.id)}
                  >
                    <XIcon aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      <p
        role="status"
        aria-label="Built duration"
        className={`font-mono font-semibold tabular-nums ${compact ? 'text-4xl' : 'text-6xl'}`}
      >
        {formatClock(b.durationMs)}
      </p>

      <DurationButtons onAdd={b.addTime} size={compact ? 'sm' : 'default'} />
      {b.durationMs >= MAX_DURATION_MS && (
        <p role="status" className="text-sm text-muted-foreground">
          That's the maximum: {formatClock(MAX_DURATION_MS)}.
        </p>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size={compact ? 'sm' : 'default'} onClick={b.clearTime} disabled={b.durationMs === 0}>
          Clear
        </Button>
        {alternating && (
          <Button variant="outline" size={compact ? 'sm' : 'default'} onClick={b.addPhase} disabled={b.durationMs === 0}>
            Add phase
          </Button>
        )}
      </div>

      {alternating && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <label htmlFor={cyclesId}>Cycles</label>
            <Input
              id={cyclesId}
              type="number"
              min={1}
              max={MAX_CYCLES}
              className="w-20"
              disabled={b.cycles === null}
              value={b.cycles ?? ''}
              onChange={(e) => b.setCycles(Number(e.target.value) || 1)}
            />
          </span>
          <span className="flex items-center gap-2">
            <Switch
              aria-label="Repeat forever"
              checked={b.cycles === null}
              onCheckedChange={(forever) => b.setCycles(forever ? null : 4)}
            />
            Repeat forever
          </span>
        </div>
      )}
    </div>
  );
}
