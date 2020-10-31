import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryCache } from 'react-query';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { routes } from '../../Routing';
import ErrorAlert from '../../shared/ErrorAlert';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

interface FormData {
  isPublic?: boolean;
  location?: string;
  bio?: string;
  externalLinks?: string[];
}

export default function EditProfilePage() {
  const history = useHistory();
  const { profileId } = useParams();
  const [token] = useAuthToken();

  const queryCache = useQueryCache();
  const profile = useQuery(() => api.profiles(token).getProfile(Number(profileId)), [
    'profile',
    profileId
  ]);

  const { register, control, handleSubmit } = useForm<FormData>({ defaultValues: profile });
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Edit Profile" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Edit Profile</h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(async (data) => {
            try {
              await api.profiles(token).updateProfile(profile.id, data);
              queryCache.clear();
              history.push(routes.profile({ profileId: profile.id, profileName: profile.name }));
            } catch (error) {
              setError(error);
            }
          })}
        >
          <div>
            <label htmlFor="name">Name:</label>
            <input className="w-1/3" type="text" name="name" value={profile.name} disabled />
            <div className="mt-2 text-sm text-gray-600 italic">
              Your profile name cannot be changed
            </div>
          </div>

          <div>
            <label htmlFor="location">Profile privacy:</label>
            <select className="w-1/3" name="isPublic" placeholder="Bag End, Shire" ref={register}>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
            <div className="mt-2 text-sm text-gray-600 italic">
              If you choose to make your profile private, only you will be able to see it
            </div>
          </div>

          <div>
            <label htmlFor="location">Location:</label>
            <input
              className="w-1/3"
              type="text"
              name="location"
              placeholder="Bag End, Shire"
              ref={register}
            />
          </div>

          <div>
            <label htmlFor="bio">Bio:</label>
            <textarea
              name="bio"
              cols={50}
              rows={5}
              placeholder="Lorem ipsum dolor sit amet..."
              ref={register}
            />
          </div>

          <div>
            <label htmlFor="websiteUrl">External links:</label>
            <Controller
              name="externalLinks"
              control={control}
              render={({ onChange, value, name }) => (
                <textarea
                  name={name}
                  defaultValue={(value as string[])?.join('\n')}
                  onChange={(e) => onChange(e.target.value.split('\n'))}
                  cols={50}
                  rows={3}
                  placeholder="Lorem ipsum dolor sit amet..."
                  ref={register}
                />
              )}
            />
            <div className="mt-2 text-sm text-gray-600 italic">
              You can display external links on your profile, such as your accounts in other social
              networks
            </div>
          </div>

          <hr />

          <ErrorAlert error={error} />

          <div className="flex flex-row items-center space-x-2">
            <button type="submit">Save</button>

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
