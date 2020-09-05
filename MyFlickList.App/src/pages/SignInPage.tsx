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
import { routes } from './PageRouter';

interface FormData {
  username: string;
  password: string;
}

function submitForm({ username, password }: FormData) {
  if (!username || !password) {
    return Promise.reject('All fields are required');
  }

  return api.auth.signIn(
    new SignInRequest({
      username: username,
      password: password
    })
  );
}

export default function SignInPage() {
  const history = useHistory();
  const [, setToken] = useAuthToken();
  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign in" />

      <h1>Sign in</h1>

      <div>
        Don&apos;t have a profile yet? <Link href={routes.signUp()}>Sign up</Link> to create one!
      </div>

      <form
        className="my-4"
        onSubmit={handleSubmit((data) => {
          submitForm(data)
            .then((res) => {
              setToken(res.token);
              const tokenHelper = new AuthTokenHelper(res.token);
              history.push(routes.profile(tokenHelper.getProfileId()));
            })
            .catch(setError);
        })}
      >
        <div className="my-2">
          <label htmlFor="username">User name:</label>
          <input type="text" name="username" ref={register} />
        </div>

        <div className="my-2">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" ref={register} />
        </div>

        <ErrorHandler error={error} />

        <button className="my-2" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
