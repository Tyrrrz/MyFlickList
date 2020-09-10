import React from 'react';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function DonatePage() {
  return (
    <div>
      <Meta title="Donate" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Donate</h1>

        <p>
          MyFlickList is a personal project built and maintained by{' '}
          <Link href="https://tyrrrz.me" target="_blank">
            Alexey Golub
          </Link>
          . Besides occupying a significant amount of time, there are some financial costs
          associated as well. These include hosting, domain, development tools, hardware, and more.
        </p>

        <p>
          If you enjoy using this site, please consider donating to make the project more
          sustainable. Every little bit helps!
        </p>

        <ul>
          <li>
            <Link href="https://patreon.com/Tyrrrz" target="_blank">
              Patreon
            </Link>{' '}
            (recurring)
          </li>

          <li>
            <Link href="https://buymeacoffee.com/Tyrrrz" target="_blank">
              BuyMeACoffee
            </Link>{' '}
            (one-time)
          </li>
        </ul>

        <p>
          In case neither of the donation options works for you, please{' '}
          <Link href="https://twitter.com/Tyrrrz" target="_blank">
            contact me on Twitter
          </Link>{' '}
          to figure out an alternative.
        </p>
      </div>
    </div>
  );
}
