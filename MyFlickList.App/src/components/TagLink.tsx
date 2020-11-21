import classnames from 'classnames';
import React from 'react';
import Link from './Link';

interface TagLinkProps {
  className?: string;
  href: string;
  children?: React.ReactNode;
}

export default function TagLink({ className, href, children }: TagLinkProps) {
  return (
    <div
      className={classnames(
        className,
        'px-3',
        'py-1',
        'rounded',
        'bg-gray-200',
        'text-sm',
        'font-semibold'
      )}
    >
      <Link href={href} underline="hover">
        {children}
      </Link>
    </div>
  );
}
