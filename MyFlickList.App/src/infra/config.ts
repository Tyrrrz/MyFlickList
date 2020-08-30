const apiUrl = process.env['REACT_APP_API_URL'] || 'http://localhost:5000';
const appUrl = process.env['URL'] || process.env['PUBLIC_URL'] || 'http://localhost:3000';

const secrets = {
  googleAnalyticsToken: process.env['REACT_APP_GOOGLE_ANALYTICS']
};

export default {
  apiUrl,
  appUrl,
  secrets
};
