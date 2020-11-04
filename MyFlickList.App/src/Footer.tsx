import classnames from 'classnames';
import React from 'react';
import Link from './components/Link';
import routes from './routes';

export default function Footer() {
  return (
    <footer
      className={classnames(
        'text-center',
        'py-3',
        'uppercase',
        'text-sm',
        'transition-opacity',
        'duration-150',
        'opacity-50',
        'hover:opacity-100'
      )}
    >
      <Link href="https://twitter.com/My_Flick_List">Twitter</Link>
      {' • '}
      <Link href="https://discord.gg/hgVa7qS">Discord</Link>
      {' • '}
      <Link href="https://github.com/Tyrrrz/MyFlickList">Source</Link>
      {' • '}
      <Link href={routes.misc.credits()}>Credits</Link>
      {' • '}
      <Link href={routes.misc.feedback()}>Feedback</Link>
      {' • '}
      <Link href={routes.misc.donate()}>Donate</Link>
    </footer>
  );
}
