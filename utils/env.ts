export const getEnvironment = () => {
  return process.env.NODE_ENV;
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};

export const getBuildId = () => {
  const value = process.env.BUILD_ID;
  if (!value) {
    throw new Error(`Environment variable 'BUILD_ID' is not defined`);
  }

  return value;
};

export const getSiteUrl = (path?: string) => {
  const value = process.env.SITE_URL;
  if (!value) {
    throw new Error(`Environment variable 'SITE_URL' is not defined`);
  }

  if (path) {
    return new URL(path, value).toString();
  }

  return value;
};

export const getDatabaseUrl = () => {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error(`Environment variable 'DATABASE_URL' is not defined`);
  }

  return value;
};

export const getGitHubCredentials = () => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error(`Environment variable 'GITHUB_CLIENT_ID' is not defined`);
  }

  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error(`Environment variable 'GITHUB_CLIENT_SECRET' is not defined`);
  }

  return {
    clientId,
    clientSecret
  };
};

export const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(`Environment variable 'GOOGLE_CLIENT_ID' is not defined`);
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error(`Environment variable 'GOOGLE_CLIENT_SECRET' is not defined`);
  }

  return {
    clientId,
    clientSecret
  };
};
