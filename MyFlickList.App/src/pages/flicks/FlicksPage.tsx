import React from 'react';
import api from '../../infra/api';
import { FlickOrder } from '../../infra/api.generated';
import { routes } from '../../Routing';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import useAuthToken from '../../shared/useAuthToken';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';
import FlickTable from './shared/FlickTable';

export default function FlicksPage() {
  const { order, filterTag, page } = useParams();
  const [token] = useAuthToken();

  const pageNumber = Number(page) || 1;

  const flicks = useQuery(
    () => api.flicks(token).getFlicks(order as FlickOrder, filterTag, pageNumber),
    [order, filterTag, pageNumber]
  );

  return (
    <div>
      <Meta title={order ? `${order} Flicks` : 'Flicks'} />

      <h1>Flicks</h1>

      <FlickTable flicks={flicks.items} startingPosition={1 + (pageNumber - 1) * 10} />

      <Paginator
        currentPage={pageNumber}
        lastPage={flicks.totalPages}
        getPageHref={(p) => routes.flicks({ order: order as FlickOrder, filterTag, page: p })}
      />
    </div>
  );
}
