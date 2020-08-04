import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import useQueryParam from '../../shared/useQueryParam';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import Meta from '../../shared/Meta';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Breadcrumb from '../../shared/Breadcrumb';
import Paginator from '../../shared/Paginator';
import { FlickListingResponse, PaginatedResponseOfFlickListingResponse } from '../../infra/api.generated';
import api from '../../infra/api';

function formatEpisodeCount(flick: FlickListingResponse) {
  return flick.episodeCount && `(${flick.episodeCount} eps)`;
}

interface FlickRowProps {
  flick: FlickListingResponse;
  position: number;
}

function FlickRow({ flick, position }: FlickRowProps) {
  const flickUrl = `/catalog/flicks/${flick.id}`;
  const flickImageUrl = api.utils.getImageUrl(flick.imageId!);

  return (
    <tr>
      <td className="h1 font-weight-bold text-center text-muted align-middle">{position}</td>
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
                {flick.kind.toString()} {formatEpisodeCount(flick)}
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

interface FlickTableProps {
  flicks: FlickListingResponse[];
  startingPosition: number;
}

function FlickTable({ flicks, startingPosition }: FlickTableProps) {
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
          <FlickRow key={flick.id} flick={flick} position={startingPosition + i} />
        ))}
      </tbody>
    </Table>
  );
}

interface FlicksIndexProps {
  indexTitle: string;
  resolve: (page: number) => Promise<PaginatedResponseOfFlickListingResponse>;
}

export default function FlicksIndex({ indexTitle, resolve }: FlicksIndexProps) {
  // Page needs to be reflected in the URL
  const pageParam = parseInt(useQueryParam('page') ?? '');
  const page = pageParam >= 1 ? pageParam : 1;

  const flicks = useAsyncStateEffect(() => resolve(page), [page]);

  return (
    <div>
      <Meta title="Top" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: indexTitle }]} />

      {flicks ? <FlickTable flicks={flicks.items} startingPosition={1 + (page - 1) * 10} /> : <LoadingSpinner />}

      {flicks && <Paginator currentPage={page} lastPage={flicks.totalPageCount} getPageHref={(p) => `?page=${p}`} />}
    </div>
  );
}

export function TopFlicksIndex() {
  return <FlicksIndex indexTitle="Top" resolve={(page) => api.catalog.getTopFlicks(page)} />;
}

export function TrendingFlicksIndex() {
  return <FlicksIndex indexTitle="Trending" resolve={(page) => api.catalog.getTrendingFlicks(page)} />;
}

export function NewFlicksIndex() {
  return <FlicksIndex indexTitle="New" resolve={(page) => api.catalog.getNewFlicks(page)} />;
}
