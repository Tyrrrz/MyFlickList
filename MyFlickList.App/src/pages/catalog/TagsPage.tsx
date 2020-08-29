import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';

export default function TagsPage() {
  return (
    <DataLoader
      getData={() => api.catalog.getTags()}
      render={(tags) => (
        <div>
          <Meta title="Tags" />

          <Breadcrumb
            segments={[
              { title: 'Home', href: '/' },
              { title: 'Catalog', href: '/catalog' },
              { title: 'Tags' }
            ]}
          />

          {tags.map((tag) => (
            <Link
              key={tag}
              className="badge badge-pill badge-secondary m-1"
              href={'/catalog/tags/' + encodeURIComponent(tag)}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    />
  );
}
