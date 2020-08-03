import React, { useState, useEffect } from 'react';

export default function useAsyncStateEffect<T>(resolve: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<T | undefined>(undefined);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    resolve().then(setState);
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps */

  return state;
}
