import type { ReactNode } from 'react';

/** A titled group inside a drawer. Same heading weight and spacing in every drawer. */
export function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}
