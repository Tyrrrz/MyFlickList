import React from 'react';
import { OutboundLink as ExternalLink } from 'react-ga';
import { Link as InternalLink } from 'react-router-dom';
import { isAbsoluteUrl } from '../infra/utils';

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  target?: string;
}

export default function Link({ href, target, ...props }: LinkProps) {
  return isAbsoluteUrl(href) ? (
    <ExternalLink {...props} to={href} eventLabel={href} target={target} />
  ) : (
    <InternalLink {...props} to={href} target={target} />
  );
}
