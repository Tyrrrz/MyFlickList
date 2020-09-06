import React from 'react';
import { useLocation } from 'react-router';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import { routes } from './Routing';

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div>
      <Meta title="Not Found" />

      <h1>Not Found</h1>

      <div>
        Page <code>{pathname}</code> does not exist.
      </div>

      <div className="mt-3">
        <Link href={routes.home.href()}>Go to home page</Link>
      </div>
    </div>
  );
}
