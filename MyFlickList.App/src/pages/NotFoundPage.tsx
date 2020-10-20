import React from 'react';
import { useLocation } from 'react-router';
import { routes } from '../Routing';
import Link from '../shared/Link';
import Meta from '../shared/Meta';

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <div>
      <Meta title="Not Found" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Not Found</h1>

        <p className="text-lg">
          Requested page (<code>{pathname}</code>) does not exist
        </p>

        <div>
          <Link href={routes.home()}>Return to home page</Link>
        </div>
      </div>
    </div>
  );
}
