import React, { useState, useEffect } from 'react';
import api from './infra/api';
import { FlickEntity } from './infra/api.generated';

export default function App() {
  const [catalog, setCatalog] = useState<FlickEntity[]>([]);

  useEffect(() => {
    api.catalog
      .getAll()
      .then(setCatalog)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div>
      {catalog &&
        catalog.map((f) => (
          <div key={f.id}>
            <div>{f.title}</div>
            <div>
              <img alt={f.title} src={api.utils.getImageUrl(f.imageId!)} />
            </div>
          </div>
        ))}
    </div>
  );
}
