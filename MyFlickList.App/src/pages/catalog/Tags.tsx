import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import StateLoader from '../../shared/StateLoader';
import useAsyncStateEffect from '../../shared/useAsyncStateEffect';

export default function Tags() {
  const [tags, tagsError] = useAsyncStateEffect(() => api.catalog.getTags(), []);

  return (
    <div>
      <Meta title="Tags" />
      <Breadcrumb segments={[{ title: 'Home', href: '/' }, { title: 'Catalog', href: '/catalog' }, { title: 'Tags' }]} />

      <StateLoader
        state={tags}
        error={tagsError}
        render={(ts) => (
          <>
            {ts.map((t) => (
              <Link key={t} className="badge badge-pill badge-secondary m-1" href={`/catalog/tags/${encodeURIComponent(t)}`}>
                {t}
              </Link>
            ))}
          </>
        )}
      />
    </div>
  );
}
