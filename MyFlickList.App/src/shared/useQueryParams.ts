import { useLocation } from 'react-router';

export default function useQueryParams() {
  const location = useLocation();

  const result = {} as Record<string, string>;

  const parsedSearch = new URLSearchParams(location.search);
  for (const entry of parsedSearch.entries()) {
    const [key, value] = entry;
    result[key] = value;
  }

  return result;
}
