import classnames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  className?: string;
  type?: 'text' | 'number' | 'date' | 'password' | 'email' | 'search' | 'submit';
  name: string;
  icon?: React.ReactNode;
  label?: string;
  autoFocus?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export default function FormInput({
  className,
  name,
  icon,
  label,
  required,
  ...props
}: FormInputProps) {
  const form = useFormContext();

  return (
    <div className={classnames(className, 'flex-grow')}>
      {label && (
        <label
          className={classnames(
            'w-full',
            'mb-1',
            'flex',
            'flex-row',
            'items-center',
            'space-x-1',
            'font-semibold'
          )}
          htmlFor={name}
        >
          {icon}
          <div>{label}</div>
          {required && <div className={classnames('text-red-500')}>*</div>}
        </label>
      )}

      <input
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
        required={required}
        ref={form.register}
      />
    </div>
  );
}
