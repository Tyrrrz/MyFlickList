import React from 'react';
import { Link as InternalLink } from 'react-router-dom';
import { OutboundLink as ExternalLink } from 'react-ga';

interface Props {
  to: string;
}

export default function Link({ to, ...props }: Props & React.HTMLAttributes<HTMLAnchorElement>) {
  const isAbsolute = /^[a-z][a-z\d+\-.]*:/iu.test(to);

  return isAbsolute ? <ExternalLink to={to} eventLabel={to} {...props} /> : <InternalLink to={to} {...props} />;
}
