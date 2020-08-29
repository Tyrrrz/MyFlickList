import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useQueryParams from '../../shared/useQueryParams';
import FlickTable from './shared/FlickTable';

export default function TrendingFlicksPage() {
  const { page } = useQueryParams();
  const pageNumber = parseInt(page) || 1;

  const [flicks, flicksError] = useAsyncStateEffect(
    () => api.catalog.getTrendingFlicks(pageNumber),
    [pageNumber]
  );

  return (
    <div>
      <Meta title="Trending" />
      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Catalog', href: '/catalog' },
          { title: 'Trending' }
        ]}
      />

      <StateLoader
        state={flicks}
        error={flicksError}
        render={(fs) => (
          <>
            <FlickTable flicks={fs.items} startingPosition={1 + (pageNumber - 1) * 10} />
            <Paginator
              currentPage={pageNumber}
              lastPage={fs.totalPages}
              getPageHref={(p) => `?page=${p}`}
            />
          </>
        )}
      />
    </div>
  );
}
