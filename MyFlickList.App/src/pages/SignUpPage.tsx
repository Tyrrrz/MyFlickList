import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignUpRequest } from '../infra/api.generated';
import Breadcrumb from '../shared/Breadcrumb';
import ErrorHandler from '../shared/ErrorHandler';
import Meta from '../shared/Meta';
import { routes } from './PageRouter';

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function submitForm(formData: FormData) {
  if (!formData.username || !formData.email || !formData.password || !formData.passwordConfirm) {
    return Promise.reject('All fields are required');
  }

  if (formData.password !== formData.passwordConfirm) {
    return Promise.reject('Passwords do not match');
  }

  return api.auth.signUp(
    new SignUpRequest({
      username: formData.username,
      email: formData.email,
      password: formData.password
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

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Sign up' }]} />

      <h1>Sign up</h1>

      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          submitForm(formData)
            .then(() => history.push(routes.signIn()))
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
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

        <div className="form-group">
          <label htmlFor="password-confirm">Password (confirm):</label>
          <input
            type="password"
            className="form-control"
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

        <button type="submit" className="btn btn-primary">
          Sign up
        </button>
      </form>
    </div>
  );
}
