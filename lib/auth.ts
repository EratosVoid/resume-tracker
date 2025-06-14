import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./database";
import User from "./models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+password");

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if user has a password (applicants might not have one initially)
        if (!user.password) {
          throw new Error(
            "Account exists but no password set. Please contact support."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: (user as any)._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.company = token.company as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    // register: "/auth/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
