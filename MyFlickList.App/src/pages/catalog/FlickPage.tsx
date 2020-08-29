import React from 'react';
import { FiCalendar, FiClock, FiExternalLink, FiShare2, FiStar, FiTag, FiTv } from 'react-icons/fi';
import api from '../../infra/api';
import { FlickKind, FlickResponse } from '../../infra/api.generated';
import config from '../../infra/config';
import { FlickHelper } from '../../infra/helpers';
import { getAbsoluteUrl } from '../../infra/utils';
import Breadcrumb from '../../shared/Breadcrumb';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useRouteParams from '../../shared/useRouteParams';

function getNetworkLinks(flick: FlickResponse) {
  const idEncoded = encodeURIComponent(flick.id);
  const titleEncoded = encodeURIComponent(flick.title);

  return [
    {
      name: 'IMDB',
      url: `https://imdb.com/title/${idEncoded}`
    },
    {
      name: 'TMDB',
      url: `https://themoviedb.org/search?query=${titleEncoded}`
    },
    {
      name: 'Netflix',
      url: `https://netflix.com/search?q=${titleEncoded}`
    },
    {
      name: 'HBO',
      url: `https://hbo.com/searchresults?q=${titleEncoded}`
    }
  ];
}

function getShareLinks(flick: FlickResponse) {
  const urlEncoded = encodeURIComponent(
    getAbsoluteUrl(config.appUrl, '/catalog/flicks/' + flick.id)
  );

  const titleEncoded = encodeURIComponent(flick.title);

  return [
    {
      name: 'Twitter',
      url: `https://twitter.com/share?related=myflicklist.net&via=myflicklist&url=${urlEncoded}&text=${titleEncoded}&hashtags=myflicklist`
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${urlEncoded}&title=${titleEncoded}`
    },
    {
      name: 'Facebook',
      url: `https://facebook.com/share.php?u=${urlEncoded}`
    }
  ];
}

function FlickView({ flick }: { flick: FlickResponse }) {
  const flickHelper = new FlickHelper(flick);

  return (
    <div>
      <Meta
        title={flick.title}
        description={flick.synopsis}
        imageUrl={flickHelper.getImageUrl()}
        contentType={flick.kind === FlickKind.Movie ? 'video.movie' : 'video.tv_show'}
      />

      <h1>{flick.title}</h1>

      <div className="m-0 mt-3 p-0 container container-fluid">
        <div className="row">
          <div className="col col-3">
            <img className="mw-100 rounded" alt={flick.title} src={flickHelper.getImageUrl()} />

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
              <h3>Create account to add this {flick.kind.toString().toLowerCase()} to your list</h3>
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
  );
}

export default function FlickPage() {
  const { flickId } = useRouteParams();
  const [flick, flickError] = useAsyncStateEffect(() => api.catalog.getFlick(flickId), [flickId]);

  return (
    <div>
      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Catalog', href: '/catalog' },
          { title: flick?.title || '...' }
        ]}
      />

      <StateLoader state={flick} error={flickError} render={(f) => <FlickView flick={f} />} />
    </div>
  );
}
