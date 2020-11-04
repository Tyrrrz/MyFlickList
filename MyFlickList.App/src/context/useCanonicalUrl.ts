import { useEffect } from 'react';
import { useHistory } from 'react-router';

export default function useCanonicalUrl(path: string) {
  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname + history.location.search !== path) {
      history.replace(path);
    }
  }, [path, history]);
}
