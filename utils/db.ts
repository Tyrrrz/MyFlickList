import { Pool, PoolClient } from 'pg';
import { getDatabaseUrl } from '~/utils/env';

const pool = new Pool({
  connectionString: getDatabaseUrl()
});

const db = async <T>(fn: (client: PoolClient) => T | Promise<T>) => {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
};

export default db;
