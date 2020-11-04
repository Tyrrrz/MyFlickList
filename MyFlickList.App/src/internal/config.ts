export default {
  apiUrl: process.env['REACT_APP_API_URL'] || 'http://localhost:5000',
  appUrl: process.env['PUBLIC_URL'] || 'http://localhost:3000',
  googleAnalyticsToken: process.env['REACT_APP_GOOGLE_ANALYTICS'],
  sentryToken: process.env['REACT_APP_SENTRY']
};
