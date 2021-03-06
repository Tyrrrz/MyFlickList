import React, { useState } from 'react';
import images from '../assets/images';
import Link from '../components/Link';
import Page from '../components/Page';
import useApi from '../context/useApi';
import useQuery from '../context/useQuery';
import { GetFlicksResponseItem } from '../internal/api.generated';
import { getFileUrl } from '../internal/fileHelpers';
import { slugify } from '../internal/utils';
import routes from '../routes';

interface FlickSpotlightItemProps {
  flick: GetFlicksResponseItem;
  position: number;
}

function FlickSpotlightItem({ flick, position }: FlickSpotlightItemProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className="transition-all duration-100"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        marginLeft: '-15px',
        transform: isHover ? 'scale(1.1)' : 'scale(1.0)',
        zIndex: isHover ? 100 : position
      }}
    >
      <Link
        href={routes.flicks.one({ flickId: flick.id, flickTitle: slugify(flick.title) })}
        title={flick.title}
      >
        <img
          className="shadow rounded-md"
          alt={flick.title}
          src={flick.coverImageId ? getFileUrl(flick.coverImageId) : images.posterFallback}
          width={500}
          height={750}
        />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const api = useApi();
  const flicks = useQuery(() => api.flicks.getFlicks('Top'), ['home top flicks']);

  return (
    <Page>
      <div className="my-4 flex flex-row justify-center">
        {flicks.items.slice(0, 5).map((flick, i) => (
          <FlickSpotlightItem key={flick.id} position={i} flick={flick} />
        ))}
      </div>
    </Page>
  );
}
