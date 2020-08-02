import React, { useState, useEffect } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { FlickResponse, FlickKind } from '../infra/api.generated';
import api from '../infra/api';

function FlickListings({ flicks }: { flicks?: FlickResponse[] }) {
  if (!flicks) return <div>Loading...</div>;

  return (
    <Table striped size="sm">
      <colgroup>
        <col style={{ width: 'auto' }} />
        <col />
        <col style={{ width: 'auto' }} />
        <col style={{ width: 'auto' }} />
        <col style={{ width: 'auto' }} />
      </colgroup>

      <thead>
        <th style={{ textAlign: 'center' }}>#</th>
        <th>Flick</th>
        <th>Avg. Rating</th>
        <th>Your Rating</th>
        <th>Listing</th>
      </thead>

      <tbody>
        {flicks.map((flick, i) => (
          <tr key={flick.id}>
            <td style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>{i + 1}</td>
            <td>
              <Container style={{ padding: 0, margin: 0 }}>
                <Row>
                  <Col md="auto">
                    {flick.imageId && <img width={50} alt={flick.title} src={api.utils.getImageUrl(flick.imageId)} loading="lazy" />}
                  </Col>
                  <Col>
                    <div>{flick.title}</div>
                    <div>
                      {flick.kind?.toString()} {flick.kind === FlickKind.Series && flick.episodeCount && `(${flick.episodeCount} eps)`}
                    </div>
                    <div>{flick.premiereDate?.getUTCFullYear()}</div>
                  </Col>
                </Row>
              </Container>
            </td>
            <td>10</td>
            <td>N/A</td>
            <td>N/A</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function Catalog() {
  const [catalog, setCatalog] = useState<FlickResponse[] | undefined>(undefined);

  useEffect(() => {
    api.catalog.getTopFlicks().then(setCatalog);
  }, []);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
      </Breadcrumb>

      <FlickListings flicks={catalog} />
    </div>
  );
}
