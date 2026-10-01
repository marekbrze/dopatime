interface ModulePlaceholderProps {
  module: string;
}

/** Stand-in until proto-lofi builds the module's real screens. */
export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  return (
    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
      Module <code>{module}</code> will be built here.
    </p>
  );
}
