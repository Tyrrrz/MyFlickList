import React, { useState, useEffect } from 'react';
import env from './env';
import api from './api';

export default function App() {
  const [catalog, setCatalog] = useState<any>(null);

  useEffect(() => {
    api
      .getCatalog()
      .then(setCatalog)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div>
      {catalog &&
        catalog.map((e: any) => (
          <div>
            <div>{e.title}</div>
            <div>
              <img src={env.getRelativeApiUrl(`catalog/images/${e.imageId}`)} />
            </div>
          </div>
        ))}
    </div>
  );
}
