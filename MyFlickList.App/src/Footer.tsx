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
      <Link href="https://twitter.com/My_Flick_List" underline="hover">
        Twitter
      </Link>
      {' • '}
      <Link href="https://discord.gg/hgVa7qS" underline="hover">
        Discord
      </Link>
      {' • '}
      <Link href="https://github.com/Tyrrrz/MyFlickList" underline="hover">
        Source
      </Link>
      {' • '}
      <Link href={routes.misc.credits()} underline="hover">
        Credits
      </Link>
      {' • '}
      <Link href={routes.misc.feedback()} underline="hover">
        Feedback
      </Link>
      {' • '}
      <Link href={routes.misc.donate()} underline="hover">
        Donate
      </Link>
    </footer>
  );
}
