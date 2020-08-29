import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { LoginRequest } from '../../infra/api.generated';
import Breadcrumb from '../../shared/Breadcrumb';
import ErrorHandler from '../../shared/ErrorHandler';
import Meta from '../../shared/Meta';

interface FormData {
  userName: string;
  password: string;
}

function submitForm(formData: FormData) {
  if (!formData.userName || !formData.password) {
    return Promise.reject('All fields are required');
  }

  return api.auth.login(
    new LoginRequest({
      userName: formData.userName,
      password: formData.password
    })
  );
}

export default function LoginPage() {
  const history = useHistory();

  const [formData, setFormData] = useState<FormData>({
    userName: '',
    password: ''
  });

  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Log in" />

      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Profile', href: '/profile' },
          { title: 'Log in' }
        ]}
      />

      <h1>Log in</h1>

      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          submitForm(formData)
            .then(() => history.push('/profile'))
            .catch(setError);
        }}
      >
        <div className="form-group">
          <label htmlFor="username">User name:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value
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
