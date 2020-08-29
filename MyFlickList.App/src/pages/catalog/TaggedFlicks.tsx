import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useQueryParams from '../../shared/useQueryParams';
import useRouteParams from '../../shared/useRouteParams';
import FlickTable from './shared/FlickTable';

export default function TaggedFlicks() {
  const { tagName } = useRouteParams();

  const { page } = useQueryParams();
  const pageNumber = parseInt(page) || 1;

  const [flicks, flicksError] = useAsyncStateEffect(
    () => api.catalog.getTaggedFlicks(tagName, pageNumber),
    [tagName, pageNumber],
    !!tagName
  );

  return (
    <div>
      <Meta title={tagName} />
      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Catalog', href: '/catalog' },
          { title: tagName }
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
