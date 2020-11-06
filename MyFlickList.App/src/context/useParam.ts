import { useLocation, useParams as useRawRouteParams } from 'react-router';

function useRouteParams() {
  const rawParams = useRawRouteParams();

  const params: Record<string, string | undefined> = Object.fromEntries(
    Object.entries(rawParams)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, decodeURIComponent(value as string)] as const)
  );

  return params;
}

function useQueryParams() {
  const location = useLocation();
  const params: Record<string, string | undefined> = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );

  return params;
}

interface UseParamOptions<T> {
  transform?: (value: string | undefined) => T;
}

export default function useParam(name: string): string | undefined;
export default function useParam<T>(name: string, options: UseParamOptions<T>): T;

export default function useParam<T>(name: string, options?: UseParamOptions<T>) {
  const routeParams = useRouteParams();
  const queryParams = useQueryParams();

  const params = {
    ...queryParams,
    ...routeParams
  };

  const param = params[name];

  if (options?.transform) {
    return options.transform(param);
  }

  return param;
}
