import React, { useState } from 'react';
import api from '../infra/api';
import { FlickListingResponse, FlickOrder } from '../infra/api.generated';
import { FlickHelper } from '../infra/helpers';
import DataLoader from '../shared/DataLoader';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import { routes } from './PageRouter';

interface FlickSpotlightItemProps {
  flick: FlickListingResponse;
  position: number;
}

function FlickSpotlightItem({ flick, position }: FlickSpotlightItemProps) {
  const [isHover, setIsHover] = useState(false);

  const flickHelper = new FlickHelper(flick);

  return (
    <Link
      className="block"
      href={routes.flick(flick.id)}
      style={{
        marginLeft: -15 * position,
        transform: !isHover ? `scale(${1 - 0.05 * position})` : 'scale(1.1)',
        zIndex: !isHover ? 100 - 1 * position : 100,
        boxShadow: '5px 4px 16px 0px rgba(0,0,0,0.7)'
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      title={flick.title}
    >
      <img alt={flick.title} src={flickHelper.getCoverImageUrl()} width={500} height={750} />
    </Link>
  );
}

function FlickSpotlight({ flicks }: { flicks: FlickListingResponse[] }) {
  return (
    <div className="my-4 flex flex-row justify-center">
      {flicks.map((flick, i) => (
        <FlickSpotlightItem key={flick.id} position={i} flick={flick} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <DataLoader
      getData={() => api.flicks.getFlicks(FlickOrder.Top)}
      render={(flicks) => (
        <div>
          <Meta />

          <FlickSpotlight flicks={flicks.items} />
        </div>
      )}
    />
  );
}
