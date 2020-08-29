import classNames from 'classnames';
import React from 'react';

interface LoadingSpinnerProps {
  kind?: 'spin' | 'pulse' | undefined;
  size?: number | undefined;
}

export default function LoadingSpinner({ kind = 'spin', size }: LoadingSpinnerProps) {
  return (
    <div
      className={classNames({
        'text-primary': true,
        'spinner-border': kind === 'spin',
        'spinner-grow': kind === 'pulse'
      })}
      style={{
        width: size && `${size}rem`,
        height: size && `${size}rem`
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
