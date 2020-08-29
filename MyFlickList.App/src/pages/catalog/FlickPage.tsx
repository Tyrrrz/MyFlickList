import React from 'react';
import { FiCalendar, FiClock, FiExternalLink, FiShare2, FiStar, FiTag, FiTv } from 'react-icons/fi';
import api from '../../infra/api';
import { FlickKind, FlickResponse } from '../../infra/api.generated';
import Breadcrumb from '../../shared/Breadcrumb';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useRouteParams from '../../shared/useRouteParams';

function formatRating(flick: FlickResponse) {
  if (!flick.externalRating) return '--';
  return flick.externalRating.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

function formatKind(flick: FlickResponse) {
  return flick.episodeCount && flick.episodeCount > 0
    ? `${flick.kind} (${flick.episodeCount} episodes)`
    : flick.kind.toString();
}

function formatDate(flick: FlickResponse) {
  if (!flick.premiereDate) return '--';
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (flick.kind === FlickKind.Movie) return formatter.format(flick.premiereDate);

  if (flick.finaleDate)
    return `${formatter.format(flick.premiereDate)} - ${formatter.format(flick.finaleDate)}`;
  return `${formatter.format(flick.premiereDate)} - ...`;
}

function formatRuntime(flick: FlickResponse) {
  if (!flick.runtime) return '--';

  const components = flick.runtime.split(':');
  const hours = parseInt(components[0]);
  const minutes = parseInt(components[1]);

  if (hours + minutes <= 0) return '--';

  const hoursSuffix = hours === 1 ? 'hour' : 'hours';
  const minutesSuffix = minutes === 1 ? 'minute' : 'minutes';

  const formatted =
    hours > 0 && minutes > 0
      ? `${hours} ${hoursSuffix} ${minutes} ${minutesSuffix}`
      : hours > 0
      ? `${hours} ${hoursSuffix}`
      : `${minutes} ${minutesSuffix}`;

  return flick.kind === FlickKind.Series ? `${formatted} / episode` : formatted;
}

function formatTags(flick: FlickResponse) {
  if (!flick.tags || flick.tags.length <= 0) return '--';

  return flick.tags.join(', ');
}

function NetworkLinks({ flick }: { flick: FlickResponse }) {
  return (
    <div>
      <div className="my-1">
        <FiExternalLink />{' '}
        <Link href={`https://imdb.com/title/${encodeURIComponent(flick.id)}`} target="_blank">
          Find on IMDB
        </Link>
      </div>
      <div className="my-1">
        <FiExternalLink />{' '}
        <Link
          href={`https://themoviedb.org/search?query=${encodeURIComponent(flick.title)}`}
          target="_blank"
        >
          Find on TMDB
        </Link>
      </div>
      <div className="my-1">
        <FiExternalLink />{' '}
        <Link
          href={`https://netflix.com/search?q=${encodeURIComponent(flick.title)}`}
          target="_blank"
        >
          Find on Netflix
        </Link>
      </div>
      <div className="my-1">
        <FiExternalLink />{' '}
        <Link
          href={`https://hbo.com/searchresults?q=${encodeURIComponent(flick.title)}`}
          target="_blank"
        >
          Find on HBO
        </Link>
      </div>
    </div>
  );
}

function SocialShareLinks({ flick }: { flick: FlickResponse }) {
  const selfUrl = window.location.origin + window.location.pathname;

  return (
    <div className="mt-4">
      <div className="my-1">
        <FiShare2 />{' '}
        <Link
          href={`https://twitter.com/share?related=myflicklist.net&via=myflicklist&url=${encodeURIComponent(
            selfUrl
          )}&text=${encodeURIComponent(flick.title)}&hashtags=myflicklist`}
          target="_blank"
        >
          Share on Twitter
        </Link>
      </div>
      <div className="my-1">
        <FiShare2 />{' '}
        <Link
          href={`https://reddit.com/submit?url=${encodeURIComponent(
            selfUrl
          )}&title=${encodeURIComponent(flick.title)}`}
          target="_blank"
        >
          Share on Reddit
        </Link>
      </div>
      <div className="my-1">
        <FiShare2 />{' '}
        <Link
          href={`https://facebook.com/share.php?u=${encodeURIComponent(selfUrl)}`}
          target="_blank"
        >
          Share on Facebook
        </Link>
      </div>
    </div>
  );
}

function FlickData({ flick }: { flick: FlickResponse }) {
  const flickImageUrl =
    (flick.imageId && api.utils.getImageUrl(flick.imageId)) || '/images/poster-placeholder.png';

  return (
    <div>
      <Meta imageUrl={flickImageUrl} />

      <h3>{flick.title}</h3>

      <div className="m-0 mt-3 p-0 container container-fluid">
        <div className="row">
          <div className="col col-3">
            <img className="mw-100" alt={flick.title} src={flickImageUrl} />

            <div className="my-1 mt-3">
              <FiStar /> <span>{formatRating(flick)}</span>
            </div>
            <div className="my-1">
              <FiCalendar /> <span>{formatDate(flick)}</span>
            </div>
            <div className="my-1">
              <FiTv /> <span>{formatKind(flick)}</span>
            </div>
            <div className="my-1">
              <FiClock /> <span>{formatRuntime(flick)}</span>
            </div>
            <div className="my-1">
              <FiTag /> <span>{formatTags(flick)}</span>
            </div>

            <hr className="w-75" />

            <NetworkLinks flick={flick} />
            <SocialShareLinks flick={flick} />
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
              <p>{flick.synopsis}</p>
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
      <Meta title={flick?.title} description={flick?.synopsis} />

      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Catalog', href: '/catalog' },
          { title: flick?.title ?? '...' }
        ]}
      />

      <StateLoader state={flick} error={flickError} render={(f) => <FlickData flick={f} />} />
    </div>
  );
}
