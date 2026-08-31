import {
  LayoutDashboard,
  Users,
  Globe,
  Search,
  KeyRound,
  Link2,
  TrendingUp,
  Newspaper,
  Tags,
  Briefcase,
  Sparkles,
  FileBarChart,
  Bell,
  Plug,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Competitors', href: '/dashboard/competitors', icon: Users },
  { label: 'Website Changes', href: '/dashboard/website-changes', icon: Globe, comingSoon: true },
  { label: 'SEO Intelligence', href: '/dashboard/seo-intelligence', icon: Search, comingSoon: true },
  { label: 'Keywords', href: '/dashboard/keywords', icon: KeyRound, comingSoon: true },
  { label: 'Backlinks', href: '/dashboard/backlinks', icon: Link2, comingSoon: true },
  { label: 'Traffic', href: '/dashboard/traffic', icon: TrendingUp, comingSoon: true },
  { label: 'News & Mentions', href: '/dashboard/news', icon: Newspaper },
  { label: 'Products & Pricing', href: '/dashboard/products-pricing', icon: Tags, comingSoon: true },
  { label: 'Hiring', href: '/dashboard/hiring', icon: Briefcase, comingSoon: true },
  { label: 'AI Intelligence', href: '/dashboard/ai-intelligence', icon: Sparkles, comingSoon: true },
  { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart, comingSoon: true },
  { label: 'Alerts', href: '/dashboard/alerts', icon: Bell, comingSoon: true },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Plug, comingSoon: true },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
