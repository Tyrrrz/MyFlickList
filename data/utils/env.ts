export const getDatabaseUrl = () => {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error(`Environment variable 'DATABASE_URL' is not defined`);
  }

  return value;
};
