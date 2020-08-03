import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import Meta from '../../shared/Meta';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import FlickList from './FlickList';
import api from '../../infra/api';

export default function TrendingFlicks() {
  const flicks = useAsyncStateEffect(() => api.catalog.getTrendingFlicks(), []);

  return (
    <div>
      <Meta title="Trending Flicks" />

      <Breadcrumb>
        <Breadcrumb.Item href="/" linkAs={Link}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} active>
          Trending
        </Breadcrumb.Item>
      </Breadcrumb>

      {flicks ? <FlickList flicks={flicks} /> : <LoadingSpinner />}
    </div>
  );
}
