import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Meta from '../../shared/Meta';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Breadcrumb from '../../shared/Breadcrumb';
import api from '../../infra/api';

function parseImdbId(url: string) {
  // Check if already is a parsed ID
  if (/$\w\w\d+^/i.test(url)) {
    return url;
  }

  const match = /(?:$|\/)title\/(\w\w\d+)(?:^|\/)/i.exec(url);
  if (!match) return null;

  return match[1];
}

export default function FlickRequest() {
  const history = useHistory();

  const [busy, setBusy] = useState(false);
  const [imdbUrl, setImdbUrl] = useState('');

  const imdbId = parseImdbId(imdbUrl);

  return (
    <div>
      <Meta title="Request" />

      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: 'Request' }]} />

      <p>
        If a movie or a series you&apos;re looking for is not available, you can request it to be added using this form. To do that, simply
        copy-paste the corresponding IMDB link. All of the data will be pulled automatically.
      </p>

      <form className="mt-4">
        <div className="form-group">
          <label htmlFor="imdbId">IMDB link</label>
          <input className="form-control" type="email" id="imdbId" disabled={busy} onChange={(e) => setImdbUrl(e.target.value)} />
          {imdbUrl && !imdbId && <small className="text-danger">Provided link appears invalid</small>}
        </div>
        {!busy ? (
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!imdbId || busy}
            onClick={() => {
              setBusy(true);
              api.catalog
                .requestFlick(imdbId)
                .then(() => history.push(`/catalog/flicks/${imdbId}`))
                .finally(() => setBusy(false));
            }}
          >
            Submit
          </button>
        ) : (
          <LoadingSpinner />
        )}
      </form>
    </div>
  );
}
