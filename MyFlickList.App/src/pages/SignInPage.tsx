import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignInRequest } from '../infra/api.generated';
import { AuthTokenHelper } from '../infra/helpers';
import ErrorHandler from '../shared/ErrorHandler';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import useAuthToken from '../shared/useAuthToken';
import { routes } from './Routing';

interface FormData {
  username: string;
  password: string;
}

export default function SignInPage() {
  const [token, setToken] = useAuthToken();
  const history = useHistory();
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign in" />

      <h1>Sign in</h1>

      <div>
        Don&apos;t have a profile yet? <Link href={routes.signUp.href()}>Sign up</Link> to create
        one!
      </div>

      <form
        className="my-4 space-y-4"
        onSubmit={handleSubmit((data) => {
          api
            .auth(token)
            .signIn(
              new SignInRequest({
                ...data
              })
            )
            .then((res) => {
              setToken(res.token);
              const tokenHelper = new AuthTokenHelper(res.token);

              history.push(
                routes.profile.href({
                  profileId: tokenHelper.getProfileId(),
                  profileName: tokenHelper.getUsername()
                })
              );
            })
            .catch(setError);
        })}
      >
        <div>
          <label htmlFor="username">User name:</label>
          <input type="text" name="username" required ref={register} />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required ref={register} />
        </div>

        <ErrorHandler error={error} />

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
