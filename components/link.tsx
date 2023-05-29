import c from 'classnames';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { isAbsoluteUrl } from '~/utils/url';

type NormalLinkProps = {
  button?: false;
  href: string;
  external?: boolean;
};

type ButtonLinkProps = {
  button: true;
  onClick: () => void;
};

type LinkProps = PropsWithChildren<
  (NormalLinkProps | ButtonLinkProps) & {
    variant?: 'normal' | 'discreet' | 'hidden';
  }
>;

const Link: FC<LinkProps> = ({ variant = 'normal', children, ...props }) => {
  const className = c({
    'text-blue-500': variant === 'normal',
    'hover:underline': variant === 'normal',
    'hover:text-blue-500': variant === 'discreet'
  });

  if (props.button) {
    const { onClick } = props;

    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  } else {
    const { href, external = isAbsoluteUrl(href) } = props;
    const RawLink = external ? 'a' : NextLink;

    return (
      <RawLink
        className={className}
        href={href}
        target={external ? '_blank' : undefined}
        rel="noreferrer"
      >
        {children}
      </RawLink>
    );
  }
};

export default Link;
