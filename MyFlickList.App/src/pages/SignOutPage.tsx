import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Breadcrumb from '../shared/Breadcrumb';
import Meta from '../shared/Meta';
import useAuth from '../shared/useAuth';
import { routes } from './PageRouter';

export default function SignOutPage() {
  const history = useHistory();
  const { setToken } = useAuth();

  // TODO: request token invalidation on the server?
  useEffect(() => {
    setToken(undefined);
  }, [history, setToken]);

  return (
    <div>
      <Meta title="Sign out" />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Sign out' }]} />

      <h1>Sign out</h1>

      <p>You can now sign in again</p>
    </div>
  );
}
