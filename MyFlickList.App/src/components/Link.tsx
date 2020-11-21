import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';
import { OutboundLink as ExternalLink } from 'react-ga';
import { Link as InternalLink } from 'react-router-dom';
import { isAbsoluteUrl } from '../internal/utils';

type UnderlineTrigger = 'always' | 'hover' | 'never';

interface LinkProps {
  className?: string;
  href: string;
  title?: string;
  underline?: UnderlineTrigger;
  onClick?: MouseEventHandler;
  children?: React.ReactNode;
}

export default function Link({
  className,
  href,
  underline = 'always',
  children,
  ...props
}: LinkProps) {
  const actualClassName = classnames(
    className,
    { underline: underline === 'always' },
    { 'hover:underline': underline === 'hover' }
  );

  if (!isAbsoluteUrl(href)) {
    return (
      <InternalLink {...props} className={actualClassName} to={href}>
        {children}
      </InternalLink>
    );
  }

  return (
    <ExternalLink
      {...props}
      className={actualClassName}
      to={href}
      eventLabel={href}
      target="_blank"
    >
      {children}
    </ExternalLink>
  );
}
