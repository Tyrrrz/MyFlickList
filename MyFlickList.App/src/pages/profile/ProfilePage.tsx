import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../infra/api';
import { ProfileResponse } from '../../infra/api.generated';
import { ProfileHelper } from '../../infra/helpers';
import DataLoader from '../../shared/DataLoader';
import Meta from '../../shared/Meta';
import useRouteParams from '../../shared/useRouteParams';
import { routes } from '../Routing';

function ProfileLoaded({ profile }: { profile: ProfileResponse }) {
  const history = useHistory();
  const { profileName } = useParams();

  // Make sure the URL includes the correct name
  useEffect(() => {
    if (profileName !== profile.name) {
      history.replace(routes.profile.href({ profileId: profile.id, profileName: profile.name }));
    }
  }, [profile.id, profile.name, history, profileName]);

  const profileHelper = new ProfileHelper(profile);

  return (
    <div>
      <Meta
        title={profile.name}
        description={profile.bio}
        imageUrl={profileHelper.getAvatarImageUrl()}
      />

      <h1>{profile.name}</h1>

      <p>Hi, {profile.name}!</p>

      <img alt={`${profile.name}'s avatar`} src={profileHelper.getAvatarImageUrl()} />
    </div>
  );
}

export default function ProfilePage() {
  const { profileId } = useRouteParams();

  return (
    <DataLoader
      getData={() => api.profiles.getProfile(Number(profileId))}
      deps={[profileId]}
      render={(profile) => <ProfileLoaded profile={profile} />}
    />
  );
}
