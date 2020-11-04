import classnames from 'classnames';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import Page from '../../components/Page';
import useAuth from '../../context/useAuth';
import routes from '../../routes';

export default function SignOutPage() {
  const auth = useAuth();

  // TODO: request token invalidation on the server?
  useEffect(() => {
    auth.resetToken();
  }, [auth]);

  // If not signed in, redirect to home page
  if (!auth.token) {
    return <Redirect to={routes.home()} />;
  }

  return (
    <Page title="Sign out">
      <div className={classnames('text-xl')}>Signing out...</div>
    </Page>
  );
}
