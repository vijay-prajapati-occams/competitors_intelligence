'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as newsService from '@/services/news.service';
import { ApiError } from '@/services/api';

interface RefreshNewsButtonProps {
  competitorId: string;
  onCollected?: () => void;
  variant?: 'default' | 'outline';
}

export function RefreshNewsButton({ competitorId, onCollected, variant = 'outline' }: RefreshNewsButtonProps) {
  const [isCollecting, setIsCollecting] = useState(false);

  async function handleClick() {
    setIsCollecting(true);
    try {
      const summary = await newsService.collectCompetitorNews(competitorId);
      toast.success(`${summary.newMentions} new mention${summary.newMentions === 1 ? '' : 's'} found.`);
      onCollected?.();
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'Unable to collect competitor news. Check the news provider configuration or try again.'
      );
    } finally {
      setIsCollecting(false);
    }
  }

  return (
    <Button variant={variant} onClick={handleClick} disabled={isCollecting}>
      {isCollecting ? <Loader2 className="animate-spin" /> : <RefreshCw />}
      {isCollecting ? 'Collecting latest mentions…' : 'Refresh Intelligence'}
    </Button>
  );
}
