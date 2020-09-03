import React from 'react';
import { FiCalendar, FiClock, FiExternalLink, FiShare2, FiStar, FiTag, FiTv } from 'react-icons/fi';
import api from '../../infra/api';
import { FlickKind, FlickResponse } from '../../infra/api.generated';
import config from '../../infra/config';
import { FlickHelper } from '../../infra/helpers';
import { formatQueryParams, getAbsoluteUrl } from '../../infra/utils';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useRouteParams from '../../shared/useRouteParams';
import { routes } from '../PageRouter';

function getNetworkLinks(flick: FlickResponse) {
  return [
    {
      name: 'IMDB',
      url: 'https://imdb.com/title/' + encodeURIComponent(flick.id)
    },
    {
      name: 'TMDB',
      url: 'https://themoviedb.org/search' + formatQueryParams({ query: flick.title })
    },
    {
      name: 'Netflix',
      url: 'https://netflix.com/search' + formatQueryParams({ q: flick.title })
    },
    {
      name: 'HBO',
      url: 'https://hbo.com/searchresults' + formatQueryParams({ q: flick.title })
    }
  ];
}

function getShareLinks(flick: FlickResponse) {
  const absoluteUrl = getAbsoluteUrl(config.appUrl, routes.flick(flick.id));

  return [
    {
      name: 'Twitter',
      url:
        'https://twitter.com/share' +
        formatQueryParams({
          related: config.appUrl,
          via: 'myflicklist',
          url: absoluteUrl,
          text: flick.title,
          hashtags: 'myflicklist'
        })
    },
    {
      name: 'Reddit',
      url: 'https://reddit.com/submit' + formatQueryParams({ url: absoluteUrl, title: flick.title })
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/share.php' + formatQueryParams({ u: absoluteUrl })
    }
  ];
}

function FlickPageLoaded({ flick }: { flick: FlickResponse }) {
  const flickHelper = new FlickHelper(flick);

  return (
    <div>
      <Meta
        title={flick.title}
        description={flick.synopsis}
        imageUrl={flickHelper.getCoverImageUrl()}
        contentType={flick.kind === FlickKind.Movie ? 'video.movie' : 'video.tv_show'}
      />

      <Breadcrumb
        segments={[
          { title: 'Home', href: routes.home() },
          { title: 'Flicks', href: routes.flicks() },
          { title: flick.title }
        ]}
      />

      <div>
        <h1>{flick.title}</h1>

        <div className="m-0 mt-3 p-0 container container-fluid">
          <div className="row">
            <div className="col col-3">
              <img
                className="mw-100 rounded"
                alt={flick.title}
                src={flickHelper.getCoverImageUrl()}
              />

              <div className="my-1 mt-3">
                <FiStar /> <span>{flickHelper.formatRating()}</span>
              </div>
              <div className="my-1">
                <FiCalendar /> <span>{flickHelper.formatDate()}</span>
              </div>
              <div className="my-1">
                <FiTv /> <span>{flickHelper.formatKind()}</span>
              </div>
              <div className="my-1">
                <FiClock /> <span>{flickHelper.formatRuntime()}</span>
              </div>
              <div className="my-1">
                <FiTag /> <span>{flickHelper.formatTags()}</span>
              </div>

              <hr className="w-75" />

              <div>
                {getNetworkLinks(flick).map((networkLink) => (
                  <div key={networkLink.name} className="my-1">
                    <FiExternalLink />{' '}
                    <Link href={networkLink.url} target="_blank">
                      Find on {networkLink.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                {getShareLinks(flick).map((shareLink) => (
                  <div key={shareLink.name} className="my-1">
                    <FiShare2 />{' '}
                    <Link href={shareLink.url} target="_blank">
                      Share on {shareLink.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <div className="jumbotron">
                <h3>
                  Create account to add this {flick.kind.toString().toLowerCase()} to your list
                </h3>
                <p>
                  <button className="btn btn-outline-primary">Sign up</button>
                </p>
              </div>

              <div>
                <h5>Synopsis</h5>
                <article>{flick.synopsis}</article>
              </div>
            </div>
          </div>
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
