import { DependencyList } from 'react';
import { useQuery as useReactQuery } from 'react-query';
import { useLocation } from 'react-router';

// This is a simplified version of react-query hook with implicit support for suspense
export default function useQuery<T>(resolve: () => Promise<T>, deps: DependencyList) {
  // Use URL as cache key
  const { pathname, search } = useLocation();
  const cacheKey = [pathname, search, ...deps];

  const { data } = useReactQuery(cacheKey, resolve, {
    suspense: true,
    useErrorBoundary: true,
    retry: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    staleTime: 2000,
    cacheTime: 2000
  });

  // When using suspense, react-query never returns undefined data
  return data as T;
}
