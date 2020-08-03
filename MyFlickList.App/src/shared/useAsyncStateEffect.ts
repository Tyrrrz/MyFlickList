import React, { useState, useEffect, useCallback } from 'react';

export default function useAsyncStateEffect<T>(resolve: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<T | undefined>(undefined);
  const resolveCallback = useCallback(resolve, [resolve]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    resolveCallback().then(setState);
  }, [...deps, resolveCallback]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return state;
}
