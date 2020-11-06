import classnames from 'classnames';
import React from 'react';

interface SectionProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export default function Section({ className, title, children }: SectionProps) {
  return (
    <div className={classnames(className, 'p-6', 'border', 'rounded', 'bg-white', 'space-y-3')}>
      {title && <div className={classnames('text-2xl', 'font-thin', 'tracking-wide')}>{title}</div>}

      {children}
    </div>
  );
}
