import React, { useState } from 'react';
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

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });

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
        onSubmit={(e) => {
          e.preventDefault();
          submitForm(formData)
            .then((res) => {
              setToken(res.token);
              const tokenHelper = new AuthTokenHelper(res.token);
              history.push(routes.profile(tokenHelper.getProfileId()));
            })
            .catch(setError);
        }}
      >
        <div className="my-2">
          <label htmlFor="username">User name:</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value
              })
            }
          />
        </div>

        <div className="my-2">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
          />
        </div>

        <ErrorHandler error={error} />

        <button className="my-2" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
