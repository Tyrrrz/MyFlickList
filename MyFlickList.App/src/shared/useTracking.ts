import { useEffect, useState } from 'react';
import GoogleAnalytics from 'react-ga';
import { useLocation } from 'react-router';
import config from '../infra/config';

const token = config.secrets.googleAnalyticsToken;

export default function useTracking() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { pathname, search } = useLocation();

  // Initialize GA
  useEffect(() => {
    if (!isInitialized && token) {
      GoogleAnalytics.initialize(token, {
        gaOptions: {
          sampleRate: 100
        }
      });

      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Track navigation
  useEffect(() => {
    if (isInitialized && token) {
      GoogleAnalytics.pageview(pathname + search);
    }
  }, [isInitialized, pathname, search]);
}
