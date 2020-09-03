import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { SearchResponse } from '../../infra/api.generated';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useQueryParams from '../../shared/useQueryParams';
import { routes } from '../PageRouter';
import FlickTable from './shared/FlickTable';

function SearchResults({ results }: { results: SearchResponse }) {
  const isNothingFound = !results.flicks || results.flicks.length <= 0;

  return (
    <div>
      {results.flicks && results.flicks.length > 0 && (
        <FlickTable flicks={results.flicks} startingPosition={1} />
      )}

      {isNothingFound && <p className="display-4 text-center">Nothing found :(</p>}

      <p className="mt-5 lead text-center">
        Didn&apos;t find what you were looking for? You can{' '}
        <Link href={routes.flickAdd()}>request</Link> a new flick to be added.
      </p>
    </div>
  );
}

export default function SearchFlicksPage() {
  const history = useHistory();

  const { query } = useQueryParams();

  const [stagingQuery, setStagingQuery] = useState(query ?? '');

  return (
    <div>
      <Meta title="Search" />

      <Breadcrumb segments={[{ title: 'Home', href: routes.home() }, { title: 'Search' }]} />

      <form
        className="w-75 mx-auto my-5"
        onSubmit={(e) => {
          e.preventDefault();
          history.push(routes.search({ query: stagingQuery }));
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
          getData={() => api.search.getResults(query)}
          deps={[query]}
          render={(results) => <SearchResults results={results} />}
        />
      )}
    </div>
  );
}
