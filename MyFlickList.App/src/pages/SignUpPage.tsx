import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignUpRequest } from '../infra/api.generated';
import ErrorHandler from '../shared/ErrorHandler';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import useAuthToken from '../shared/useAuthToken';
import { routes } from './Routing';

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export default function SignUpPage() {
  const [token] = useAuthToken();
  const history = useHistory();
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign up" />

      <h1>Sign up</h1>

      <div>
        Already have a profile? <Link href={routes.signIn.href()}>Sign in</Link> with your existing
        account.
      </div>

      <form
        className="my-4 space-y-4"
        onSubmit={handleSubmit((data) => {
          api
            .auth(token)
            .signUp(
              new SignUpRequest({
                ...data
              })
            )
            .then(() => history.push(routes.signIn.href()))
            .catch(setError);
        })}
      >
        <div>
          <label htmlFor="username">User name:</label>
          <input type="text" name="username" required ref={register} />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" required ref={register} />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" required ref={register} />
        </div>

        <div>
          <label htmlFor="passwordConfirm">Password (confirm):</label>
          <input
            type="password"
            name="passwordConfirm"
            required
            ref={register({ validate: (v: string) => v === watch('password') })}
          />
        </div>

        <ErrorHandler error={error} />

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
