import classnames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormTextAreaProps {
  className?: string;
  name: string;
  icon?: React.ReactNode;
  label?: string;
  autoFocus?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export default function FormTextArea({
  className,
  name,
  icon,
  label,
  ...props
}: FormTextAreaProps) {
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

      <textarea
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
        style={{ minHeight: '6rem' }}
        rows={5}
        name={name}
        ref={form.register}
      />
    </div>
  );
}
