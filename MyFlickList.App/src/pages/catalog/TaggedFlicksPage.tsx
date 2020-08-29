import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import useQueryParams from '../../shared/useQueryParams';
import useRouteParams from '../../shared/useRouteParams';
import FlickTable from './shared/FlickTable';

export default function TaggedFlicksPage() {
  const { tagName } = useRouteParams();

  const { page } = useQueryParams();
  const pageNumber = Number(page) || 1;

  return (
    <DataLoader
      getData={() => api.catalog.getTaggedFlicks(tagName, pageNumber)}
      deps={[tagName, pageNumber]}
      render={(flicks) => (
        <div>
          <Meta title={tagName} />

          <Breadcrumb
            segments={[
              { title: 'Home', href: '/' },
              { title: 'Catalog', href: '/catalog' },
              { title: tagName }
            ]}
          />

          <FlickTable flicks={flicks.items} startingPosition={1 + (pageNumber - 1) * 10} />

          <Paginator
            currentPage={pageNumber}
            lastPage={flicks.totalPages}
            getPageHref={(p) => `?page=${p}`}
          />
        </div>
      )}
    />
  );
}
