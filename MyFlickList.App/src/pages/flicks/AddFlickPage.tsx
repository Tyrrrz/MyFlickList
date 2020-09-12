import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLoader } from 'react-icons/fi';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';

interface FormData {
  sourceUrl: string;
}

export default function AddFlickPage() {
  const history = useHistory();
  const [token] = useAuthToken();
  const { register, handleSubmit, formState } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Add Flick" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Add Flick</h1>

        <p>
          If a movie or series you&apos;re looking for is not available, you can add it by simply
          copy-pasting its{' '}
          <Link href="https://imdb.com" target="_blank">
            IMDB
          </Link>{' '}
          link. All of the associated data will be pulled automatically.
        </p>

        {!token && (
          <div className="p-4 border rounded border-red-400 bg-red-100 text-red-700">
            <p>
              You need to be <Link href={routes.signIn.href()}>signed in</Link> in order to request
              a new flick
            </p>
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit(async (data) => {
            try {
              const { flickId } = await api.flicks(token).addFlick(data);
              return history.push(routes.flick.href({ flickId }));
            } catch (error) {
              return setError(error);
            }
          })}
        >
          <div>
            <label htmlFor="sourceUrl">IMDB link:</label>

            <div className="flex flex-row items-center space-x-2">
              <input
                className="w-full"
                type="url"
                name="sourceUrl"
                required
                placeholder="https://imdb.com/title/tt0029583"
                disabled={formState.isSubmitting || !token}
                ref={register}
              />

              {!formState.isSubmitting ? (
                <button type="submit" disabled={formState.isSubmitting || !token}>
                  Pull
                </button>
              ) : (
                <div className="px-3">
                  <FiLoader className="text-xl animate-spin" />
                </div>
              )}
            </div>
          </div>

          <ErrorAlert error={error} />
        </form>
      </div>
    </div>
  );
}
