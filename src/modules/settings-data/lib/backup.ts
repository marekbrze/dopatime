import { STORAGE_PREFIX } from '@/shared/storage';

const BACKUP_VERSION = 1;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
/** Runtime state that doesn't belong in a backup. */
const EXCLUDED = new Set([`${STORAGE_PREFIX}active-run`]);

interface BackupFile {
  app: 'dopatime';
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function buildBackup(): BackupFile {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX) || EXCLUDED.has(key)) continue;
    try {
      data[key] = JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
      // skip unreadable entries
    }
  }
  return { app: 'dopatime', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
}

export function downloadBackup(): void {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dopatime-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ParseResult = { ok: true; backup: BackupFile } | { ok: false; error: string };

export async function parseBackupFile(file: File): Promise<ParseResult> {
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: 'That file is too large (over 2 MB).' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  const b = parsed as Partial<BackupFile> | null;
  if (!b || b.app !== 'dopatime' || typeof b.data !== 'object' || b.data === null) {
    return { ok: false, error: "That doesn't look like a Dopatime backup." };
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version and is not supported.' };
  }
  return { ok: true, backup: b as BackupFile };
}

/** Replaces all stored Dopatime data with the backup, then reloads the page. */
export function applyBackup(backup: BackupFile): void {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
  }
  for (const [key, value] of Object.entries(backup.data)) {
    if (key.startsWith(STORAGE_PREFIX) && !EXCLUDED.has(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
  window.location.reload();
}
