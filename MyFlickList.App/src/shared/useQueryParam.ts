import { useLocation } from 'react-router';

export default function useQueryParam(name: string) {
  const location = useLocation();
  const value = new URLSearchParams(location.search).get(name);

  return value;
}
