import React from 'react';
import Link from './Link';

interface BreadcrumbSegment {
  title: string;
  href?: string | undefined;
}

interface BreadcrumbItemProps {
  segment: BreadcrumbSegment;
  active?: boolean | undefined;
}

function BreadcrumbItem({ segment, active }: BreadcrumbItemProps) {
  if (!segment.href || active) {
    return <li className={`breadcrumb-item ${active && 'active'}`}>{segment.title}</li>;
  }

  return (
    <li className="breadcrumb-item">
      <Link href={segment.href}>{segment.title}</Link>
    </li>
  );
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export default function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {segments.map((segment, i) => (
          <BreadcrumbItem key={i} segment={segment} active={i === segments.length - 1} />
        ))}
      </ol>
    </nav>
  );
}
