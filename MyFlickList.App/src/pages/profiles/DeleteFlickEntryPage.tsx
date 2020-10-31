import React, { useState } from 'react';
import { useQueryCache } from 'react-query';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

export default function DeleteFlickEntryPage() {
  const history = useHistory();
  const { profileId, profileName, flickId } = useParams();
  const [token] = useAuthToken();

  const queryCache = useQueryCache();
  const flickEntry = useQuery(
    () => api.profiles(token).getFlickEntry(Number(profileId), Number(flickId)),
    ['flickEntry', profileId, flickId]
  );

  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Remove Flick from Profile" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Remove Flick from Profile</h1>

        <p>
          Are you sure you want to remove{' '}
          <span className="font-semibold">{flickEntry.flickTitle}</span> from your profile?
        </p>

        <ErrorAlert error={error} />

        <div className="flex flex-row items-center space-x-2">
          <button
            type="submit"
            onClick={async (e) => {
              try {
                e.preventDefault();
                await api.profiles(token).deleteFlickEntry(Number(profileId), Number(flickId));
                queryCache.clear();
                history.push(routes.profile({ profileId: Number(profileId), profileName }));
              } catch (error) {
                setError(error);
              }
            }}
          >
            Delete
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              history.goBack();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
