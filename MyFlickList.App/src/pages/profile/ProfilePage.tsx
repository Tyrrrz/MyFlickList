import React from 'react';
import api from '../../infra/api';
import { ProfileResponse } from '../../infra/api.generated';
import { ProfileHelper } from '../../infra/helpers';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Meta from '../../shared/Meta';
import useRouteParams from '../../shared/useRouteParams';
import { routes } from '../PageRouter';

function ProfileLoaded({ profile }: { profile: ProfileResponse }) {
  const profileHelper = new ProfileHelper(profile);

  return (
    <div>
      <Meta title={profile.name} />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: profile.name }]} />

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