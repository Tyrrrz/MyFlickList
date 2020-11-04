import { useQuery as useReactQuery } from 'react-query';

// This is a simplified version of react-query hook with implicit support for suspense
export default function useQuery<T>(resolve: () => Promise<T>, cacheKey: unknown[]) {
  const result = useReactQuery(cacheKey, resolve, {
    suspense: true,
    useErrorBoundary: true,
    retry: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false
  });

  // When using suspense, react-query never returns undefined data
  return result.data as T;
}
