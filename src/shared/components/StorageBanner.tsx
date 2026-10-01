import { Button } from '@/components/ui/button';
import { dismissCorrupted, useStorageStatus, type StorageStatus } from '@/shared/storage-status';

interface StorageBannerViewProps extends StorageStatus {
  onOpenSettings?: () => void;
  onDismissCorrupted?: () => void;
}

export function StorageBannerView({ writeFailed, corrupted, onOpenSettings, onDismissCorrupted }: StorageBannerViewProps) {
  if (!writeFailed && corrupted.length === 0) return null;
  return (
    <div className="space-y-px">
      {writeFailed && (
        <div role="alert" className="flex flex-wrap items-center gap-3 bg-destructive/10 px-6 py-2 text-sm text-destructive">
          <p className="flex-1">
            Your changes can't be saved in this browser (storage is full or blocked). They will be lost when you close the tab.
          </p>
          {onOpenSettings && (
            <Button size="sm" variant="outline" onClick={onOpenSettings}>
              Open Settings to export a backup
            </Button>
          )}
        </div>
      )}
      {corrupted.length > 0 && (
        <div role="status" className="flex flex-wrap items-center gap-3 bg-amber-500/10 px-6 py-2 text-sm text-amber-700 dark:text-amber-300">
          <p className="flex-1">Some saved data couldn't be read and was reset to defaults ({corrupted.join(', ')}).</p>
          <Button size="sm" variant="ghost" onClick={onDismissCorrupted}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}

/** Warns when LocalStorage can't be written or read. Rendered at the top of the app shell. */
export function StorageBanner({ onOpenSettings }: { onOpenSettings: () => void }) {
  const status = useStorageStatus();
  return <StorageBannerView {...status} onOpenSettings={onOpenSettings} onDismissCorrupted={dismissCorrupted} />;
}
