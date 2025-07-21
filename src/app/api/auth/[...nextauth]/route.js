import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { log_in_user } from '../../../../lib/sessions';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await log_in_user(
          credentials.login,
          credentials.password
        );
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.admin = user.admin;
        token.sleeping = user.sleeping;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.login = token.login;
      session.user.admin = token.admin;
      session.user.sleeping = token.sleeping;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
