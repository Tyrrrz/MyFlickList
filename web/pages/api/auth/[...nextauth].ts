import type { User } from 'mfl-data/user';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { getGitHubCredentials } from '~/utils/env';

export type Session = {
  expires: string;
  user: User;
};

export default NextAuth({
  providers: [GitHubProvider(getGitHubCredentials())],
  callbacks: {
    signIn: ({ user }) => {
      // TODO: save the user's name and email to the database
      // when signing in for the first time.
      console.log(user);

      return true;
    },
    jwt: ({ token }) => {
      // Add domain-specific information to the token
      token.id = 42;

      return token;
    },
    session: ({ session, token }) => {
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
          // Add domain-specific data to the user
          id: token.id,
          name: token.name,
          email: token.email
        }
      } satisfies Session;
    }
  }
});
