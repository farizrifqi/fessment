import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import { HarperDBAdapter } from "@/lib/adapters/harperdb";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        email: {
          label: "Name",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let getUser = await HarperDBAdapter().getUserByEmail(credentials.email)
        if (!getUser) throw new Error('No user found with the email');
        const checkPass = await bcrypt.compare(credentials.password, getUser.password)
        if (!checkPass) throw new Error('Password doesnt match');
        return getUser;
      }
    }),

  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.email = user.email;
        token.user_type = user.userType;
      }

      return token;
    },
    session: ({ session, token, user }) => {
      if (token) {
        session.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions)

