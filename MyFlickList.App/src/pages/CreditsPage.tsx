import React from 'react';
import Breadcrumb from '../shared/Breadcrumb';
import Link from '../shared/Link';
import Meta from '../shared/Meta';

export default function CreditsPage() {
  return (
    <div>
      <Meta title="Credits" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Credits' }]} />

      <h1>Credits</h1>

      <h2>Graphics</h2>
      <ul>
        <li>
          <Link href="https://feathericons.com/" target="_blank">
            Feather Icons
          </Link>
        </li>
        <li>
          TV Monitor icon by{' '}
          <Link href="https://flaticon.com/free-icon/tv-monitor_2916372" target="_blank">
            surang
          </Link>
        </li>
      </ul>
    </div>
  );
}
