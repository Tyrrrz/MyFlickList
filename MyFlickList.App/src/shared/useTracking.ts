import { useEffect } from 'react';
import GoogleAnalytics from 'react-ga';
import { useLocation } from 'react-router';

export default function useTracking() {
  const { pathname, search } = useLocation();

  // Track navigation
  useEffect(() => {
    GoogleAnalytics.pageview(pathname + search);
  }, [pathname, search]);
}
