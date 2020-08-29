import React from 'react';
import api from '../infra/api';
import { FlickListingResponse } from '../infra/api.generated';
import Breadcrumb from '../shared/Breadcrumb';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import StateLoader from '../shared/StateLoader';
import useAsyncStateEffect from '../shared/useAsyncStateEffect';

function FlickSpotlight({ flick }: { flick: FlickListingResponse }) {
  const flickUrl = `/catalog/flicks/${flick.id}`;
  const flickImageUrl =
    (flick.imageId && api.utils.getImageUrl(flick.imageId)) || '/images/poster-placeholder.png';

  return (
    <div className="position-relative mr-2" style={{ width: '15rem' }} title={flick.title}>
      <Link href={flickUrl}>
        <img className="w-100 rounded hover-highlight" alt={flick.title} src={flickImageUrl} />
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

export default function Home() {
  const [topFlicks, topFlicksError] = useAsyncStateEffect(() => api.catalog.getTopFlicks(), []);
  const [trendingFlicks, trendingFlicksError] = useAsyncStateEffect(
    () => api.catalog.getTrendingFlicks(),
    []
  );
  const [newFlicks, newFlicksError] = useAsyncStateEffect(() => api.catalog.getNewFlicks(), []);

  return (
    <div>
      <Meta />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }]} />

      {/* Top */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/top">
          <h3>Top</h3>
        </Link>
        <div className="d-flex flex-row">
          <StateLoader
            state={topFlicks}
            error={topFlicksError}
            render={(fs) =>
              fs.items.slice(0, 5).map((flick) => <FlickSpotlight key={flick.id} flick={flick} />)
            }
          />
        </div>
      </div>

      {/* Trending */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/trending">
          <h3>Trending</h3>
        </Link>
        <div className="d-flex flex-row">
          <StateLoader
            state={trendingFlicks}
            error={trendingFlicksError}
            render={(fs) =>
              fs.items.slice(0, 5).map((flick) => <FlickSpotlight key={flick.id} flick={flick} />)
            }
          />
        </div>
      </div>

      {/* New */}
      <div className="mt-4 mb-2">
        <Link className="text-body" href="/catalog/flicks/new">
          <h3>New</h3>
        </Link>
        <div className="d-flex flex-row">
          <StateLoader
            state={newFlicks}
            error={newFlicksError}
            render={(fs) =>
              fs.items.slice(0, 5).map((flick) => <FlickSpotlight key={flick.id} flick={flick} />)
            }
          />
        </div>
      </div>
    </div>
  );
}
