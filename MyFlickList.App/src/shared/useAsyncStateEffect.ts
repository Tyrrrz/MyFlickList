import React, { useState, useEffect } from 'react';

export default function useAsyncStateEffect<T>(resolve: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    resolve().then(setState, setError);
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [state, error] as const;
}
