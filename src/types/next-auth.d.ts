import NextAuth from "next-auth"
import type { Adapter, AdapterAccount, AdapterUser, AdapterSession, VerificationToken } from "next-auth/adapters";

declare module "next-auth/adapters" {
  // interface AdapterSession {
  //   accessToken: string
  // }
}