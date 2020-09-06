import React, { useEffect } from 'react';
import { FiCalendar, FiClock, FiExternalLink, FiShare2, FiStar, FiTag, FiTv } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router';
import api from '../../infra/api';
import { FlickKind, FlickResponse } from '../../infra/api.generated';
import config from '../../infra/config';
import { FlickHelper } from '../../infra/helpers';
import { getAbsoluteUrl, slugify } from '../../infra/utils';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useRouteParams from '../../shared/useRouteParams';
import { routes } from '../Routing';

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
  const absoluteUrl = getAbsoluteUrl(
    config.appUrl,
    routes.flick.href({ flickId: flick.id, flickTitle: slugify(flick.title) })
  );

  return [
    {
      name: 'Twitter',
      url:
        'https://twitter.com/share?' +
        new URLSearchParams({
          related: config.appUrl,
          via: 'myflicklist',
          url: absoluteUrl,
          text: flick.title,
          hashtags: 'myflicklist'
        }).toString()
    },
    {
      name: 'Reddit',
      url:
        'https://reddit.com/submit?' +
        new URLSearchParams({ url: absoluteUrl, title: flick.title }).toString()
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/share.php?' + new URLSearchParams({ u: absoluteUrl }).toString()
    }
  ];
}

function FlickPageLoaded({ flick }: { flick: FlickResponse }) {
  const history = useHistory();
  const { flickTitle } = useParams();

  // Make sure the URL includes the correct title
  useEffect(() => {
    if (flickTitle !== slugify(flick.title)) {
      history.replace(routes.flick.href({ flickId: flick.id, flickTitle: slugify(flick.title) }));
    }
  }, [flick.id, flick.title, history, flickTitle]);

  const flickHelper = new FlickHelper(flick);

  return (
    <div>
      <Meta
        title={flick.title}
        description={flick.synopsis}
        imageUrl={flickHelper.getCoverImageUrl()}
        contentType={flick.kind === FlickKind.Movie ? 'video.movie' : 'video.tv_show'}
      />

      <h1>{flick.title}</h1>

      {/* Main info */}
      <div className="inline-block -mt-2 space-x-3">
        <div className="inline-flex items-center">
          <FiTv /> <span className="ml-1">{flickHelper.formatKind()}</span>
        </div>

        <div className="inline-flex items-center">
          <FiClock /> <span className="ml-1">{flickHelper.formatRuntime()}</span>
        </div>

        <div className="inline-flex items-center">
          <FiCalendar /> <span className="ml-1">{flickHelper.formatDate()}</span>
        </div>

        <div className="inline-flex items-center">
          <FiStar /> <span className="ml-1">{flickHelper.formatRating()}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-row space-x-3">
        {/* Cover image & additional info */}
        <div className="w-auto">
          <img
            className="rounded-md"
            alt={flick.title}
            src={flickHelper.getCoverImageUrl()}
            width={500}
          />

          <div className="mt-5">
            <div className="inline-flex items-center font-semibold">
              <FiTag /> <span className="ml-1">Tags</span>
            </div>
            {flick.tags && flick.tags.length > 0 ? (
              <div className="space-x-1 space-y-1">
                {flick.tags.map((tag) => (
                  <Link
                    key={tag}
                    className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm"
                    href={routes.flicks.href({ filterTag: tag })}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : (
              '--'
            )}
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center font-semibold">
              <FiExternalLink /> <span className="ml-1">External</span>
            </div>
            <ul>
              {getNetworkLinks(flick).map((networkLink) => (
                <li key={networkLink.name}>
                  <Link className="text-sm" href={networkLink.url} target="_blank">
                    Find on {networkLink.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <div className="inline-flex items-center font-semibold">
              <FiShare2 /> <span className="ml-1">Share</span>
            </div>
            <ul>
              {getShareLinks(flick).map((shareLink) => (
                <li key={shareLink.name}>
                  <Link className="text-sm" href={shareLink.url} target="_blank">
                    {shareLink.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          <article>{flick.synopsis}</article>
        </div>
      </div>
    </div>
  );
}

export default function FlickPage() {
  const { flickId } = useRouteParams();

  return (
    <DataLoader
      getData={() => api.flicks.getFlick(Number(flickId))}
      deps={[flickId]}
      render={(flick) => <FlickPageLoaded flick={flick} />}
    />
  );
}
