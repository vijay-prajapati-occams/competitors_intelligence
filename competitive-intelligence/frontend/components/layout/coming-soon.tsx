import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-24 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Construction className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Data collection for this module is not available yet.
      </p>
      <span className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        Coming in Phase 2+
      </span>
    </div>
  );
}
