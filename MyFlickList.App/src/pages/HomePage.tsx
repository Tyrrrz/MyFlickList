import React, { useState } from 'react';
import api from '../infra/api';
import { GetFlicksResponseItem } from '../infra/api.generated';
import { FlickHelper } from '../infra/helpers';
import { slugify } from '../infra/utils';
import routes from '../routes';
import Link from '../shared/Link';
import Meta from '../shared/Meta';
import useAuthToken from '../shared/useAuthToken';
import useQuery from '../shared/useQuery';

interface FlickSpotlightItemProps {
  flick: GetFlicksResponseItem;
  position: number;
}

function FlickSpotlightItem({ flick, position }: FlickSpotlightItemProps) {
  const [isHover, setIsHover] = useState(false);

  const flickHelper = new FlickHelper(flick);

  return (
    <Link
      className="block"
      href={routes.flick({ flickId: flick.id, flickTitle: slugify(flick.title) })}
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

export default function HomePage() {
  const [token] = useAuthToken();
  const flicks = useQuery(() => api.flicks(token).getFlicks('Top'), ['home top flicks']);

  return (
    <div>
      <Meta />

      <div className="my-4 flex flex-row justify-center">
        {flicks.items.map((flick, i) => (
          <FlickSpotlightItem key={flick.id} position={i} flick={flick} />
        ))}
      </div>
    </div>
  );
}
