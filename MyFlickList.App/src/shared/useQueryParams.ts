import { useLocation } from 'react-router';

interface Dictionary {
  [key: string]: string;
}

export default function useQueryParams() {
  const location = useLocation();

  const result = {} as Dictionary;

  const parsedSearch = new URLSearchParams(location.search);
  for (const entry of parsedSearch.entries()) {
    const [key, value] = entry;
    result[key] = value;
  }

  return result;
}
