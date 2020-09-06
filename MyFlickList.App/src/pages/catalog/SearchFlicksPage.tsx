import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { SearchResponse } from '../../infra/api.generated';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useQueryParams from '../../shared/useQueryParams';
import { routes } from '../Routing';
import FlickTable from './shared/FlickTable';

function SearchResults({ results }: { results: SearchResponse }) {
  const isNothingFound = !results.flicks || results.flicks.length <= 0;

  return (
    <div>
      {results.flicks && results.flicks.length > 0 && (
        <FlickTable flicks={results.flicks} startingPosition={1} />
      )}

      {isNothingFound && <p className="text-3xl text-center">Nothing found :(</p>}

      <p className="mt-3 text-center">
        Didn&apos;t find what you were looking for? You can{' '}
        <Link href={routes.flickAdd.href()}>request</Link> a new flick to be added.
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

      <h1>Search</h1>

      <form
        className="w-9/12 mx-auto my-5 flex flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          history.push(routes.search.href({ query: stagingQuery }));
        }}
      >
        <input
          className="flex-grow"
          type="search"
          autoFocus
          value={stagingQuery}
          onChange={(e) => setStagingQuery(e.target.value)}
        />

        <button className="ml-2" type="submit">
          Search
        </button>
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
