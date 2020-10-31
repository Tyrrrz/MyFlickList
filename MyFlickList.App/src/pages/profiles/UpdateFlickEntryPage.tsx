import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryCache } from 'react-query';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { ProfileFlickEntryStatus } from '../../infra/api.generated';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';

interface FormData {
  flickId: number;
  status?: ProfileFlickEntryStatus;
  episodeCount?: number;
  rating?: number;
  review?: string;
}

export default function UpdateFlickEntryPage() {
  const history = useHistory();
  const { profileId, profileName } = useParams();
  const [token] = useAuthToken();

  const queryCache = useQueryCache();

  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Add Flick to Profile" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Add Flick to Profile</h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(async ({ flickId, ...data }) => {
            try {
              await api.profiles(token).updateFlickEntry(Number(profileId), flickId, data);
              queryCache.clear();
              history.push(routes.profile({ profileId: Number(profileId), profileName }));
            } catch (error) {
              setError(error);
            }
          })}
        >
          <div>
            <label htmlFor="flickId">Flick ID:</label>
            <input className="w-1/3" type="text" name="flickId" ref={register} />
          </div>

          <div>
            <label htmlFor="status">Status:</label>
            <select className="w-1/3" name="status" ref={register}>
              <option value="Planned">Plan to watch</option>
              <option value="Watching">Currently watching</option>
              <option value="Watched">Already watched</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div>
            <label htmlFor="episodeCount">Episodes:</label>
            <input className="w-1/3" type="number" name="episodeCount" ref={register} />
          </div>

          <div>
            <label htmlFor="rating">Rating:</label>
            <select className="w-1/3" name="rating" ref={register}>
              <option value="0">Horrible</option>
              <option value="0.5">Average</option>
              <option value="1">Amazing</option>
            </select>
          </div>

          <div>
            <label htmlFor="review">Review:</label>
            <textarea name="review" cols={50} rows={5} ref={register} />
          </div>

          <hr />

          <ErrorAlert error={error} />

          <div className="flex flex-row items-center space-x-2">
            <button type="submit">Add</button>

            <button
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
