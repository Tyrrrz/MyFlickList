import { ErrorBoundary, init as initSentry } from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { initialize as initGoogleAnalytics } from 'react-ga';
import App from './App';
import config from './infra/config';

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

// Init React
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
