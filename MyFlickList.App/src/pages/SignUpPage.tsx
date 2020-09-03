import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignUpRequest } from '../infra/api.generated';
import ErrorHandler from '../shared/ErrorHandler';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import { routes } from './PageRouter';

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function submitForm({ username, email, password, passwordConfirm }: FormData) {
  if (!username || !email || !password || !passwordConfirm) {
    return Promise.reject('All fields are required');
  }

  if (password !== passwordConfirm) {
    return Promise.reject('Passwords do not match');
  }

  return api.auth.signUp(
    new SignUpRequest({
      username,
      email,
      password
    })
  );
}

export default function SignUpPage() {
  const history = useHistory();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign up" />

      <h1>Sign up</h1>

      <div>
        Already have a profile? <Link href={routes.signIn()}>Sign in</Link> with your existing
        account.
      </div>

      <form
        className="my-4"
        onSubmit={(e) => {
          e.preventDefault();
          submitForm(formData)
            .then(() => history.push(routes.signIn()))
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
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

        <div className="my-2">
          <label htmlFor="password-confirm">Password (confirm):</label>
          <input
            type="password"
            id="password-confirm"
            value={formData.passwordConfirm}
            onChange={(e) =>
              setFormData({
                ...formData,
                passwordConfirm: e.target.value
              })
            }
          />
        </div>

        <ErrorHandler error={error} />

        <button className="my-2" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
}
