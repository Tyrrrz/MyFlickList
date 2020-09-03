import React from 'react';
import api from '../infra/api';
import { FlickListingResponse, FlickOrder } from '../infra/api.generated';
import { FlickHelper } from '../infra/helpers';
import Breadcrumb from '../shared/Breadcrumb';
import DataLoader from '../shared/DataLoader';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import { routes } from './PageRouter';

function FlickSpotlight({ flick }: { flick: FlickListingResponse }) {
  const flickHelper = new FlickHelper(flick);

  return (
    <div
      className="position-relative mr-2 hover-highlight"
      style={{ width: '15rem' }}
      title={flick.title}
    >
      <Link href={routes.flick(flick.id)}>
        <img className="w-100 rounded" alt={flick.title} src={flickHelper.getCoverImageUrl()} />
        <div
          className="position-absolute w-100 p-2 rounded text-white text-truncate font-weight-bold"
          style={{
            bottom: 0,
            background:
              'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0) 100%)'
          }}
        >
          {flick.title}
        </div>
      </Link>
    </div>
  );
}

async function getData() {
  const [topFlicks, trendingFlicks, newFlicks] = await Promise.all([
    api.flicks.getFlicks(FlickOrder.Top),
    api.flicks.getFlicks(FlickOrder.Trending),
    api.flicks.getFlicks(FlickOrder.New)
  ]);

  return {
    topFlicks,
    trendingFlicks,
    newFlicks
  };
}

export default function HomePage() {
  return (
    <DataLoader
      getData={getData}
      render={({ topFlicks, trendingFlicks, newFlicks }) => (
        <div>
          <Meta />

          <Breadcrumb segments={[{ title: 'Home' }]} />

          {/* Top */}
          <div className="mt-4 mb-2">
            <Link className="text-body" href={routes.flicks({ order: FlickOrder.Top })}>
              <h3>Top</h3>
            </Link>
            <div className="d-flex flex-row">
              {topFlicks.items.slice(0, 5).map((flick) => (
                <FlickSpotlight key={flick.id} flick={flick} />
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="mt-4 mb-2">
            <Link className="text-body" href={routes.flicks({ order: FlickOrder.Trending })}>
              <h3>Trending</h3>
            </Link>
            <div className="d-flex flex-row">
              {trendingFlicks.items.slice(0, 5).map((flick) => (
                <FlickSpotlight key={flick.id} flick={flick} />
              ))}
            </div>
          </div>

          {/* New */}
          <div className="mt-4 mb-2">
            <Link className="text-body" href={routes.flicks({ order: FlickOrder.New })}>
              <h3>New</h3>
            </Link>
            <div className="d-flex flex-row">
              {newFlicks.items.slice(0, 5).map((flick) => (
                <FlickSpotlight key={flick.id} flick={flick} />
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
