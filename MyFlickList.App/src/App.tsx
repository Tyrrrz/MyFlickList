import { ErrorBoundary, init as initSentry } from '@sentry/react';
import classnames from 'classnames';
import React, { StrictMode, Suspense, useEffect, useMemo, useState } from 'react';
import { initialize as initGoogleAnalytics, pageview as trackPageView } from 'react-ga';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useHistory, useLocation } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Alert from './components/Alert';
import LocalStorageProvider from './context/LocalStorageProvider';
import Footer from './Footer';
import Header from './Header';
import config from './internal/config';
import { normalizeError } from './internal/errorHelpers';
import Routing from './Routing';
import './tailwind.generated.css';

// Init Google Analytics
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

function ContentErrorFallback({ error, reset }: { error: unknown; reset: () => void }) {
  const history = useHistory();

  useEffect(() => {
    // Reset error when navigating away
    return history.listen(() => reset());
  }, [history, reset]);

  const normalizedError = useMemo(() => normalizeError(error), [error]);

  return <Alert type="error" title={normalizedError.title} message={normalizedError.details} />;
}

function ContentBusyFallback() {
  const [isVisible, setIsVisible] = useState(false);

  // Add a delay before showing the indicator to prevent flickering
  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), 200);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div className="p-12 text-center">
      <AiOutlineLoading3Quarters className="mx-auto animate-spin text-6xl text-blue-600" />
    </div>
  );
}

function Content() {
  return (
    <main>
      <ErrorBoundary
        fallback={({ error, resetError }) => (
          <ContentErrorFallback error={error} reset={resetError} />
        )}
      >
        <Suspense fallback={<ContentBusyFallback />}>
          <Routing />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

function Layout() {
  const location = useLocation();

  // Track navigation
  useEffect(() => {
    if (config.googleAnalyticsToken) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return (
    <div
      className={classnames(['flex', 'flex-col', 'min-h-screen', 'mx-auto'])}
      style={{ backgroundColor: '#fafafa' }}
    >
      <div className={classnames(['py-3', 'bg-white', 'border', 'border-b-1'])}>
        <div style={{ width: '100%', maxWidth: '1024px', margin: 'auto' }}>
          <Header />
        </div>
      </div>

      <div
        className={classnames(['flex-grow', 'py-5'])}
        style={{ width: '100%', maxWidth: '1024px', margin: 'auto' }}
      >
        <Content />
      </div>

      <div style={{ width: '100%', maxWidth: '1024px', margin: 'auto' }}>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <LocalStorageProvider>
          <Layout />
        </LocalStorageProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
