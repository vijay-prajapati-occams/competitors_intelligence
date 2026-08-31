import Link from 'next/link';
import type { Metadata } from 'next';
import { GuestOnly } from '@/features/auth/components/guest-only';
import { AuthCard } from '@/features/auth/components/auth-card';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Create account | CompetitiveIQ',
};

export default function RegisterPage() {
  return (
    <GuestOnly>
      <AuthCard
        title="Create your workspace"
        description="Set up your organization and start tracking competitors."
        footer={
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </GuestOnly>
  );
}
