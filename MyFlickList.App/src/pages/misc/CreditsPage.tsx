import React from 'react';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function CreditsPage() {
  return (
    <div>
      <Meta title="Credits" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Credits</h1>

        <p>
          This page lists all external assets used by MyFlickList that require formal attribution,
          along with their corresponding licenses.
        </p>

        {/* Graphics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-xl font-semibold">Graphics</div>

          <div>
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
