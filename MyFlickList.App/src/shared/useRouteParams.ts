import { useParams } from 'react-router';

interface Dictionary {
  [key: string]: string;
}

export default function useRouteParams() {
  const params = useParams();

  const result = {} as Dictionary;

  for (const entry of Object.entries(params)) {
    const [key, value] = entry;

    if (typeof value !== 'string') continue;

    result[key] = decodeURIComponent(value);
  }

  return result;
}
