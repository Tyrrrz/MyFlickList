import classnames from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';
import { FiEdit, FiLink, FiMapPin } from 'react-icons/fi';
import { Redirect } from 'react-router';
import Card from '../../components/Card';
import Link from '../../components/Link';
import Page from '../../components/Page';
import useAuth from '../../context/useAuth';
import useCanonicalUrl from '../../context/useCanonicalUrl';
import useParams from '../../context/useParams';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import config from '../../internal/config';
import { getAvatarImageUrl } from '../../internal/profileHelpers';
import { getAbsoluteUrl, slugify } from '../../internal/utils';
import routes from '../../routes';

export default function ProfilePage() {
  const { profileId } = useParams();
  const auth = useAuth();

  const actualProfileId = profileId ? Number(profileId) : auth.token?.getProfileId();

  // TODO: make this cleaner when `actualProfileId` is undefined
  const profile = useQuery(
    () => api.profiles(auth.token?.value).getProfile(actualProfileId || -1),
    ['profile', profileId]
  );

  const flickEntries = useQuery(
    () => api.profiles(auth.token?.value).getFlickEntries(actualProfileId || -1),
    ['profileFlickEntries', profileId]
  );

  useCanonicalUrl(
    // Normalize based on the type of route that was used
    !profileId
      ? routes.profiles.current()
      : routes.profiles.specific({ profileId: profile.id, profileName: profile.name })
  );

  // If not signed in and profile ID is not explicitly provided, redirect to sign in page
  if (!actualProfileId) {
    return <Redirect to={routes.auth.signIn()} />;
  }

  const isAuthUserProfile = auth.token?.getProfileId() === profile.id;

  return (
    <Page
      title={profile.name}
      description={profile.bio}
      imageUrl={getAvatarImageUrl(profile)}
      contentType="profile"
    >
      <Card>
        <div className={classnames('flex', 'space-x-10')}>
          {/* Avatar */}
          <div style={{ minWidth: 'max-content' }}>
            <img
              className={classnames('rounded-full', 'shadow')}
              alt={`${profile.name}'s avatar`}
              src={getAvatarImageUrl(profile)}
              width={170}
              height={170}
            />
          </div>

          {/* Meta */}
          <div className={classnames('flex-grow', 'self-center')}>
            <div className={classnames('flex', 'items-center')}>
              {/* Name */}
              <div className={classnames('tracking-wide', 'truncate', 'text-3xl')}>
                {profile.name}
              </div>

              {/* Role badge */}
              {profile.role !== 'Normal' && (
                <div
                  className={classnames(
                    'ml-2',
                    'mt-2',
                    'p-1',
                    'border',
                    'rounded',
                    'border-red-200',
                    'bg-red-100',
                    'text-sm',
                    'text-red-500'
                  )}
                >
                  {profile.role}
                </div>
              )}
            </div>

            {/* Location */}
            {profile.location && (
              <div
                className={classnames('-mt-1', 'flex', 'items-center', 'font-light', 'space-x-1')}
              >
                <FiMapPin strokeWidth={1} />
                <div>{profile.location}</div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div>
            {/* Edit */}
            {isAuthUserProfile && (
              <Link
                className={classnames('flex', 'items-center', 'space-x-1')}
                href={routes.profiles.edit()}
              >
                <FiEdit />
                <div>Edit Profile</div>
              </Link>
            )}

            {/* Copy permalink */}
            {isAuthUserProfile && (
              <Link
                className={classnames('flex', 'items-center', 'space-x-1')}
                href={routes.profiles.specific({
                  profileId: profile.id,
                  profileName: profile.name
                })}
                onClick={(e) => {
                  e.preventDefault();

                  copy(
                    getAbsoluteUrl(
                      config.appUrl,
                      routes.profiles.specific({
                        profileId: profile.id,
                        profileName: profile.name
                      })
                    )
                  );
                }}
              >
                <FiLink />
                <div>Copy Link</div>
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Bio */}
      {profile.bio && (
        <Card>
          <div className={classnames('text-2xl', 'font-thin', 'tracking-wide')}>Bio</div>
          <p>{profile.bio}</p>
        </Card>
      )}

      {/* Entries */}
      <Card>
        {!flickEntries.items ||
          (flickEntries.items.length <= 0 && <div>This user hasn&apos;t added any flicks yet</div>)}

        {flickEntries.items &&
          flickEntries.items.map((entry) => (
            <div key={entry.flickId}>
              <Link
                className={classnames('text-xl')}
                href={routes.flicks.specific({
                  flickId: entry.flickId,
                  flickTitle: slugify(entry.flickTitle)
                })}
              >
                {entry.flickTitle}
              </Link>
              <Link
                href={routes.profiles.editFlick({
                  flickId: entry.flickId
                })}
              >
                Edit
              </Link>
              <Link
                href={routes.profiles.deleteFlick({
                  flickId: entry.flickId
                })}
              >
                Delete
              </Link>
            </div>
          ))}

        {isAuthUserProfile && (
          <div>
            <Link href={routes.profiles.addFlick()}>Add</Link>
          </div>
        )}
      </Card>
    </Page>
  );
}
