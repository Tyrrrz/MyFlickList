import React from 'react';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function DonatePage() {
  return (
    <div>
      <Meta title="Donate" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Donate</h1>

        <p className="text-lg">
          MyFlickList is built and maintained by a{' '}
          <Link href="https://tyrrrz.me" target="_blank">
            single person
          </Link>
          . You can help offset development, infrastructural, and operational costs by donating.
          Every little bit helps 💛
        </p>

        <ul className="text-lg">
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
      </div>
    </div>
  );
}
