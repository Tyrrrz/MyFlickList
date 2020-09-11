import React from 'react';
import { FiHeart } from 'react-icons/fi';
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

        <div className="p-4 flex flex-row border rounded border-pink-200 bg-pink-100 space-x-10">
          <div>
            <p>
              If you enjoy using this site, please consider donating to make the project more
              sustainable. Every little bit helps!
            </p>

            <ul className="mt-1">
              <li>
                <Link href="https://patreon.com/Tyrrrz" target="_blank">
                  Patreon
                </Link>{' '}
                <span className="font-light">(recurring)</span>
              </li>

              <li>
                <Link href="https://buymeacoffee.com/Tyrrrz" target="_blank">
                  BuyMeACoffee
                </Link>{' '}
                <span className="font-light">(one-time)</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-gray-700 italic">
              In case the above donation options don&apos;t work for you, please{' '}
              <Link href="https://twitter.com/Tyrrrz" target="_blank">
                contact me on Twitter
              </Link>{' '}
              to figure out an alternative.
            </p>
          </div>

          <div className="self-center text-6xl text-pink-200">
            <FiHeart strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
