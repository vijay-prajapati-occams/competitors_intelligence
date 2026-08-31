'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/services/api';
import { registerSchema, RegisterFormValues } from '@/features/auth/schemas';

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, message]) => {
            setError(field as keyof RegisterFormValues, { message });
          });
        }
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" placeholder="John" {...register('firstName')} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" placeholder="Smith" {...register('lastName')} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@company.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="At least 8 characters" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Separator className="my-1" />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyName">Company name</Label>
        <Input id="companyName" placeholder="Acme Inc." {...register('companyName')} />
        {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyWebsite">Company website</Label>
        <Input id="companyWebsite" placeholder="https://acme.com" {...register('companyWebsite')} />
        {errors.companyWebsite && (
          <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
