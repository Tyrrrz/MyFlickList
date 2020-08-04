import React from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import { mdiCalendarBlank, mdiMovieOpenOutline, mdiClockOutline, mdiOpenInNew, mdiShareVariantOutline } from '@mdi/js';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Meta from '../../shared/Meta';
import Icon from '../../shared/Icon';
import Link from '../../shared/Link';
import Breadcrumb from '../../shared/Breadcrumb';
import { FlickResponse, FlickKind } from '../../infra/api.generated';
import api from '../../infra/api';

function formatKind(flick: FlickResponse) {
  return flick.episodeCount && flick.episodeCount > 0 ? `${flick.kind.toString()} (${flick.episodeCount} episodes)` : flick.kind.toString();
}

function formatPremiereDate(flick: FlickResponse) {
  if (!flick.premiereDate) return '--';
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(flick.premiereDate);
}

function formatRuntime(flick: FlickResponse) {
  if (!flick.runtime) return '--';

  const components = flick.runtime.split(':');
  const hours = parseInt(components[0]);
  const minutes = parseInt(components[1]);

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

function NetworkLinks({ flick }: { flick: FlickResponse }) {
  return (
    <div>
      <div className="my-1">
        <Icon path={mdiOpenInNew} />{' '}
        <Link href={`https://imdb.com/title/${flick.id}`} target="_blank">
          Find on IMDB
        </Link>
      </div>
      <div className="my-1">
        <Icon path={mdiOpenInNew} />{' '}
        <Link href={`https://themoviedb.org/search?query=${encodeURIComponent(flick.title)}`} target="_blank">
          Find on TMDB
        </Link>
      </div>
      <div className="my-1">
        <Icon path={mdiOpenInNew} />{' '}
        <Link href={`https://netflix.com/search?q=${encodeURIComponent(flick.title)}`} target="_blank">
          Find on Netflix
        </Link>
      </div>
      <div className="my-1">
        <Icon path={mdiOpenInNew} />{' '}
        <Link href={`https://hbo.com/searchresults?q=${encodeURIComponent(flick.title)}`} target="_blank">
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
        <Icon path={mdiShareVariantOutline} />{' '}
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
        <Icon path={mdiShareVariantOutline} />{' '}
        <Link
          href={`https://reddit.com/submit?url=${encodeURIComponent(selfUrl)}&title=${encodeURIComponent(flick.title)}`}
          target="_blank"
        >
          Share on Reddit
        </Link>
      </div>
      <div className="my-1">
        <Icon path={mdiShareVariantOutline} />{' '}
        <Link href={`https://facebook.com/share.php?u=${encodeURIComponent(selfUrl)}`} target="_blank">
          Share on Facebook
        </Link>
      </div>
    </div>
  );
}

function FlickData({ flick }: { flick: FlickResponse }) {
  const flickImageUrl = api.utils.getImageUrl(flick.imageId!);

  return (
    <div>
      <h3>{flick.title}</h3>

      <Container fluid className="m-0 mt-3 p-0">
        <Row>
          <Col className="col-3">
            <img className="mw-100" alt={flick.title} src={flickImageUrl} />

            <div className="my-1 mt-3">
              <Icon path={mdiCalendarBlank} /> <span>{formatPremiereDate(flick)}</span>
            </div>
            <div className="my-1">
              <Icon path={mdiMovieOpenOutline} /> <span>{formatKind(flick)}</span>
            </div>
            <div className="my-1">
              <Icon path={mdiClockOutline} /> <span>{formatRuntime(flick)}</span>
            </div>

            <hr className="w-75" />

            <NetworkLinks flick={flick} />
            <SocialShareLinks flick={flick} />
          </Col>
          <Col>
            <Jumbotron>
              <h3>Create account to add this {flick.kind.toString().toLowerCase()} to your list</h3>
              <p>
                <Button>Sign up</Button>
              </p>
            </Jumbotron>

            <div>
              <h5>Synopsis</h5>
              <p>{flick.synopsis}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default function FlickInfo() {
  const { flickId } = useParams();
  const flick = useAsyncStateEffect(() => api.catalog.getFlick(flickId), [flickId]);

  return (
    <div>
      <Meta title={flick?.title} description={flick?.synopsis} />

      <Breadcrumb
        segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: flick?.title ?? 'Loading...' }]}
      />

      {flick ? <FlickData flick={flick} /> : <LoadingSpinner />}
    </div>
  );
}
