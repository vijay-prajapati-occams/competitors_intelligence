'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Competitor } from '@/types/competitor';

interface DeleteCompetitorDialogProps {
  competitor: Competitor | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (competitor: Competitor) => Promise<void>;
}

export function DeleteCompetitorDialog({ competitor, onOpenChange, onConfirm }: DeleteCompetitorDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    if (!competitor) return;
    setIsDeleting(true);
    try {
      await onConfirm(competitor);
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={Boolean(competitor)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete competitor</DialogTitle>
          <DialogDescription>
            This will permanently remove <span className="font-medium text-foreground">{competitor?.name}</span> and
            all of its associated data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
