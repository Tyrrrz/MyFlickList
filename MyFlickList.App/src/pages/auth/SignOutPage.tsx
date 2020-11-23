import classnames from 'classnames';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import Page from '../../components/Page';
import Section from '../../components/Section';
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
    <Page title="Sign Out">
      <Section title="Sign Out" className={classnames('text-xl')}>
        Signing out...
      </Section>
    </Page>
  );
}
