import React, { useEffect } from 'react';
import {
  FiEdit,
  FiGithub,
  FiGlobe,
  FiInstagram,
  FiMapPin,
  FiStar,
  FiTwitter
} from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import api from '../../infra/api';
import { ProfileResponse } from '../../infra/api.generated';
import { AuthTokenHelper, FlickHelper, ProfileHelper } from '../../infra/helpers';
import { slugify } from '../../infra/utils';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import { routes } from '../Routing';

function ProfileLoaded({ profile }: { profile: ProfileResponse }) {
  const history = useHistory();
  const { profileName } = useParams();
  const [token] = useAuthToken();

  // Normalize URL
  useEffect(() => {
    if (profileName !== profile.name) {
      history.replace(routes.profile.href({ profileId: profile.id, profileName: profile.name }));
    }
  }, [profile.id, profile.name, history, profileName]);

  const isAuthenticatedUser = token && new AuthTokenHelper(token).getProfileId() === profile.id;
  const profileHelper = new ProfileHelper(profile);

  // TODO: watch list, etc.

  return (
    <div>
      <Meta
        title={profile.name}
        description={profile.bio}
        imageUrl={profileHelper.getAvatarImageUrl()}
        contentType="profile"
      />

      {/* Avatar & main profile info */}
      <div className="flex flex-row justify-center items-center space-x-10">
        {/* Avatar */}
        <img
          className="rounded-full shadow"
          alt={`${profile.name}'s avatar`}
          src={profileHelper.getAvatarImageUrl()}
          width={170}
          height={170}
        />

        <div>
          {/* Name */}
          <h1 className="font-semibold truncate">{profile.name}</h1>

          {/* Location */}
          {profile.location && (
            <div className="flex flex-row items-center">
              <FiMapPin /> <span className="ml-1 truncate">{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="w-3/4 my-6 mx-auto space-y-4">
        {/* Bio */}
        {profile.bio && <section className="text-center">{profile.bio}</section>}

        {/* Socials */}
        <div className="flex flex-row justify-center text-xl space-x-3">
          {profile.websiteUrl && (
            <Link href={profile.websiteUrl} target="_blank" title={`${profile.name}'s website`}>
              <FiGlobe />
            </Link>
          )}

          {profile.twitterId && (
            <Link
              href={`https://twitter.com/${profile.twitterId}`}
              target="_blank"
              title={`${profile.name}'s Twitter`}
            >
              <FiTwitter />
            </Link>
          )}

          {profile.instagramId && (
            <Link
              href={`https://instagr.am/${profile.instagramId}`}
              target="_blank"
              title={`${profile.name}'s Instagram`}
            >
              <FiInstagram />
            </Link>
          )}

          {profile.gitHubId && (
            <Link
              href={`https://github.com/${profile.instagramId}`}
              target="_blank"
              title={`${profile.name}'s GitHub`}
            >
              <FiGithub />
            </Link>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center">
        {isAuthenticatedUser && (
          <Link
            className="btn inline-flex flex-row items-center"
            href={routes.profileEdit.href({ profileId: profile.id, profileName: profile.name })}
          >
            <FiEdit /> <span className="ml-1">Edit Profile</span>
          </Link>
        )}
      </div>

      {/* Separator */}
      <hr className="w-3/4 my-8 mx-auto" />

      {/* Tabs & stats */}
      <div className="flex flex-row justify-center items-center">
        <Link href="#">
          <div className="text-xl">123</div>
          <div className="text-sm font-normal tracking-wider">Watched</div>
        </Link>

        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        <Link href="#">
          <div className="text-xl">45</div>
          <div className="text-sm font-normal tracking-wider">Planned</div>
        </Link>

        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        <Link href="#">
          <div className="text-xl">67</div>
          <div className="text-sm font-normal tracking-wider">Reviews</div>
        </Link>

        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        <Link href="#">
          <div className="text-xl">89</div>
          <div className="text-sm font-normal tracking-wider">Collections</div>
        </Link>
      </div>

      {/* Watch list */}
      <table className="w-3/4 mx-auto mt-5">
        <tbody>
          {!profile.favoriteFlicks || (profile.favoriteFlicks.length <= 0 && <div>None :(</div>)}

          {profile.favoriteFlicks &&
            profile.favoriteFlicks.length >= 0 &&
            profile.favoriteFlicks.map((flick) => (
              <tr key={flick.id}>
                <td>
                  <div className="py-1 flex flex-row space-x-2">
                    <img
                      className="rounded"
                      alt={flick.title}
                      src={new FlickHelper(flick).getCoverImageUrl()}
                      width={40}
                    />

                    <div>
                      <div>
                        <Link
                          className="text-xl"
                          href={routes.flick.href({
                            flickId: flick.id,
                            flickTitle: slugify(flick.title)
                          })}
                        >
                          {flick.title}
                        </Link>
                      </div>

                      <div>{new FlickHelper(flick).formatKind()}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="flex flex-row items-center text-lg">
                    <FiStar /> <span className="ml-1">{new FlickHelper(flick).formatRating()}</span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProfilePage() {
  const [token] = useAuthToken();
  const { profileId } = useParams();

  return (
    <DataLoader
      getData={() => api.profiles(token).getProfile(Number(profileId))}
      deps={[profileId]}
      render={(profile) => <ProfileLoaded profile={profile} />}
    />
  );
}
