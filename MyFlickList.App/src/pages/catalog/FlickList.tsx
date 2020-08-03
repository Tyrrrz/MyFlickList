import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Link from '../../shared/Link';
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
      <td className="h5 text-muted align-middle">10</td>
      <td className="h5 text-muted align-middle">N/A</td>
      <td className="h5 text-muted align-middle">N/A</td>
    </tr>
  );
}

export default function FlickList({ flicks }: { flicks: FlickListingResponse[] }) {
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
          <th>Avg. Rating</th>
          <th>Your Rating</th>
          <th>Listing</th>
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
