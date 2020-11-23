import classnames from 'classnames';
import React from 'react';

interface SeparatorProps {
  type?: 'horizontal' | 'vertical';
}

export default function Separator({ type = 'horizontal' }: SeparatorProps) {
  if (type === 'vertical') {
    return <VerticalSeparator />;
  } else {
    return <HorizontalSeparator />;
  }
}

function HorizontalSeparator() {
  return <hr className={classnames('w-3/4', 'my-8', 'mx-auto')} />;
}

function VerticalSeparator() {
  return <div className={classnames('w-px', 'h-8', 'mt-1', 'mx-4', 'border', 'border-gray-200')} />;
}
