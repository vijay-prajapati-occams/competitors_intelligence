import Link from 'next/link';
import type { Metadata } from 'next';
import { GuestOnly } from '@/features/auth/components/guest-only';
import { AuthCard } from '@/features/auth/components/auth-card';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Log in | CompetitiveIQ',
};

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthCard
        title="Welcome back"
        description="Log in to your competitive intelligence workspace."
        footer={
          <>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </GuestOnly>
  );
}
