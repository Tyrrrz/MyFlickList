import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgAsterisk } from 'react-icons/cg';
import { FiAtSign, FiUser } from 'react-icons/fi';
import { useHistory } from 'react-router';
import api from '../infra/api';
import { SignUpRequest } from '../infra/api.generated';
import ErrorHandler from '../shared/ErrorHandler';
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
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign up" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Sign up</h1>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (data) => {
            try {
              if (data.password !== data.passwordConfirm) {
                throw 'Passwords must match';
              }

              await api.auth(token).signUp(
                new SignUpRequest({
                  ...data
                })
              );

              return history.push(routes.signIn.href());
            } catch (error) {
              return setError(error);
            }
          })}
        >
          <div>
            <label className="flex flex-row items-center" htmlFor="username">
              <FiUser /> <span className="ml-1">User name:</span>
            </label>
            <input
              className="w-1/3"
              type="text"
              name="username"
              autoFocus
              required
              minLength={3}
              maxLength={48}
              ref={register}
            />
          </div>

          <div>
            <label className="flex flex-row items-center" htmlFor="email">
              <FiAtSign /> <span className="ml-1">Email:</span>
            </label>
            <input
              className="w-1/3"
              type="email"
              name="email"
              required
              minLength={3}
              maxLength={256}
              ref={register}
            />
          </div>

          <div>
            <label className="flex flex-row items-center" htmlFor="password">
              <CgAsterisk /> <span className="ml-1">Password:</span>
            </label>
            <input
              className="w-1/3"
              type="password"
              name="password"
              required
              minLength={6}
              maxLength={1024}
              ref={register}
            />
          </div>

          <div>
            <label className="flex flex-row items-center" htmlFor="passwordConfirm">
              <CgAsterisk /> <span className="ml-1">Password (confirm):</span>
            </label>
            <input
              className="w-1/3"
              type="password"
              name="passwordConfirm"
              required
              minLength={6}
              maxLength={1024}
              ref={register}
            />
          </div>

          <ErrorHandler error={error} />

          <button type="submit" disabled={formState.isSubmitting}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
