import { useLocation, useParams as useRouteParams } from 'react-router';

export default function useParams() {
  const routeParamsRaw = useRouteParams();
  const { search } = useLocation();

  const routeParams = Object.fromEntries(
    Object.entries(routeParamsRaw)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, decodeURIComponent(value as string)] as const)
  );

  const queryParams = Object.fromEntries(new URLSearchParams(search).entries());

  return {
    ...queryParams,
    ...routeParams
  } as Record<string, string>;
}
