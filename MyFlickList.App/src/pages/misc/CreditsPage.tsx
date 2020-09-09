import React from 'react';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function CreditsPage() {
  return (
    <div>
      <Meta title="Credits" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Credits</h1>

        <p className="text-lg">
          MyFlickList is an open source project that relies on various assets provided by the
          community. This page lists all external components that require formal attribution, along
          with the licenses they were published under.
        </p>

        {/* Graphics */}
        <div className="flex flex-row space-x-2">
          <div className="flex-grow text-xl font-semibold">Graphics</div>

          <div className="flex-grow">
            <ul>
              <li>
                <Link href="https://feathericons.com" target="_blank">
                  Feather Icons
                </Link>{' '}
                (MIT License)
              </li>
              <li>
                <Link href="https://flaticon.com/free-icon/tv-monitor_2916372" target="_blank">
                  TV Monitor icon by surang
                </Link>{' '}
                (Flaticon License)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
