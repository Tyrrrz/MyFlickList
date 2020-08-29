import React from 'react';
import Breadcrumb from '../../shared/Breadcrumb';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function ProfilePage() {
  return (
    <div>
      <Meta title="Profile" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Profile' }]} />

      <p className="display-4 text-center">You are not logged in</p>

      <p className="mt-2 lead text-center">
        <Link href="/profile/login">Log in</Link> or{' '}
        <Link href="/profile/register">create a new profile</Link>
      </p>
    </div>
  );
}
