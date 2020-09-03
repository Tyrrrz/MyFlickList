import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import { AddFlickRequest } from '../../infra/api.generated';
import Breadcrumb from '../../shared/Breadcrumb';
import ErrorHandler from '../../shared/ErrorHandler';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Meta from '../../shared/Meta';
import { routes } from '../PageRouter';

export default function RequestFlickPage() {
  const history = useHistory();

  const [isBusy, setIsBusy] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Request Flick" />

      <Breadcrumb
        segments={[
          { title: 'Home', href: routes.home() },
          { title: 'Flicks', href: routes.flicks() },
          { title: 'Request' }
        ]}
      />

      <p>
        If a movie or a series you&apos;re looking for is not available, you can request it to be
        added using this form. To do that, simply copy-paste the corresponding{' '}
        <Link href="https://imdb.com" target="_blank">
          IMDB
        </Link>{' '}
        link. All of the data will be pulled automatically.
      </p>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();

          setIsBusy(true);

          api.flicks
            .addFlick(new AddFlickRequest({ sourceUrl }))
            .then((res) => history.push(routes.flick(res.flickId)))
            .catch(setError)
            .finally(() => setIsBusy(false));
        }}
      >
        <div className="form-group">
          <label htmlFor="sourceUrl">IMDB link</label>
          <input
            className="form-control"
            type="url"
            id="sourceUrl"
            disabled={isBusy}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </div>

        <ErrorHandler error={error} />

        {!isBusy && (
          <button className="btn btn-primary" type="submit" disabled={isBusy}>
            Submit
          </button>
        )}

        {isBusy && <LoadingSpinner />}
      </form>
    </div>
  );
}
