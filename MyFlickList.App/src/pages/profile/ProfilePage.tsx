import React from 'react';
import config from '../../infra/config';
import { getAbsoluteUrl } from '../../infra/utils';
import Breadcrumb from '../../shared/Breadcrumb';
import Meta from '../../shared/Meta';
import useRouteParams from '../../shared/useRouteParams';
import { routes } from '../PageRouter';

export default function ProfilePage() {
  const { username } = useRouteParams();

  // TODO: move to some helper
  const avatarUrl = getAbsoluteUrl(config.apiUrl, `/profile/${username}/avatar`);

  return (
    <div>
      <Meta title="Profile" />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Profile' }]} />

      <h1>Profile</h1>

      <p>Hi, {username}!</p>

      <img alt={`${username}'s avatar`} src={avatarUrl} />
    </div>
  );
}
