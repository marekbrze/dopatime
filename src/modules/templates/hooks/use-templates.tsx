import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { isValidDef } from '@/modules/timer-engine/lib/timer';
import type { TimerDef } from '@/modules/timer-engine/types/timer';
import type { QueueItemDraft } from '@/modules/timer-queue/types/queue';
import { useStoredState } from '@/shared/hooks/use-stored-state';
import { generateId } from '@/shared/types';
import type { Template } from '../types/template';

interface TemplatesApi {
  templates: Template[];
  saveTimer: (name: string, def: TimerDef) => void;
  saveSet: (name: string, items: QueueItemDraft[]) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
}

const TemplatesContext = createContext<TemplatesApi | null>(null);

function isUsable(t: Template): boolean {
  if (!t || typeof t.name !== 'string') return false;
  if (t.kind === 'timer') return !!t.def && isValidDef(t.def);
  if (t.kind === 'set') return Array.isArray(t.items) && t.items.length > 0 && t.items.every((i) => i.def && isValidDef(i.def));
  return false;
}

export function TemplatesProvider({ children }: { children: ReactNode }) {
  // Entries that are corrupted (e.g. from a hand-edited import) are skipped on load.
  const [templates, setTemplates] = useStoredState<Template[]>('templates', [], (raw) =>
    Array.isArray(raw) ? (raw as Template[]).filter(isUsable) : [],
  );

  const api = useMemo<TemplatesApi>(() => {
    const create = (partial: Pick<Template, 'name' | 'kind'> & Partial<Template>): Template => {
      const now = new Date().toISOString();
      return { id: generateId(), createdAt: now, updatedAt: now, ...partial, name: partial.name.trim() || 'Untitled template' };
    };
    return {
      templates,
      saveTimer: (name, def) => setTemplates((t) => [...t, create({ name, kind: 'timer', def })]),
      saveSet: (name, items) => setTemplates((t) => [...t, create({ name, kind: 'set', items })]),
      rename: (id, name) =>
        setTemplates((t) =>
          t.map((x) => (x.id === id ? { ...x, name: name.trim() || x.name, updatedAt: new Date().toISOString() } : x)),
        ),
      remove: (id) => setTemplates((t) => t.filter((x) => x.id !== id)),
    };
  }, [templates, setTemplates]);

  return <TemplatesContext.Provider value={api}>{children}</TemplatesContext.Provider>;
}

export function useTemplates(): TemplatesApi {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error('useTemplates must be used inside TemplatesProvider');
  return ctx;
}
