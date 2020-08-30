import React from 'react';
import api from '../../infra/api';
import Breadcrumb from '../../shared/Breadcrumb';
import DataLoader from '../../shared/DataLoader';
import Link from '../../shared/Link';
import Meta from '../../shared/Meta';
import { routes } from '../PageRouter';

export default function TagsPage() {
  return (
    <DataLoader
      getData={() => api.catalog.getTags()}
      render={(tags) => (
        <div>
          <Meta title="Tags" />

          <Breadcrumb
            segments={[
              { title: 'Home', href: routes.home() },
              { title: 'Catalog', href: routes.catalog() },
              { title: 'Tags' }
            ]}
          />

          {tags.map((tag) => (
            <Link
              key={tag}
              className="badge badge-pill badge-secondary m-1"
              href={routes.catalogTaggedFlicks(tag)}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    />
  );
}
