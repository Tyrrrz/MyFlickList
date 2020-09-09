import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { UpdateProfileRequest } from '../../infra/api.generated';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

interface FormData {
  location?: string;
  bio?: string;
  websiteUrl?: string;
  twitterId?: string;
  instagramId?: string;
  gitHubId?: string;
}

export default function EditProfilePage() {
  const history = useHistory();
  const { profileId } = useParams();
  const [token] = useAuthToken();

  const profile = useQuery(() => api.profiles(token).getProfile(Number(profileId)), [profileId]);

  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Edit Profile" />

      <h1>Edit Profile</h1>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((data) => {
          api
            .profiles(token)
            .updateProfile(
              profile.id,
              new UpdateProfileRequest({
                ...data
              })
            )
            .then(() =>
              history.push(
                routes.profile.href({ profileId: profile.id, profileName: profile.name })
              )
            )
            .catch(setError);
        })}
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={profile.name} disabled />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" name="location" ref={register} defaultValue={profile.location} />
        </div>

        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea name="bio" cols={50} rows={5} ref={register} defaultValue={profile.bio} />
        </div>

        <div>
          <label htmlFor="websiteUrl">Website:</label>
          <input type="url" name="websiteUrl" ref={register} defaultValue={profile.websiteUrl} />
        </div>

        <div>
          <label htmlFor="twitterId">Twitter ID:</label>
          <input type="text" name="twitterId" ref={register} defaultValue={profile.twitterId} />
        </div>

        <div>
          <label htmlFor="instagramId">Instagram ID:</label>
          <input type="text" name="instagramId" ref={register} defaultValue={profile.instagramId} />
        </div>

        <div>
          <label htmlFor="gitHubId">GitHub ID:</label>
          <input type="text" name="gitHubId" ref={register} defaultValue={profile.gitHubId} />
        </div>

        <ErrorAlert error={error} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
