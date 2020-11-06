import classnames from 'classnames';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import { DeepPartial, FormProvider, UnpackNestedValue, useForm } from 'react-hook-form';
import { normalizeError } from '../internal/errorHelpers';
import Alert from './Alert';

interface FormProps<TFormValues> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  defaultValues?: TFormValues;
  onSubmit?: (data: TFormValues) => void | Promise<void>;
  children?: React.ReactNode;
}

export default function Form<TFormValues = Record<string, unknown>>({
  className,
  orientation = 'vertical',
  defaultValues,
  onSubmit,
  children
}: FormProps<TFormValues>) {
  const form = useForm<TFormValues>({
    defaultValues: defaultValues as UnpackNestedValue<DeepPartial<TFormValues>>
  });

  const [error, setError] = useState<unknown>();

  const actualOnSubmit = useCallback(
    async (e: FormEvent) => {
      if (onSubmit) {
        try {
          const handler = form.handleSubmit((data) => onSubmit(data as TFormValues));
          await handler(e);
        } catch (error) {
          setError(error);
        }
      }
    },
    [form, onSubmit, setError]
  );

  const normalizedError = useMemo(() => (error ? normalizeError(error) : undefined), [error]);

  return (
    <FormProvider {...form}>
      <form
        className={classnames(
          className,
          { flex: orientation === 'horizontal' },
          { 'items-end': orientation === 'horizontal' },
          { 'space-y-3': orientation === 'vertical' },
          { 'space-x-3': orientation === 'horizontal' }
        )}
        onSubmit={actualOnSubmit}
      >
        {children}

        {normalizedError && (
          <Alert
            type="error"
            title={normalizedError.title}
            message={normalizedError.details}
            sub={normalizedError.code ? `Code: ${normalizedError.code}` : undefined}
          >
            {normalizedError.validationErrors && (
              <ul>
                {Object.entries(normalizedError.validationErrors).map(([, values]) =>
                  values.map((value, i) => <li key={value + i}>{value}</li>)
                )}
              </ul>
            )}
          </Alert>
        )}
      </form>
    </FormProvider>
  );
}
