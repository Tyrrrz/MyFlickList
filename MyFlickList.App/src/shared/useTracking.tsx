import { useEffect } from 'react';
import GoogleAnalytics from 'react-ga';
import config from '../infra/config';
import { useLocation } from 'react-router';

const token = config.secrets.googleAnalyticsToken;

if (token) {
  GoogleAnalytics.initialize(token, {
    gaOptions: {
      sampleRate: 100
    }
  });
}

export default function useTracking() {
  const location = useLocation();

  useEffect(() => {
    GoogleAnalytics.pageview(location.pathname + location.search);
  }, [location]);
}
