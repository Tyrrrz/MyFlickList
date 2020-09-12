import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { routes } from '../../Routing';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';

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

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Sign out</h1>

        <p>You have been signed out. Hope to see you again soon!</p>

        <div>
          <Link href={routes.home.href()}>Return to home page</Link>
        </div>
      </div>
    </div>
  );
}
