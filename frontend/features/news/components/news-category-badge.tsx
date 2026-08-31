import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NewsCategory } from '@/types/news';

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  funding: 'Funding',
  partnership: 'Partnership',
  acquisition: 'Acquisition',
  product_launch: 'Product Launch',
  leadership: 'Leadership',
  award: 'Award',
  expansion: 'Expansion',
  customer_win: 'Customer Win',
  legal: 'Legal',
  security: 'Security',
  pricing: 'Pricing',
  marketing: 'Marketing',
  research: 'Research',
  general: 'General',
};

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  funding: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  partnership: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  acquisition: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  product_launch: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
  leadership: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  award: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  expansion: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  customer_win: 'bg-lime-500/10 text-lime-700 dark:text-lime-400',
  legal: 'bg-red-500/10 text-red-700 dark:text-red-400',
  security: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  pricing: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400',
  marketing: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  research: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  general: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
};

export function NewsCategoryBadge({ category, className }: { category: NewsCategory; className?: string }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', CATEGORY_STYLES[category], className)}>
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}

export { CATEGORY_LABELS };
