import React, { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import ErrorHandler from '../../shared/ErrorHandler';
import Link from '../../shared/Link';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Meta from '../../shared/Meta';
import { routes } from '../PageRouter';

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function parseImdbId(url: string) {
  if (!url) {
    return null;
  }

  // Check if already is a parsed ID
  if (/^\w\w\d+$/i.test(url)) {
    return url;
  }

  // Ensure that the link comes from IMDB
  const urlParsed = parseUrl(url);
  if (!urlParsed || !/(?:^|\.)imdb\.com$/i.test(urlParsed.hostname)) {
    return null;
  }

  // Get the ID
  const match = /(?:^|\/)title\/(\w\w\d+)(?:$|\/)/i.exec(urlParsed.pathname);
  if (!match) {
    return null;
  }

  return match[1];
}

interface FormData {
  imdbUrl: string;
}

function submitForm(formData: FormData) {
  const parsedImdbId = parseImdbId(formData.imdbUrl);

  if (!parseImdbId) {
    return Promise.reject('Provided IMDB link appears invalid');
  }

  return api.catalog.requestFlick(parsedImdbId);
}

export default function RequestFlickPage() {
  const history = useHistory();

  const [busy, setBusy] = useState(false);
  const [imdbUrl, setImdbUrl] = useState('');
  const [error, setError] = useState<unknown>();

  return (
    <div>
      <Meta title="Request Flick" />

      <Breadcrumb
        segments={[
          { title: 'Home', href: routes.home() },
          { title: 'Catalog', href: routes.catalog() },
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

          setBusy(true);

          submitForm({ imdbUrl })
            .then((res) => history.push(routes.catalogFlick(res.flickId)))
            .catch(setError)
            .finally(() => setBusy(false));
        }}
      >
        <div className="form-group">
          <label htmlFor="imdbUrl">IMDB link</label>
          <input
            className="form-control"
            type="url"
            id="imdbUrl"
            disabled={busy}
            value={imdbUrl}
            onChange={(e) => setImdbUrl(e.target.value)}
          />
        </div>

        <ErrorHandler error={error} />

        {!busy && (
          <button className="btn btn-primary" type="submit" disabled={busy}>
            Submit
          </button>
        )}

        {busy && <LoadingSpinner />}
      </form>
    </div>
  );
}
