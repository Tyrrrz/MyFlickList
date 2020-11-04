import classnames from 'classnames';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Select from 'react-select';

interface Option<TValue = unknown> {
  label: string;
  value: TValue;
}

interface FormSelectProps {
  className?: string;
  name: string;
  icon?: React.ReactNode;
  label?: string;
  options: Option[];
  autoFocus?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export default function FormSelect({ className, name, icon, label, ...props }: FormSelectProps) {
  const form = useFormContext();

  return (
    <div className={className}>
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

      <Controller
        control={form.control}
        name={name}
        render={(controllerProps) => <Select {...props} {...controllerProps} name={name} />}
      />
    </div>
  );
}
