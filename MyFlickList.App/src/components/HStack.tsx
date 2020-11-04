import classnames from 'classnames';
import React from 'react';

interface HStackProps {
  className?: string;
  spacing?: number;
  children?: React.ReactNode;
}

export default function HStack({ className, spacing = 3, children }: HStackProps) {
  return (
    <div
      className={classnames(className, 'flex', 'flex-row', 'items-center', {
        'space-x-1': spacing === 1,
        'space-x-2': spacing === 2,
        'space-x-3': spacing === 3,
        'space-x-4': spacing === 4,
        'space-x-5': spacing === 5
      })}
    >
      {children}
    </div>
  );
}
