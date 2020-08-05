import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import ErrorHandler from '../../shared/ErrorHandler';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Meta from '../../shared/Meta';

function parseUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function parseImdbId(url: string) {
  if (!url) return null;

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
  if (!match) return null;

  return match[1];
}

export default function FlickRequest() {
  const history = useHistory();

  const [busy, setBusy] = useState(false);
  const [imdbUrl, setImdbUrl] = useState('');
  const [error, setError] = useState<unknown>();

  const sendRequest = useCallback(() => {
    const imdbId = parseImdbId(imdbUrl);
    if (!imdbId) {
      setError('Provided link appears invalid');
    } else {
      setBusy(true);

      const redirect = () => history.push(`/catalog/flicks/${imdbId}`);

      api.catalog
        .requestFlick(imdbId)
        .then(() => redirect())
        .catch((e) => {
          // 409 means it already exists, which is ok
          if (e.status === 409) {
            redirect();
          } else {
            setError(e);
          }
        })
        .finally(() => setBusy(false));
    }
  }, [imdbUrl, history]);

  return (
    <div>
      <Meta title="Request Flick" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: 'Request' }]} />

      <p>
        If a movie or a series you&apos;re looking for is not available, you can request it to be added using this form. To do that, simply
        copy-paste the corresponding IMDB link. All of the data will be pulled automatically.
      </p>

      <form className="mt-4">
        <div className="form-group">
          <label htmlFor="imdbId">IMDB link</label>
          <input className="form-control" type="url" id="imdbId" disabled={busy} onChange={(e) => setImdbUrl(e.target.value)} />
        </div>

        <ErrorHandler error={error} />

        {!busy && (
          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
            onClick={(e) => {
              e.preventDefault();
              sendRequest();
            }}
          >
            Submit
          </button>
        )}

        {busy && <LoadingSpinner />}
      </form>
    </div>
  );
}
