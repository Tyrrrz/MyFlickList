import React from 'react';
import Link from '../shared/Link';
import Meta from '../shared/Meta';

export default function CreditsPage() {
  return (
    <div>
      <Meta title="Credits" />

      <h1>Credits</h1>

      <div className="mt-3 text-lg font-semibold">Graphics</div>
      <ul>
        <li>
          <Link href="https://feathericons.com" target="_blank">
            Feather Icons
          </Link>
        </li>
        <li>
          <Link href="https://flaticon.com/free-icon/tv-monitor_2916372" target="_blank">
            TV Monitor icon by surang
          </Link>
        </li>
      </ul>
    </div>
  );
}
