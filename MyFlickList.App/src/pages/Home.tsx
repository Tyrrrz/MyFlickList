import React from 'react';
import useAsyncStateEffect from '../shared/useAsyncStateEffect';
import Meta from '../shared/Meta';
import Link from '../shared/Link';
import LoadingSpinner from '../shared/LoadingSpinner';
import Breadcrumb from '../shared/Breadcrumb';
import { FlickListingResponse } from '../infra/api.generated';
import api from '../infra/api';

function FlickSpotlight({ flick }: { flick: FlickListingResponse }) {
  const flickUrl = `/catalog/flicks/${flick.id}`;
  const flickImageUrl = api.utils.getImageUrl(flick.imageId!);

  return (
    <div className="position-relative mr-2" style={{ width: '15rem' }} title={flick.title}>
      <Link href={flickUrl}>
        <img className="rounded w-100" alt={flick.title} src={flickImageUrl} />
        <div
          className="position-absolute w-100 p-2 rounded text-white text-truncate font-weight-bold"
          style={{
            bottom: 0,
            background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%)'
          }}
        >
          {flick.title}
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const topFlicks = useAsyncStateEffect(() => api.catalog.getTopFlicks(0, 5), []);
  const trendingFlicks = useAsyncStateEffect(() => api.catalog.getTrendingFlicks(0, 5), []);
  const newFlicks = useAsyncStateEffect(() => api.catalog.getNewFlicks(0, 5), []);

  return (
    <div>
      <Meta />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }]} />

      {/* Top */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/top">
          <h3>Top Flicks</h3>
        </Link>
        <div className="d-flex flex-row">
          {topFlicks?.map((flick) => <FlickSpotlight key={flick.id} flick={flick} />) ?? <LoadingSpinner />}
        </div>
      </div>

      {/* Trending */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/trending">
          <h3>Trending Flicks</h3>
        </Link>
        <div className="d-flex flex-row">
          {trendingFlicks?.map((flick) => <FlickSpotlight key={flick.id} flick={flick} />) ?? <LoadingSpinner />}
        </div>
      </div>

      {/* New */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/new">
          <h3>New Flicks</h3>
        </Link>
        <div className="d-flex flex-row">
          {newFlicks?.map((flick) => <FlickSpotlight key={flick.id} flick={flick} />) ?? <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
}
