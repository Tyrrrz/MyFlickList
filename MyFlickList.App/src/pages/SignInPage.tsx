import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignInRequest } from '../infra/api.generated';
import { AuthTokenHelper } from '../infra/helpers';
import Breadcrumb from '../shared/Breadcrumb';
import ErrorHandler from '../shared/ErrorHandler';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import useAuth from '../shared/useAuth';
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
  const { setToken } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });

  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign in" />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Sign in' }]} />

      <h1>Log in</h1>

      <p className="lead">
        Not registered yet? <Link href={routes.signUp()}>Create a new profile</Link>.
      </p>

      <form
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
        <div className="form-group">
          <label htmlFor="username">User name:</label>
          <input
            type="text"
            className="form-control"
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

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
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

        <button type="submit" className="btn btn-primary">
          Log in
        </button>
      </form>
    </div>
  );
}
