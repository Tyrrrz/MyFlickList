import classnames from 'classnames';
import React from 'react';
import { FiCalendar, FiClock, FiFacebook, FiFilm, FiStar, FiTwitter } from 'react-icons/fi';
import { IoLogoReddit } from 'react-icons/io';
import posterFallbackAsset from '../../assets/poster-fallback.png';
import Alert from '../../components/Alert';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import Link from '../../components/Link';
import Page from '../../components/Page';
import Section from '../../components/Section';
import TagLink from '../../components/TagLink';
import VerticalSeparator from '../../components/VerticalSeparator';
import useAuth from '../../context/useAuth';
import useCanonicalUrl from '../../context/useCanonicalUrl';
import useParam from '../../context/useParam';
import useQuery from '../../context/useQuery';
import api from '../../internal/api';
import config from '../../internal/config';
import { getFileUrl } from '../../internal/fileHelpers';
import {
  formatFirstAired,
  formatKind,
  formatLastAired,
  formatRating,
  formatRuntime,
  formatYears
} from '../../internal/flickHelpers';
import {
  createFacebookShareLink,
  createRedditShareLink,
  createTwitterShareLink
} from '../../internal/socialHelpers';
import { getAbsoluteUrl, slugify } from '../../internal/utils';
import routes from '../../routes';

export default function FlickPage() {
  const flickId = useParam('flickId', Number);
  const auth = useAuth();

  const flick = useQuery(() => api.flicks(auth.token?.value).getFlick(flickId), ['flick', flickId]);

  const selfUrl = routes.flicks.specific({ flickId: flick.id, flickTitle: slugify(flick.title) });
  const selfUrlAbsolute = getAbsoluteUrl(config.appUrl, selfUrl);

  useCanonicalUrl(selfUrl);

  const coverImageUrl = flick.coverImageId ? getFileUrl(flick.coverImageId) : posterFallbackAsset;

  // TODO: hide additional info under a spoiler

  return (
    <Page
      title={flick.title}
      description={flick.synopsis}
      imageUrl={coverImageUrl}
      contentType={flick.kind === 'Movie' ? 'video.movie' : 'video.tv_show'}
    >
      <Section>
        <div className={classnames('flex', 'space-x-10')}>
          {/* Flick info */}
          <div className={classnames('flex', 'flex-col', 'flex-grow', 'space-y-3')}>
            <div>
              {/* Title */}
              <p className={classnames('tracking-wide', 'truncate', 'text-3xl')}>{flick.title}</p>

              {/* Metadata */}
              <div className={classnames('-mt-1', 'flex', 'text-lg', 'font-light', 'space-x-3')}>
                {/* Kind */}
                <div className={classnames('flex', 'items-center', 'space-x-2')}>
                  <FiFilm strokeWidth={1} />
                  <div>{formatKind(flick)}</div>
                </div>

                {/* Separator */}
                <VerticalSeparator />

                {/* Runtime */}
                <div className={classnames('flex', 'items-center', 'space-x-2')}>
                  <FiClock strokeWidth={1} />
                  <div>{formatRuntime(flick)}</div>
                </div>

                {/* Separator */}
                <VerticalSeparator />

                {/* Years */}
                <div className={classnames('flex', 'items-center', 'space-x-2')}>
                  <FiCalendar strokeWidth={1} />
                  <div>{formatYears(flick)}</div>
                </div>

                {/* Separator */}
                <VerticalSeparator />

                {/* Rating */}
                <div className={classnames('flex', 'items-center', 'space-x-2', 'font-normal')}>
                  <FiStar strokeWidth={1} fill="#f6ad55" />
                  <div>{formatRating(flick)}</div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <article className={classnames('text-gray-800')}>{flick.synopsis}</article>

            {/* Tags */}
            <div className={classnames('flex', 'space-x-1')}>
              {flick.tags?.map((tag) => (
                <TagLink key={tag} href={routes.flicks.all({ tag })}>
                  {tag}
                </TagLink>
              ))}
            </div>

            {/* Separator */}
            <HorizontalSeparator />

            {/* Additional info */}
            <div className={classnames('text-sm')}>
              {flick.originalTitle && (
                <div className={classnames('flex', 'space-x-1')}>
                  <div>Original title:</div>
                  <div className={classnames('font-semibold')}>{flick.originalTitle}</div>
                </div>
              )}

              {flick.firstAired && (
                <div className={classnames('flex', 'space-x-1')}>
                  <div>First aired:</div>
                  <div className={classnames('font-semibold')}>{formatFirstAired(flick)}</div>
                </div>
              )}

              {flick.lastAired && (
                <div className={classnames('flex', 'space-x-1')}>
                  <div>Last aired:</div>
                  <div className={classnames('font-semibold')}>{formatLastAired(flick)}</div>
                </div>
              )}
            </div>

            {/* Spacer */}
            <div className={classnames('flex-grow')} />

            {/* Share */}
            <div className={classnames('flex', 'text-2xl', 'space-x-3')}>
              <Link
                href={createTwitterShareLink(selfUrlAbsolute, {
                  text: flick.title,
                  hashtags: flick.tags?.join(','),
                  via: 'my_flick_list',
                  related: config.appUrl
                })}
              >
                <FiTwitter strokeWidth={1} />
              </Link>

              <Link
                href={createRedditShareLink(selfUrlAbsolute, {
                  title: flick.title
                })}
              >
                <IoLogoReddit strokeWidth={1} />
              </Link>

              <Link
                href={createFacebookShareLink(selfUrlAbsolute, {
                  title: flick.title
                })}
              >
                <FiFacebook strokeWidth={1} />
              </Link>
            </div>
          </div>

          {/* Cover */}
          <div style={{ minWidth: 'max-content' }}>
            <img
              className={classnames('rounded-md', 'shadow')}
              alt={flick.title}
              src={coverImageUrl}
              width={230}
              height={345}
            />
          </div>
        </div>
      </Section>

      {/* User listing */}
      <Alert title={`Have you watched this ${flick.kind.toLowerCase()}?`}>
        <Link href={routes.auth.signIn()}>Sign in</Link> to add it to your list!
      </Alert>
    </Page>
  );
}
