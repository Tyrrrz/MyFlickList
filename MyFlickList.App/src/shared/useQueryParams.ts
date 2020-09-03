import { useLocation } from 'react-router';

export default function useQueryParams() {
  const { search } = useLocation();

  return Object.fromEntries(new URLSearchParams(search).entries());
}
