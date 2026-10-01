import { useState } from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerRunner } from '@/modules/timer-engine/hooks/use-timer-runner';
import { describeTimer, totalDuration } from '@/modules/timer-engine/lib/timer';
import { useQueue } from '@/modules/timer-queue/hooks/use-queue';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { NamePrompt } from '@/shared/components/NamePrompt';
import { useNotice } from '@/shared/hooks/use-notice';
import { formatHuman } from '@/shared/lib/format';
import { useTemplates } from '../hooks/use-templates';
import type { Template } from '../types/template';

function summary(t: Template): string {
  if (t.kind === 'timer' && t.def) return describeTimer(t.def);
  const items = t.items ?? [];
  const totals = items.map((i) => totalDuration(i.def));
  const total = totals.some((x) => x === null) ? null : totals.reduce<number>((a, x) => a + (x ?? 0), 0);
  return `${items.length} timers${total === null ? '' : ` · ${formatHuman(total)}`}`;
}

export function TemplatesDrawer() {
  const { templates, rename, remove } = useTemplates();
  const queue = useQueue();
  const runner = useTimerRunner();
  const runActive = runner.run !== null && runner.run.status !== 'finished';
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Template | null>(null);
  const [notice, showNotice] = useNotice();

  const addToQueue = (t: Template) => {
    queue.addItems(t.kind === 'set' ? (t.items ?? []) : t.def ? [{ name: t.name, def: t.def }] : []);
    showNotice(`Added "${t.name}" to the queue.`);
  };

  if (templates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="font-medium">No templates yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a timer and choose “Save as template”, or save your queue from the Queue panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {runActive && <p className="text-sm text-muted-foreground">A timer is running. Stop it to start a template right away.</p>}
      <ul aria-label="Templates" className="space-y-2">
        {templates.map((t) =>
          renamingId === t.id ? (
            <li key={t.id}>
              <NamePrompt
                label="Template name"
                initialValue={t.name}
                submitLabel="Rename"
                onCancel={() => setRenamingId(null)}
                onSubmit={(name) => {
                  rename(t.id, name);
                  setRenamingId(null);
                }}
              />
            </li>
          ) : (
            <li key={t.id} className="flex items-center gap-2 rounded-lg border p-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.kind === 'timer' ? 'Timer' : 'Set'} · {summary(t)}
                </p>
              </div>
              {t.kind === 'timer' && t.def && (
                <Button size="sm" disabled={runActive} onClick={() => runner.start(t.def!, t.name)}>
                  Start now
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => addToQueue(t)}>
                Add to queue
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label={`Rename ${t.name}`} onClick={() => setRenamingId(t.id)}>
                <PencilIcon aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label={`Delete ${t.name}`} onClick={() => setDeleting(t)}>
                <Trash2Icon aria-hidden="true" />
              </Button>
            </li>
          ),
        )}
      </ul>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {notice}
      </p>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete this template?"
        description={`"${deleting?.name ?? ''}" will be removed permanently.`}
        confirmLabel="Delete"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) remove(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
