import React, { useEffect } from 'react';
import { FiCalendar, FiClock, FiFilm, FiStar } from 'react-icons/fi';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { FlickResponse } from '../../infra/api.generated';
import config from '../../infra/config';
import { FlickHelper } from '../../infra/helpers';
import { getAbsoluteUrl, slugify } from '../../infra/utils';
import { routes } from '../../Routing';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';

function getNetworkLinks(flick: FlickResponse) {
  return [
    {
      name: 'IMDB',
      url: 'https://imdb.com/title/' + encodeURIComponent(flick.imdbId)
    },
    {
      name: 'TMDB',
      url: 'https://themoviedb.org/search?' + new URLSearchParams({ query: flick.title }).toString()
    },
    {
      name: 'Netflix',
      url: 'https://netflix.com/search?' + new URLSearchParams({ q: flick.title }).toString()
    },
    {
      name: 'HBO',
      url: 'https://hbo.com/searchresults?' + new URLSearchParams({ q: flick.title }).toString()
    }
  ];
}

function getShareLinks(flick: FlickResponse) {
  const selfUrl = getAbsoluteUrl(
    config.appUrl,
    routes.flick({ flickId: flick.id, flickTitle: slugify(flick.title) })
  );

  return [
    {
      name: 'Twitter',
      url:
        'https://twitter.com/share?' +
        new URLSearchParams({
          related: config.appUrl,
          via: 'myflicklist',
          url: selfUrl,
          text: flick.title,
          hashtags: 'myflicklist'
        }).toString()
    },
    {
      name: 'Reddit',
      url:
        'https://reddit.com/submit?' +
        new URLSearchParams({ url: selfUrl, title: flick.title }).toString()
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/share.php?' + new URLSearchParams({ u: selfUrl }).toString()
    }
  ];
}

export default function FlickPage() {
  const history = useHistory();
  const { flickId, flickTitle } = useParams();
  const [token] = useAuthToken();

  const flick = useQuery(() => api.flicks(token).get(Number(flickId)), ['flick', flickId]);

  // Normalize URL
  useEffect(() => {
    if (flickTitle !== slugify(flick.title)) {
      history.replace(routes.flick({ flickId: flick.id, flickTitle: slugify(flick.title) }));
    }
  }, [flick.id, flick.title, history, flickTitle]);

  const flickHelper = new FlickHelper(flick);

  return (
    <div>
      <Meta
        title={flick.title}
        description={flick.synopsis}
        imageUrl={flickHelper.getCoverImageUrl()}
        contentType={flick.kind === 'Movie' ? 'video.movie' : 'video.tv_show'}
      />

      <div className="w-3/4 mx-auto flex flex-row space-x-10">
        {/* Flick info */}
        <div className="flex-grow space-y-3">
          <div>
            {/* Title */}
            <h1 className="tracking-wide truncate">{flick.title}</h1>

            {/* Metadata */}
            <div className="-mt-1 flex flex-row text-lg font-light space-x-3">
              {/* Kind */}
              <div className="flex flex-row items-center space-x-2">
                <FiFilm strokeWidth={1} />
                <div>{flickHelper.formatKind()}</div>
              </div>

              {/* Separator */}
              <div className="w-px h-6 mt-1 border border-gray-200" />

              {/* Runtime */}
              <div className="flex flex-row items-center space-x-2">
                <FiClock strokeWidth={1} />
                <div>{flickHelper.formatRuntime()}</div>
              </div>

              {/* Separator */}
              <div className="w-px h-6 mt-1 border border-gray-200" />

              {/* Years */}
              <div className="flex flex-row items-center space-x-2">
                <FiCalendar strokeWidth={1} />
                <div>{flickHelper.formatYears()}</div>
              </div>

              {/* Separator */}
              <div className="w-px h-6 mt-1 border border-gray-200" />

              {/* Rating */}
              <div className="flex flex-row items-center space-x-2 font-normal">
                <FiStar strokeWidth={1} fill="#f6ad55" />
                <div>{flickHelper.formatRating()}</div>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <article className="text-gray-800">{flick.synopsis}</article>

          {/* Tags */}
          <div className="flex flex-row space-x-1">
            {flick.tags?.map((tag) => (
              <div key={tag} className="px-3 py-1 rounded bg-gray-200 text-sm">
                <Link href={routes.flicks({ filterTag: tag })}>{tag}</Link>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="text-sm">
            {flick.originalTitle && (
              <div className="space-x-1">
                <span>Original title:</span>{' '}
                <span className="font-semibold">{flick.originalTitle}</span>
              </div>
            )}

            {flick.firstAired && (
              <div className="space-x-1">
                <span>First aired:</span>{' '}
                <span className="font-semibold">{flickHelper.formatFirstAired()}</span>
              </div>
            )}

            {flick.lastAired && (
              <div className="space-x-1">
                <span>Last aired:</span>{' '}
                <span className="font-semibold">{flickHelper.formatLastAired()}</span>
              </div>
            )}
          </div>

          {/* Other sites */}
          <div className="text-sm">
            <div>Find on:</div>

            <div className="flex flex-row pl-1 space-x-2">
              {getNetworkLinks(flick).map((link) => (
                <div key={link.name} className="inline">
                  <Link href={link.url} target="_blank">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="text-sm">
            <div>Share on:</div>

            <div className="flex flex-row pl-1 space-x-2">
              {getShareLinks(flick).map((link) => (
                <div key={link.name} className="inline">
                  <Link href={link.url} target="_blank">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cover */}
        <div style={{ minWidth: 'max-content' }}>
          <img
            className="rounded-md shadow"
            alt={flick.title}
            src={flickHelper.getCoverImageUrl()}
            width={230}
            height={345}
          />
        </div>
      </div>

      {/* Separator */}
      <hr className="w-1/2 my-8 mx-auto" />

      {/* User listing */}
      <div className="text-lg text-center">
        Have you watched this {flick.kind.toLowerCase()}?
        <br />
        <Link href={routes.signIn()}>Sign in</Link> to add it to your list!
      </div>
    </div>
  );
}
