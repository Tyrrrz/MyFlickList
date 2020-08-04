import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import useQueryParam from '../../shared/useQueryParam';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import Meta from '../../shared/Meta';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Paginator from '../../shared/Paginator';
import { FlickListingResponse } from '../../infra/api.generated';
import api from '../../infra/api';

function formatEpisodeCount(flick: FlickListingResponse) {
  return flick.episodeCount && `(${flick.episodeCount} eps)`;
}

function FlickRow({ flick, number }: { flick: FlickListingResponse; number: number }) {
  const flickUrl = `/catalog/flicks/${flick.id}`;
  const flickImageUrl = api.utils.getImageUrl(flick.imageId!);

  return (
    <tr>
      <td className="h1 font-weight-bold text-center text-muted align-middle">{number}</td>
      <td>
        <Container className="m-0 p-0">
          <Row>
            <Col md="auto">
              <img style={{ width: '4rem' }} alt={flick.title} src={flickImageUrl} />
            </Col>
            <Col>
              <div>
                <Link className="font-weight-bold text-truncate" href={flickUrl}>
                  {flick.title}
                </Link>
              </div>
              <div>
                {flick.kind?.toString() ?? '--'} {formatEpisodeCount(flick)}
              </div>
              <div>{flick.premiereDate?.getUTCFullYear() ?? '--'}</div>
            </Col>
          </Row>
        </Container>
      </td>
      <td className="h5 text-center text-muted align-middle">10</td>
      <td className="h5 text-center text-muted align-middle">N/A</td>
      <td className="h5 text-center text-muted align-middle">N/A</td>
    </tr>
  );
}

function FlickTable({ flicks }: { flicks: FlickListingResponse[] }) {
  return (
    <Table striped borderless>
      <colgroup>
        <col className="w-auto" />
        <col />
        <col className="w-auto" />
        <col className="w-auto" />
        <col className="w-auto" />
      </colgroup>

      <thead>
        <tr>
          <th className="text-center">#</th>
          <th>Flick</th>
          <th className="text-center">Avg. Rating</th>
          <th className="text-center">Your Rating</th>
          <th className="text-center">Listing</th>
        </tr>
      </thead>

      <tbody>
        {flicks.map((flick, i) => (
          <FlickRow key={flick.id} flick={flick} number={i + 1} />
        ))}
      </tbody>
    </Table>
  );
}

interface FlicksIndexProps {
  indexName: string;
  resolve: (offset: number, count: number) => Promise<FlickListingResponse[]>;
}

export default function FlicksIndex({ indexName, resolve }: FlicksIndexProps) {
  // Page needs to be reflected in the URL
  const pageParam = parseInt(useQueryParam('page') ?? '');
  const page = pageParam >= 1 ? pageParam : 1;

  const flicks = useAsyncStateEffect(() => resolve((page - 1) * 20, 20), [page]);

  return (
    <div>
      <Meta title="Top" />

      <Breadcrumb>
        <Breadcrumb.Item href="/" linkAs={Link}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/catalog" linkAs={Link}>
          Catalog
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} active>
          {indexName}
        </Breadcrumb.Item>
      </Breadcrumb>

      {flicks ? <FlickTable flicks={flicks} /> : <LoadingSpinner />}

      <Paginator currentPage={page} lastPage={10} getPageHref={(p) => `?page=${p}`} />
    </div>
  );
}

export function TopFlicksIndex() {
  return <FlicksIndex indexName="Top" resolve={(offset, count) => api.catalog.getTopFlicks(offset, count)} />;
}

export function TrendingFlicksIndex() {
  return <FlicksIndex indexName="Trending" resolve={(offset, count) => api.catalog.getTrendingFlicks(offset, count)} />;
}

export function NewFlicksIndex() {
  return <FlicksIndex indexName="New" resolve={(offset, count) => api.catalog.getNewFlicks(offset, count)} />;
}
