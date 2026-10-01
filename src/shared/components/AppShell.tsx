import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DRAWERS, type DrawerId } from '@/shared/shell/drawers';

interface AppShellProps {
  /** Compact timer shown in the header, so the countdown stays visible when a drawer is open. */
  miniTimer: ReactNode;
  /** Main stage: the large timer. */
  children: ReactNode;
  /** Drawer content per module. */
  drawers: Record<DrawerId, ReactNode>;
}

export function AppShell({ miniTimer, children, drawers }: AppShellProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerId | null>(null);
  const active = DRAWERS.find((d) => d.id === openDrawer);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Dopatime</h1>
        <div aria-live="off">{miniTimer}</div>
        <nav aria-label="Panels" className="flex justify-end gap-2">
          {DRAWERS.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={openDrawer === id ? 'secondary' : 'outline'}
              aria-pressed={openDrawer === id}
              onClick={() => setOpenDrawer(openDrawer === id ? null : id)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center p-6">
        {children}
      </main>

      <Sheet open={openDrawer !== null} onOpenChange={(open) => !open && setOpenDrawer(null)}>
        <SheetContent side="right">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.label}</SheetTitle>
                <SheetDescription>{active.description}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-4 pb-4">{drawers[active.id]}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
