import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { addUser, User } from '~/pages/api/user';
import { getGitHubCredentials } from '~/utils/env';

export type Session = {
  expires: string;
  user: User;
};

export default NextAuth({
  providers: [GitHubProvider(getGitHubCredentials())],
  callbacks: {
    jwt: async ({ profile, token }) => {
      if (profile) {
        if (!profile.name || typeof profile.name !== 'string') {
          throw new Error(`Missing or invalid 'profile.name'`);
        }

        if (!profile.email || typeof profile.email !== 'string') {
          throw new Error(`Missing or invalid 'profile.email'`);
        }

        // Add the user to the database, if they don't already exist
        const user = await addUser({
          name: profile.name,
          email: profile.email
        });

        // Inject domain-specific information into the token
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    session: ({ token, session }) => {
      if (!token.id || typeof token.id !== 'number') {
        throw new Error(`Missing or invalid 'token.id'`);
      }

      if (!token.name || typeof token.name !== 'string') {
        throw new Error(`Missing or invalid 'token.name'`);
      }

      if (!token.email || typeof token.email !== 'string') {
        throw new Error(`Missing or invalid 'token.email'`);
      }

      return {
        ...session,
        user: {
          // Inject domain-specific data into the session
          id: token.id,
          name: token.name,
          email: token.email
        }
      } satisfies Session;
    }
  }
});
