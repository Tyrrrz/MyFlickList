import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';
import useQueryParam from '../../shared/useQueryParam';
import FlicksTable from './shared/FlicksTable';

export default function FlicksSearch() {
  const history = useHistory();

  const query = useQueryParam('query');
  const page = parseInt(useQueryParam('page') ?? '') || 1;

  const [flicks, flicksError] = useAsyncStateEffect(() => api.catalog.searchFlicks(query, page), [query, page], !!query);

  const [stagingQuery, setStagingQuery] = useState(query ?? '');

  return (
    <div>
      <Meta title="Search" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: 'Search' }]} />

      <form
        className="w-75 mx-auto my-5"
        onSubmit={(e) => {
          e.preventDefault();
          history.push(`?query=${stagingQuery}`);
        }}
      >
        <div className="form-row">
          <div className="col">
            <input
              className="form-control-lg w-100"
              type="text"
              autoFocus
              value={stagingQuery}
              onChange={(e) => setStagingQuery(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button className="btn-lg btn-primary btn-block" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {query && (
        <StateLoader
          state={flicks}
          error={flicksError}
          render={(fs) => (
            <>
              {fs.items.length > 0 && <FlicksTable flicks={fs.items} startingPosition={1 + (page - 1) * 10} />}
              {fs.items.length > 0 && <Paginator currentPage={page} lastPage={fs.totalPageCount} getPageHref={(p) => `?page=${p}`} />}

              {fs.items.length <= 0 && <p className="display-4 text-center">Nothing found :(</p>}

              <p className="mt-5 lead text-center">
                Didn&apos;t find what you were looking for? You can <Link href="/catalog/flicks/request">request</Link> a new flick to be
                added.
              </p>
            </>
          )}
        />
      )}
    </div>
  );
}
