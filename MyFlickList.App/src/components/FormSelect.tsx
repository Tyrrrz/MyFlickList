import classnames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Option<TOption = unknown> {
  label: string;
  value: TOption;
}

interface FormSelectProps<TOption> {
  className?: string;
  name: string;
  icon?: React.ReactNode;
  label?: string;
  options: Option<TOption>[];
  autoFocus?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export default function FormSelect<TOption>({
  className,
  name,
  icon,
  label,
  options,
  ...props
}: FormSelectProps<TOption>) {
  const form = useFormContext();

  return (
    <div className={classnames(className, 'flex-grow')}>
      {label && (
        <label
          className={classnames(
            'flex',
            'flex-row',
            'items-center',
            'mb-1',
            'space-x-1',
            'font-semibold'
          )}
          htmlFor={name}
        >
          {icon}
          <div>{label}</div>
        </label>
      )}

      <select
        {...props}
        className={classnames(
          'w-full',
          'px-4',
          'py-2',
          'border',
          'border-gray-400',
          'rounded-md',
          'text-gray-700',
          'hover:border-gray-500',
          'focus:border-gray-500',
          'focus:outline-none',
          'disabled:bg-gray-100',
          'disabled:text-gray-600',
          'disabled:cursor-not-allowed'
        )}
        name={name}
        ref={form.register}
      >
        {options.map((option) => (
          <option key={option.label + option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
