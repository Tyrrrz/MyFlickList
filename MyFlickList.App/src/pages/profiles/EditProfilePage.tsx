import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiExternalLink, FiUser } from 'react-icons/fi';
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
  websiteUrl?: string;
  twitterId?: string;
  instagramId?: string;
  gitHubId?: string;
}

type Tab = 'General' | 'Social';

export default function EditProfilePage() {
  const history = useHistory();
  const { profileId } = useParams();
  const [token] = useAuthToken();

  // TODO: no cache
  const profile = useQuery(() => api.profiles(token).getProfile(Number(profileId)), [profileId]);

  const { register, handleSubmit } = useForm<FormData>({ defaultValues: profile });
  const [error, setError] = useState<unknown>();

  const [activeTab, setActiveTab] = useState<Tab>('General');

  return (
    <div>
      <Meta title="Edit Profile" />

      <div className="w-3/4 mx-auto space-y-5">
        <h1>Edit Profile</h1>

        {/* Tabs */}
        <div className="flex flex-row items-center text-xl font-thin">
          {/* General */}
          <div
            className="py-1 flex flex-row items-center space-x-2 cursor-pointer"
            style={{
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'General' ? '#38b2ac' : 'transparent'
            }}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('General');
            }}
          >
            <FiUser strokeWidth={1} />
            <div>General</div>
          </div>

          {/* Separator */}
          <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

          {/* Social */}
          <div
            className="py-1 flex flex-row items-center space-x-2 cursor-pointer"
            style={{
              borderBottomWidth: 2,
              borderBottomColor: activeTab === 'Social' ? '#38b2ac' : 'transparent'
            }}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('Social');
            }}
          >
            <FiExternalLink strokeWidth={1} />
            <div>Social</div>
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(async (data) => {
            try {
              await api.profiles(token).updateProfile(profile.id, data);
              return history.push(
                routes.profile({ profileId: profile.id, profileName: profile.name })
              );
            } catch (error) {
              return setError(error);
            }
          })}
        >
          {/* General */}
          <div style={{ display: activeTab === 'General' ? 'block' : 'none' }}>
            <label htmlFor="name">Name:</label>
            <input className="w-1/3" type="text" name="name" value={profile.name} disabled />
            <div className="mt-2 text-sm text-gray-600 italic">
              Your profile name cannot be changed
            </div>
          </div>

          <div style={{ display: activeTab === 'General' ? 'block' : 'none' }}>
            <label htmlFor="location">Profile privacy:</label>
            <select className="w-1/3" name="isPublic" placeholder="Bag End, Shire" ref={register}>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
            <div className="mt-2 text-sm text-gray-600 italic">
              If you choose to make your profile private, only you will be able to see it
            </div>
          </div>

          <div style={{ display: activeTab === 'General' ? undefined : 'none' }}>
            <label htmlFor="location">Location:</label>
            <input
              className="w-1/3"
              type="text"
              name="location"
              placeholder="Bag End, Shire"
              ref={register}
            />
          </div>

          <div style={{ display: activeTab === 'General' ? undefined : 'none' }}>
            <label htmlFor="bio">Bio:</label>
            <textarea
              name="bio"
              cols={50}
              rows={5}
              placeholder="Lorem ipsum dolor sit amet..."
              ref={register}
            />
          </div>

          {/* Social */}
          <div style={{ display: activeTab === 'Social' ? undefined : 'none' }}>
            <label htmlFor="websiteUrl">Website:</label>
            <input
              className="w-1/3"
              type="url"
              name="websiteUrl"
              maxLength={2048}
              placeholder="https://myspace.com/211092669"
              ref={register}
            />
          </div>

          <div style={{ display: activeTab === 'Social' ? undefined : 'none' }}>
            <label htmlFor="twitterId">Twitter ID:</label>
            <input
              className="w-1/3"
              type="text"
              name="twitterId"
              minLength={3}
              maxLength={15}
              ref={register}
            />
          </div>

          <div style={{ display: activeTab === 'Social' ? undefined : 'none' }}>
            <label htmlFor="instagramId">Instagram ID:</label>
            <input
              className="w-1/3"
              type="text"
              name="instagramId"
              minLength={3}
              maxLength={30}
              ref={register}
            />
          </div>

          <div style={{ display: activeTab === 'Social' ? undefined : 'none' }}>
            <label htmlFor="gitHubId">GitHub ID:</label>
            <input
              className="w-1/3"
              type="text"
              name="gitHubId"
              minLength={3}
              maxLength={39}
              ref={register}
            />
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
