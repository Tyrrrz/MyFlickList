import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Link from '../../shared/Link';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import LoadingSpinner from '../../shared/LoadingSpinner';
import FlickList from './FlickList';
import api from '../../infra/api';

export default function TrendingFlicks() {
  const flicks = useAsyncStateEffect(() => api.catalog.getTrendingFlicks(), []);

  return (
    <div>
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
