import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0"
    })
  ],
  adapter: MongoDBAdapter(clientPromise, { databaseName: "menfess" }),
  callbacks: {
    async signIn({ account }) {
      try {
        const client = await clientPromise;
        const db = client.db("menfess");
        const acc = await db
          .collection("accounts")
          .find({ "providerAccountId": account.providerAccountId })
          .toArray();
        console.log(acc.length, JSON.parse(JSON.stringify(acc)).length, acc)
        return account
      } catch (error) {
        return false
      }
    }
  }
}
export default NextAuth(authOptions)

