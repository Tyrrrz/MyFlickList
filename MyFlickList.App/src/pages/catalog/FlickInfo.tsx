import React from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import { mdiCalendarBlank, mdiMovieOpenOutline, mdiClockOutline, mdiOpenInNew } from '@mdi/js';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Meta from '../../shared/Meta';
import Icon from '../../shared/Icon';
import Link from '../../shared/Link';
import { FlickResponse, FlickKind } from '../../infra/api.generated';
import api from '../../infra/api';

function formatEpisodeCount(flick: FlickResponse) {
  return flick.episodeCount && `(${flick.episodeCount} episodes)`;
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
              <Icon path={mdiCalendarBlank} /> <span>{flick.premiereDate?.toLocaleDateString('en-US')}</span>
            </div>
            <div className="my-1">
              <Icon path={mdiMovieOpenOutline} />{' '}
              <span>
                {flick.kind?.toString()} {formatEpisodeCount(flick)}
              </span>
            </div>
            <div className="my-1">
              <Icon path={mdiClockOutline} />{' '}
              <span>
                {flick.runtime?.toString()} {flick.kind === FlickKind.Series && '(per episode)'}
              </span>
            </div>

            <hr className="w-75" />

            <div className="my-1">
              <Icon path={mdiOpenInNew} />{' '}
              <Link href={`https://imdb.com/title/${flick.id}`} target="_blank">
                Find on IMDB
              </Link>
            </div>
            <div className="my-1">
              <Icon path={mdiOpenInNew} />{' '}
              <Link href={`https://themoviedb.org/search?query=${encodeURIComponent(flick.title!)}`} target="_blank">
                Find on TMDB
              </Link>
            </div>
            <div className="my-1">
              <Icon path={mdiOpenInNew} />{' '}
              <Link href={`https://netflix.com/search?q=${encodeURIComponent(flick.title!)}`} target="_blank">
                Find on Netflix
              </Link>
            </div>
            <div className="my-1">
              <Icon path={mdiOpenInNew} />{' '}
              <Link href={`https://hbo.com/searchresults?q=${encodeURIComponent(flick.title!)}`} target="_blank">
                Find on HBO
              </Link>
            </div>
          </Col>
          <Col>
            <Jumbotron>
              <h3>Create account to add this {flick.kind?.toString().toLowerCase()} to your list</h3>
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

      <Breadcrumb>
        <Breadcrumb.Item href="/" linkAs={Link}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/catalog" linkAs={Link}>
          Catalog
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} active>
          {flick?.title ?? 'Loading...'}
        </Breadcrumb.Item>
      </Breadcrumb>

      {flick ? <FlickData flick={flick} /> : <LoadingSpinner />}
    </div>
  );
}
