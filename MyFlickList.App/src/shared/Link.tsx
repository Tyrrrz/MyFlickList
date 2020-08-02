import React from 'react';
import { Link as InternalLink } from 'react-router-dom';
import { OutboundLink as ExternalLink } from 'react-ga';

interface Props {
  href: string;
}

export default function Link({ href, ...props }: Props & React.HTMLAttributes<HTMLAnchorElement>) {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(href);

  return isAbsolute ? <ExternalLink to={href} eventLabel={href} {...props} /> : <InternalLink to={href} {...props} />;
}
