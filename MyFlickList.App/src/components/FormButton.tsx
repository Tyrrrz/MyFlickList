import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import Spinner from './Spinner';

interface ButtonProps {
  className?: string;
  isSubmit?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: MouseEventHandler;
  children?: React.ReactNode;
}

export default function FormButton({
  className,
  isSubmit,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const form = useFormContext();

  return (
    <button
      {...props}
      className={classnames(
        className,
        'px-4',
        'py-2',
        'border',
        'border-gray-400',
        'rounded-md',
        'text-gray-700',
        'text-lg',
        'font-semibold',
        'hover:border-gray-500',
        'focus:border-gray-500',
        'disabled:bg-gray-100',
        'disabled:text-gray-600',
        'disabled:cursor-not-allowed'
      )}
      type={isSubmit ? 'submit' : 'button'}
      disabled={disabled || form.formState.isSubmitting}
    >
      {isSubmit && form.formState.isSubmitting ? <Spinner /> : children}
    </button>
  );
}
