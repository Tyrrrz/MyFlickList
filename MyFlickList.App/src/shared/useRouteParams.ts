import { useParams } from 'react-router';

export default function useRouteParams() {
  const params = useParams();

  const result = {} as Record<string, string>;

  for (const entry of Object.entries(params)) {
    const [key, value] = entry;

    if (typeof value !== 'string') continue;

    result[key] = decodeURIComponent(value);
  }

  return result;
}
