import { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimerDefinitionEditor } from '@/modules/timer-engine/components/TimerDefinitionEditor';
import { useBuilder } from '@/modules/timer-engine/hooks/use-builder';
import { useTimerRunner } from '@/modules/timer-engine/hooks/use-timer-runner';
import { describeTimer, totalDuration } from '@/modules/timer-engine/lib/timer';
import { useTemplates } from '@/modules/templates/hooks/use-templates';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { NamePrompt } from '@/shared/components/NamePrompt';
import { SwitchRow } from '@/shared/components/SwitchRow';
import { useNotice } from '@/shared/hooks/use-notice';
import { formatHuman } from '@/shared/lib/format';
import { useQueue } from '../hooks/use-queue';
import type { QueueItem } from '../types/queue';
import { QueueItemEditor } from './QueueItemEditor';

const STATUS_LABEL = { queued: 'Queued', running: 'Running', done: 'Done' } as const;
const STATUS_DOT = { queued: 'bg-muted-foreground/40', running: 'bg-primary', done: 'bg-emerald-500' } as const;

function QueueRow({
  item,
  index,
  count,
  editing,
  onEdit,
  onDragOver,
  onDragStart,
  onDrop,
  onRemove,
}: {
  item: QueueItem;
  index: number;
  count: number;
  editing: boolean;
  onEdit: (id: string | null) => void;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onRemove: (item: QueueItem) => void;
}) {
  const queue = useQueue();
  if (editing) {
    return (
      <li>
        <QueueItemEditor
          name={item.name}
          def={item.def}
          onCancel={() => onEdit(null)}
          onSave={(draft) => {
            queue.updateItem(item.id, draft);
            onEdit(null);
          }}
        />
      </li>
    );
  }
  const running = item.status === 'running';
  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={onDrop}
      className="flex items-center gap-2 rounded-lg border p-2"
    >
      <span
        role="img"
        aria-label={STATUS_LABEL[item.status]}
        title={STATUS_LABEL[item.status]}
        className={`size-2.5 shrink-0 rounded-full ${STATUS_DOT[item.status]}`}
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${item.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>
          {item.name}
        </p>
        <p className="text-xs text-muted-foreground">{describeTimer(item.def)}</p>
      </div>
      <div className="flex shrink-0">
        <Button variant="ghost" size="icon-sm" aria-label={`Move ${item.name} up`} disabled={index === 0} onClick={() => queue.moveItem(item.id, -1)}>
          <ArrowUpIcon aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Move ${item.name} down`} disabled={index === count - 1} onClick={() => queue.moveItem(item.id, 1)}>
          <ArrowDownIcon aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${item.name}`} disabled={running} onClick={() => onEdit(item.id)}>
          <PencilIcon aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Duplicate ${item.name}`} onClick={() => queue.duplicateItem(item.id)}>
          <CopyIcon aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item)}>
          <Trash2Icon aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function QueueDrawer() {
  const queue = useQueue();
  const runner = useTimerRunner();
  const templates = useTemplates();
  const builder = useBuilder('queue-builder');
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [removing, setRemoving] = useState<QueueItem | null>(null);
  const [notice, showNotice] = useNotice();

  const empty = queue.items.length === 0;
  const hasInfinite = queue.items.some((i) => totalDuration(i.def) === null);
  const allDone = !empty && queue.items.every((i) => i.status === 'done');
  const queueRunning = runner.run?.source === 'queue' && runner.run.status !== 'finished';

  const remove = (item: QueueItem) => (item.status === 'running' ? setRemoving(item) : queue.removeItem(item.id));

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {empty
            ? 'No timers yet.'
            : queue.remainingTotalMs === null
              ? `${queue.items.length} timers · runs until stopped`
              : `${queue.items.length} timers · ${formatHuman(queue.remainingTotalMs)} left`}
        </p>
        <SwitchRow
          label="Auto-start next timer"
          hint="When off, the queue waits for you to start each timer."
          checked={queue.autoAdvance}
          onCheckedChange={queue.setAutoAdvance}
        />
        {queue.autoAdvance && hasInfinite && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            A timer that repeats forever never ends, so the queue won't move past it until you stop or skip it.
          </p>
        )}
      </div>

      {empty ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="font-medium">Your queue is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add timers below, add one from the main screen, or load a template.
          </p>
        </div>
      ) : (
        <ol aria-label="Queue" className="space-y-2">
          {queue.items.map((item, index) => (
            <QueueRow
              key={item.id}
              item={item}
              index={index}
              count={queue.items.length}
              editing={editingId === item.id}
              onEdit={setEditingId}
              onDragStart={() => setDragId(item.id)}
              onDragOver={() => undefined}
              onDrop={() => {
                if (dragId) queue.reorder(dragId, item.id);
                setDragId(null);
              }}
              onRemove={remove}
            />
          ))}
        </ol>
      )}

      {adding ? (
        <div className="space-y-3 rounded-lg border p-3">
          <Input
            aria-label="Timer name"
            placeholder="Name, e.g. Plan tasks"
            maxLength={60}
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
          />
          <TimerDefinitionEditor builder={builder} compact />
          <div className="flex gap-2">
            <Button
              disabled={!builder.isValid}
              onClick={() => {
                queue.addItem({ name: addName, def: builder.def });
                setAddName('');
                builder.reset();
                setAdding(false);
              }}
            >
              Add to queue
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setAdding(true)}>
          <PlusIcon aria-hidden="true" />
          Add timer
        </Button>
      )}

      <div className="flex flex-wrap gap-2">
        <Button disabled={empty || queueRunning} onClick={queue.startQueue}>
          {allDone ? 'Run again' : 'Start queue'}
        </Button>
        <Button variant="outline" disabled={empty} onClick={() => setSavingTemplate(true)}>
          Save as template
        </Button>
        <Button variant="outline" disabled={empty} onClick={() => setConfirmClear(true)}>
          Clear queue
        </Button>
      </div>

      {savingTemplate && (
        <NamePrompt
          label="Template name"
          onCancel={() => setSavingTemplate(false)}
          onSubmit={(name) => {
            templates.saveSet(name, queue.items.map(({ name: n, def }) => ({ name: n, def })));
            setSavingTemplate(false);
            showNotice('Saved as template.');
          }}
        />
      )}
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {notice}
      </p>

      <ConfirmDialog
        open={confirmClear}
        title="Clear the queue?"
        description="All timers will be removed from the queue. A running timer will be stopped."
        confirmLabel="Clear queue"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          queue.clear();
          setConfirmClear(false);
        }}
      />
      <ConfirmDialog
        open={removing !== null}
        title="Remove the running timer?"
        description={`"${removing?.name ?? ''}" is running. Removing it stops the countdown.`}
        confirmLabel="Remove and stop"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing) queue.removeItem(removing.id);
          setRemoving(null);
        }}
      />
    </div>
  );
}
