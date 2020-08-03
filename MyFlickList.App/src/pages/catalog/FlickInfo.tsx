import React from 'react';
import { useParams } from 'react-router';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Link from '../../shared/Link';
import { FlickResponse } from '../../infra/api.generated';
import api from '../../infra/api';

function FlickData({ flick }: { flick: FlickResponse }) {
  const flickImageUrl = api.utils.getImageUrl(flick.imageId!);

  return (
    <div>
      <h3>{flick.title}</h3>
      <div>
        <span>{flick.kind?.toString()}</span> <span>({flick.premiereDate?.getUTCFullYear()})</span>
      </div>
      <div className="mt-2 d-flex flex-row">
        <div className="mr-1" style={{ maxWidth: '20em' }}>
          <img className="mw-100" alt={flick.title} src={flickImageUrl} />
        </div>
        <div className="ml-1 flex-grow-1">
          <div>
            <h5>Synopsis</h5>
            <p>{flick.synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlickInfo() {
  const { flickId } = useParams();
  const flick = useAsyncStateEffect(() => api.catalog.getFlick(flickId), [flickId]);

  return (
    <div>
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
