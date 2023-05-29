import db from '~/utils/db';

export const config = { rpc: true };

export type UserData = {
  name: string;
  email: string;
};

export type User = UserData & {
  id: number;
};

const ensureTable = async () => {
  return await db(async (client) => {
    await client.query(
      `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(50) NOT NULL UNIQUE
      )
      `
    );
  });
};

export const addUser = async (user: UserData) => {
  await ensureTable();

  return await db(async (client) => {
    await client.query(
      `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      ON CONFLICT
      DO NOTHING
      `,
      [user.name, user.email]
    );

    const result = await client.query<User>(
      `
      SELECT *
      FROM users
      WHERE name = $1 AND email = $2
      `,
      [user.name, user.email]
    );

    const actualUser = result.rows[0];
    if (!actualUser) {
      throw new Error('Expected query to yield a result');
    }

    return actualUser;
  });
};

export const updateUser = async (user: User) => {
  await ensureTable();

  return await db(async (client) => {
    await client.query(
      `
      INSERT INTO users (id, name, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET name = $2, email = $3
      `,
      [user.id, user.name, user.email]
    );
  });
};
