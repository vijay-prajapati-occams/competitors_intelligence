'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiError } from '@/services/api';
import { competitorFormSchema, CompetitorFormSchemaValues } from '@/features/competitors/schemas';

const COMPETITOR_TYPE_OPTIONS: { value: CompetitorFormSchemaValues['competitorType']; label: string }[] = [
  { value: 'direct', label: 'Direct' },
  { value: 'indirect', label: 'Indirect' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'benchmark', label: 'Benchmark' },
];

interface CompetitorFormProps {
  defaultValues?: Partial<CompetitorFormSchemaValues>;
  onSubmit: (values: CompetitorFormSchemaValues) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
}

export function CompetitorForm({ defaultValues, onSubmit, submitLabel, onCancel }: CompetitorFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompetitorFormSchemaValues>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      industry: '',
      country: '',
      competitorType: 'direct',
      description: '',
      notes: '',
      ...defaultValues,
    },
  });

  async function handleFormSubmit(values: CompetitorFormSchemaValues) {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, message]) => {
            setError(field as keyof CompetitorFormSchemaValues, { message });
          });
        }
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {formError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Company name</Label>
          <Input id="name" placeholder="Acme Corp" {...register('name')} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" placeholder="acme.com" {...register('domain')} />
          {errors.domain && <p className="text-xs text-destructive">{errors.domain.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" placeholder="Software" {...register('industry')} />
          {errors.industry && <p className="text-xs text-destructive">{errors.industry.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="country">Country</Label>
          <Input id="country" placeholder="United States" {...register('country')} />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="competitorType">Competitor type</Label>
          <Controller
            control={control}
            name="competitorType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="competitorType" className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {COMPETITOR_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.competitorType && (
            <p className="text-xs text-destructive">{errors.competitorType.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What does this competitor do?"
          rows={3}
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Internal notes about this competitor"
          rows={3}
          {...register('notes')}
        />
        {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
