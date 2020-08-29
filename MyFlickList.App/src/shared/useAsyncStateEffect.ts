import React, { useEffect, useState } from 'react';

export default function useAsyncStateEffect<T>(
  resolve: () => Promise<T>,
  deps: React.DependencyList,
  condition = true
) {
  const [state, setState] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (condition) {
      resolve().then(setState, setError);
    }
  }, [...deps, condition]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [state, error] as const;
}
