import React from 'react';
import api from '../../infra/api';
import { PaginatedResponseOfFlickListingResponse } from '../../infra/api.generated';
import Breadcrumb from '../../shared/Breadcrumb';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useQueryParam from '../../shared/useQueryParam';
import FlicksTable from './shared/FlicksTable';

interface FlicksIndexProps {
  indexTitle: string;
  resolve: (page: number) => Promise<PaginatedResponseOfFlickListingResponse>;
}

export default function FlicksIndex({ indexTitle, resolve }: FlicksIndexProps) {
  // Page number needs to be reflected in the URL
  const pageParam = parseInt(useQueryParam('page') ?? '');
  const page = pageParam >= 1 ? pageParam : 1;

  const [flicks, flicksError] = useAsyncStateEffect(() => resolve(page), [page]);

  return (
    <div>
      <Meta title={indexTitle} />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: indexTitle }]} />

      <StateLoader
        state={flicks}
        error={flicksError}
        render={(fs) => (
          <>
            <FlicksTable flicks={fs.items} startingPosition={1 + (page - 1) * 10} />
            <Paginator currentPage={page} lastPage={fs.totalPageCount} getPageHref={(p) => `?page=${p}`} />
          </>
        )}
      />
    </div>
  );
}

export function TopFlicksIndex() {
  return <FlicksIndex indexTitle="Top" resolve={(page) => api.catalog.getTopFlicks(page)} />;
}

export function TrendingFlicksIndex() {
  return <FlicksIndex indexTitle="Trending" resolve={(page) => api.catalog.getTrendingFlicks(page)} />;
}

export function NewFlicksIndex() {
  return <FlicksIndex indexTitle="New" resolve={(page) => api.catalog.getNewFlicks(page)} />;
}
