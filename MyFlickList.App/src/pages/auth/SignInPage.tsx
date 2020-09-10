import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLock, FiUser } from 'react-icons/fi';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { AuthTokenHelper } from '../../infra/helpers';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';

interface FormData {
  username: string;
  password: string;
}

export default function SignInPage() {
  const history = useHistory();
  const [token, setToken] = useAuthToken();
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Sign in" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Sign in</h1>

        <p className="text-lg">
          Don&apos;t have a profile yet? <Link href={routes.signUp.href()}>Sign up</Link> to create
          one!
        </p>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (data) => {
            try {
              const res = await api.auth(token).signIn({
                ...data
              });

              setToken(res.token);
              const tokenHelper = new AuthTokenHelper(res.token);

              history.push(
                routes.profile.href({
                  profileId: tokenHelper.getProfileId(),
                  profileName: tokenHelper.getUsername()
                })
              );
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
              ref={register}
            />
          </div>

          <div>
            <label className="flex flex-row items-center" htmlFor="password">
              <FiLock /> <span className="ml-1">Password:</span>
            </label>
            <input className="w-1/3" type="password" name="password" required ref={register} />
          </div>

          <ErrorAlert error={error} />

          <button type="submit" disabled={formState.isSubmitting}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
