import React from 'react';
import { Redirect } from 'react-router';
import Breadcrumb from '../../shared/Breadcrumb';
import Meta from '../../shared/Meta';
import useAuth from '../../shared/useAuth';
import { routes } from '../PageRouter';

export default function ProfilePage() {
  const { token } = useAuth();

  if (!token) {
    return <Redirect to={routes.signIn()} />;
  }

  return (
    <div>
      <Meta title="Profile" />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Profile' }]} />

      <h1>Profile</h1>

      <p>Hi, {token?.getUsername()}!</p>
    </div>
  );
}
