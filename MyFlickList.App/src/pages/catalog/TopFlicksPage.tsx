import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import useQueryParams from '../../shared/useQueryParams';
import { routes } from '../PageRouter';
import FlickTable from './shared/FlickTable';

export default function TopFlicksPage() {
  const { page } = useQueryParams();
  const pageNumber = Number(page) || 1;

  return (
    <DataLoader
      getData={() => api.catalog.getTopFlicks(pageNumber)}
      deps={[pageNumber]}
      render={(flicks) => (
        <div>
          <Meta title="Top" />

          <Breadcrumb
            segments={[
              { title: 'Home', href: routes.home() },
              { title: 'Catalog', href: routes.catalog() },
              { title: 'Top' }
            ]}
          />

          <FlickTable flicks={flicks.items} startingPosition={1 + (pageNumber - 1) * 10} />

          <Paginator
            currentPage={pageNumber}
            lastPage={flicks.totalPages}
            getPageHref={(p) => routes.catalogFlicksTop(p)}
          />
        </div>
      )}
    />
  );
}
