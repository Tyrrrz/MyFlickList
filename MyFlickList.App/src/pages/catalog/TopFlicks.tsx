import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import Meta from '../../shared/Meta';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import FlickList from './FlickList';
import api from '../../infra/api';

export default function TopFlicks() {
  const flicks = useAsyncStateEffect(() => api.catalog.getTopFlicks(), []);

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
          Top
        </Breadcrumb.Item>
      </Breadcrumb>

      {flicks ? <FlickList flicks={flicks} /> : <LoadingSpinner />}
    </div>
  );
}
