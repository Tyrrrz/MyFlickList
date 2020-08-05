import { useEffect } from 'react';
import GoogleAnalytics from 'react-ga';
import { useLocation } from 'react-router';
import config from '../infra/config';

export default function useTracking() {
  const token = config.secrets.googleAnalyticsToken;
  const location = useLocation();

  useEffect(() => {
    if (token) {
      GoogleAnalytics.initialize(token, {
        gaOptions: {
          sampleRate: 100
        }
      });

      GoogleAnalytics.pageview(location.pathname + location.search);
    }
  }, [token, location]);
}
