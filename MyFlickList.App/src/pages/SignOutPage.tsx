import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Meta from '../shared/Meta';
import useAuthToken from '../shared/useAuthToken';

export default function SignOutPage() {
  const [, setToken] = useAuthToken();
  const history = useHistory();

  // TODO: request token invalidation on the server?
  useEffect(() => {
    setToken(undefined);
  }, [history, setToken]);

  return (
    <div>
      <Meta title="Sign out" />

      <h1>Sign out</h1>

      <div>You have been signed out. Come back soon :)</div>
    </div>
  );
}
