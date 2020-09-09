import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { routes } from '../../Routing';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import useParams from '../../shared/useParams';
import useQuery from '../../shared/useQuery';
import FlickTable from '../flicks/shared/FlickTable';

function SearchResultsSection({ query }: { query: string }) {
  const results = useQuery(() => api.search().getResults(query), [query]);

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

export default function SearchPage() {
  const history = useHistory();
  const { query } = useParams();
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

      {query && <SearchResultsSection query={query} />}
    </div>
  );
}
