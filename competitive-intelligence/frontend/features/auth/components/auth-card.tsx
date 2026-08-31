import Link from 'next/link';
import { Radar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">CompetitiveIQ</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
