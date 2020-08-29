import React from 'react';
import { useLocation } from 'react-router';
import Breadcrumb from '../shared/Breadcrumb';
import Meta from '../shared/Meta';

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div>
      <Meta title="Not Found" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Not Found' }]} />

      <h1>Not Found</h1>

      <p>
        The page you requested (<code>{location.pathname}</code>) does not exist.
      </p>
    </div>
  );
}
