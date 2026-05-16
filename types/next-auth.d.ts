import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "MERCHANT" | "CONSUMER";
      id: string;
    } & DefaultSession["user"];
  }
}
