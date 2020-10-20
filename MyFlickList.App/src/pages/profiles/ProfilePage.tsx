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
import { AuthTokenHelper, FlickHelper, ProfileHelper } from '../../infra/helpers';
import { slugify } from '../../infra/utils';
import { routes } from '../../Routing';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

export default function ProfilePage() {
  const history = useHistory();
  const { profileId, profileName } = useParams();
  const [token] = useAuthToken();

  const profile = useQuery(() => api.profiles(token).getProfile(Number(profileId)), [profileId]);

  // Normalize URL
  useEffect(() => {
    if (profileName !== profile.name) {
      history.replace(routes.profile({ profileId: profile.id, profileName: profile.name }));
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
        <div style={{ minWidth: 'max-content' }}>
          <img
            className="rounded-full shadow"
            alt={`${profile.name}'s avatar`}
            src={profileHelper.getAvatarImageUrl()}
            width={170}
            height={170}
          />
        </div>

        <div>
          <div className="flex flex-row items-center">
            {/* Name */}
            <h1 className="tracking-wide">{profile.name}</h1>

            {/* Role badge */}
            {profile.role !== 'Normal' && (
              <div className="ml-2 mt-2 p-1 border rounded border-red-200 bg-red-100 text-sm text-red-500">
                {profile.role}
              </div>
            )}
          </div>

          {/* Location */}
          {profile.location && (
            <div className="-mt-1 flex flex-row items-center font-light space-x-1">
              <FiMapPin strokeWidth={1} /> <div>{profile.location}</div>
            </div>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="w-3/4 my-6 mx-auto space-y-5">
        {/* Bio */}
        {profile.bio && <article className="text-gray-800 text-center">{profile.bio}</article>}

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
            className="btn inline-flex flex-row items-center space-x-1"
            href={routes.profileEdit({ profileId: profile.id, profileName: profile.name })}
          >
            <FiEdit /> <div>Edit Profile</div>
          </Link>
        )}
      </div>

      {/* Separator */}
      <hr className="w-1/2 my-8 mx-auto" />

      {/* Stats & tabs */}
      <div className="flex flex-row justify-center items-center">
        {/* Watched */}
        <Link href="#">
          <div className="text-xl">123</div>
          <div className="text-sm font-normal tracking-wider">Watched</div>
        </Link>

        {/* Separator */}
        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        {/* Planned */}
        <Link href="#">
          <div className="text-xl">45</div>
          <div className="text-sm font-normal tracking-wider">Planned</div>
        </Link>

        {/* Separator */}
        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        {/* Reviews */}
        <Link href="#">
          <div className="text-xl">67</div>
          <div className="text-sm font-normal tracking-wider">Reviews</div>
        </Link>

        {/* Separator */}
        <div className="w-px h-8 mt-1 mx-4 border border-gray-200" />

        {/* Collections */}
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
                          href={routes.flick({
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
                  <div className="flex flex-row items-center text-lg space-x-1">
                    <FiStar /> <div>{new FlickHelper(flick).formatRating()}</div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
