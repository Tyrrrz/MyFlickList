import { ErrorBoundary, init as initSentry } from '@sentry/react';
import React from 'react';
import { initialize as initGoogleAnalytics } from 'react-ga';
import { BrowserRouter } from 'react-router-dom';
import config from './infra/config';
import Layout from './Layout';
import LocalStorageProvider from './shared/LocalStorageProvider';
import './tailwind.generated.css';

// Init google analytics
if (config.googleAnalyticsToken) {
  initGoogleAnalytics(config.googleAnalyticsToken, {
    gaOptions: {
      sampleRate: 100
    }
  });
}

// Init Sentry
if (config.sentryToken) {
  initSentry({
    dsn: config.sentryToken
  });
}

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <LocalStorageProvider>
            <Layout />
          </LocalStorageProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
