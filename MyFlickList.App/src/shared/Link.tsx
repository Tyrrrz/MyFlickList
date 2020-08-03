import React from 'react';
import { Link as InternalLink } from 'react-router-dom';
import { OutboundLink as ExternalLink } from 'react-ga';

interface Props {
  href: string;
  target?: string | undefined;
}

export default function Link({ href, target, ...props }: Props & React.HTMLAttributes<HTMLAnchorElement>) {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  return isAbsolute ? (
    <ExternalLink to={href} eventLabel={href} target={target} {...props} />
  ) : (
    <InternalLink to={href} target={target} {...props} />
  );
}
