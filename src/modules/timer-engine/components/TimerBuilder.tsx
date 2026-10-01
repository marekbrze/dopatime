import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NamePrompt } from '@/shared/components/NamePrompt';
import { useNotice } from '@/shared/hooks/use-notice';
import { useQueue } from '@/modules/timer-queue/hooks/use-queue';
import { useTemplates } from '@/modules/templates/hooks/use-templates';
import { useBuilder } from '../hooks/use-builder';
import { useTimerRunner } from '../hooks/use-timer-runner';
import { TimerDefinitionEditor } from './TimerDefinitionEditor';

/** The idle stage: define a timer and start it. */
export function TimerBuilder() {
  const b = useBuilder();
  const runner = useTimerRunner();
  const queue = useQueue();
  const templates = useTemplates();
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [notice, showNotice] = useNotice();

  const hint = b.isValid
    ? null
    : b.mode === 'simple'
      ? 'Add some time to start.'
      : 'Add at least one phase to start.';

  return (
    <section aria-label="Timer" className="flex w-full flex-col items-center gap-6">
      <TimerDefinitionEditor builder={b} />

      <Input
        aria-label="Timer name (optional)"
        placeholder="Name (optional), e.g. Deep work"
        className="max-w-sm"
        maxLength={60}
        value={b.name}
        onChange={(e) => b.setName(e.target.value)}
      />

      <div className="flex flex-col items-center gap-2">
        <Button size="lg" className="h-12 px-10 text-base" disabled={!b.isValid} onClick={() => runner.start(b.def, b.name.trim())}>
          Start
        </Button>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={!b.isValid}
          onClick={() => {
            queue.addItem({ name: b.name, def: b.def });
            showNotice('Added to queue.');
          }}
        >
          Add to queue
        </Button>
        <Button variant="outline" disabled={!b.isValid} onClick={() => setSavingTemplate(true)}>
          Save as template
        </Button>
      </div>

      {savingTemplate && (
        <div className="w-full max-w-md">
          <NamePrompt
            label="Template name"
            initialValue={b.name}
            onCancel={() => setSavingTemplate(false)}
            onSubmit={(name) => {
              templates.saveTimer(name, b.def);
              setSavingTemplate(false);
              showNotice('Saved as template.');
            }}
          />
        </div>
      )}

      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {notice}
      </p>
    </section>
  );
}
