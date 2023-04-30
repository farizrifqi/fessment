import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs"
import { HarperDBAdapter } from "@/lib/adapters/harperdb";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0"
    }),
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
}
export default NextAuth(authOptions)

