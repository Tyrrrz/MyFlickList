import { useParams } from 'react-router';

export default function useRouteParams() {
  const params = useParams();

  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, decodeURIComponent(value as string)] as const)
  );
}
