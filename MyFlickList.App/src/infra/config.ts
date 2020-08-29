const apiUrl = new URL(process.env.REACT_APP_API_URL || 'http://localhost:5000').toString();
const appUrl = new URL(process.env.PUBLIC_URL || 'http://localhost:3000').toString();

const secrets = {
  googleAnalyticsToken: process.env.REACT_APP_GOOGLE_ANALYTICS
};

export default {
  apiUrl,
  appUrl,

  secrets
};
