import React from 'react';
import api from '../../infra/api';
import { FlickOrder } from '../../infra/api.generated';
import DataLoader from '../../shared/DataLoader';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import useAuthToken from '../../shared/useAuthToken';
import useQueryParams from '../../shared/useQueryParams';
import { routes } from '../Routing';
import FlickTable from './shared/FlickTable';

export default function FlicksPage() {
  const [token] = useAuthToken();
  const { order, filterTag, page } = useQueryParams();
  const pageNumber = Number(page) || 1;

  return (
    <DataLoader
      getData={() => api.flicks(token).getFlicks(order as FlickOrder, filterTag, pageNumber)}
      deps={[order, filterTag, pageNumber]}
      render={(flicks) => (
        <div>
          <Meta title={order ? `${order} Flicks` : 'Flicks'} />

          <h1>Flicks</h1>

          <FlickTable flicks={flicks.items} startingPosition={1 + (pageNumber - 1) * 10} />

          <Paginator
            currentPage={pageNumber}
            lastPage={flicks.totalPages}
            getPageHref={(p) =>
              routes.flicks.href({ order: order as FlickOrder, filterTag, page: p })
            }
          />
        </div>
      )}
    />
  );
}
