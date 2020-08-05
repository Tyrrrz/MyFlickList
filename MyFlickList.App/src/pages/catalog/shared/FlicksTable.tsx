import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import api from '../../../infra/api';
import { FlickListingResponse } from '../../../infra/api.generated';
import Link from '../../../shared/Link';

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
                {flick.kind} {formatEpisodeCount(flick)}
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

interface FlicksTableProps {
  flicks: FlickListingResponse[];
  startingPosition: number;
}

export default function FlicksTable({ flicks, startingPosition }: FlicksTableProps) {
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
