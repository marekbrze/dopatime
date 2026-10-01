import { Component, useState, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { STORAGE_PREFIX } from '@/shared/storage';

export function ErrorFallback({ onReload, onReset }: { onReload: () => void; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div role="alert" className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        Dopatime hit an unexpected error. Reloading usually fixes it. If it keeps happening, the saved data may be damaged,
        and resetting it will clear your queue, templates and settings.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onReload}>Reload</Button>
        {confirming ? (
          <Button variant="destructive" onClick={onReset}>
            Yes, erase my data
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setConfirming(true)}>
            Reset app data
          </Button>
        )}
      </div>
    </div>
  );
}

interface State {
  failed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private reload = () => window.location.reload();

  private reset = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      }
    } finally {
      window.location.reload();
    }
  };

  render() {
    return this.state.failed ? <ErrorFallback onReload={this.reload} onReset={this.reset} /> : this.props.children;
  }
}
