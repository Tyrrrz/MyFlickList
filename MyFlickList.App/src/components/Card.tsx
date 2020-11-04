import classnames from 'classnames';
import React from 'react';

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Card({ className, children }: CardProps) {
  return (
    <div className={classnames(className, 'p-6', 'border', 'rounded', 'bg-white', 'space-y-3')}>
      {children}
    </div>
  );
}
