import React, { useState, useEffect, useCallback } from 'react';

export default function useAsyncStateEffect<T>(resolve: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<T | undefined>(undefined);
  const resolveCallback = useCallback(resolve, []);

  useEffect(() => {
    resolveCallback().then(setState);
  }, [...deps, resolveCallback]);

  return state;
}
