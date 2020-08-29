import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import Paginator from '../../shared/Paginator';
import useQueryParams from '../../shared/useQueryParams';
import FlickTable from './shared/FlickTable';

export default function SearchFlicksPage() {
  const history = useHistory();

  const { query, page } = useQueryParams();
  const pageNumber = Number(page) || 1;

  const [stagingQuery, setStagingQuery] = useState(query ?? '');

  return (
    <div>
      <Meta title="Search" />

      <Breadcrumb
        segments={[
          { title: 'Home', href: '/' },
          { title: 'Catalog', href: '/catalog' },
          { title: 'Search' }
        ]}
      />

      <form
        className="w-75 mx-auto my-5"
        onSubmit={(e) => {
          e.preventDefault();

          // Update query and reset page
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
        <DataLoader
          getData={() => api.catalog.searchFlicks(query, pageNumber)}
          deps={[query, pageNumber]}
          render={(flicks) => (
            <>
              {flicks.items.length > 0 && (
                <FlickTable flicks={flicks.items} startingPosition={1 + (pageNumber - 1) * 10} />
              )}
              {flicks.items.length > 0 && (
                <Paginator
                  currentPage={pageNumber}
                  lastPage={flicks.totalPages}
                  getPageHref={(p) => `?query=${query}&page=${p}`}
                />
              )}

              {flicks.items.length <= 0 && (
                <p className="display-4 text-center">Nothing found :(</p>
              )}

              <p className="mt-5 lead text-center">
                Didn&apos;t find what you were looking for? You can{' '}
                <Link href="/catalog/flicks/request">request</Link> a new flick to be added.
              </p>
            </>
          )}
        />
      )}
    </div>
  );
}
