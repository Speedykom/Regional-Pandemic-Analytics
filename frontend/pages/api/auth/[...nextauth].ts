import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider, {
  KeycloakProfile,
} from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";
// import type { User, Account, Session, Awaitable } from 'next-auth/core/types'
import { post } from "@/libs/api/base";
import { OAuthConfig } from "next-auth/providers/oauth";
import type { Session, User } from "next-auth/core/types";

declare module "next-auth/jwt" {
  interface JWT {
    id_token?: string;
    provider?: string;
  }
}

declare module "next-auth/core/types" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOACK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOACK_CLIENT_SECRET || "",
      authorization: process.env.KEYCLOACK_AUTHORIZATION,
      issuer: process.env.KEYCLOACK_ISSUER,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.id_token = account?.id_token;
        token.accessToken = account?.accessToken;
        token.provider = account.provider;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      session.accessToken = String(token.accessToken);
      return session;
    },
  },
  events: {
    async signOut({ token, session }: { token: JWT; session: Session }) {
      if (token.provider === "keycloak") {
        const issuerUrl = (
          authOptions.providers.find(
            (p) => p.id === "keycloak"
          ) as OAuthConfig<KeycloakProfile>
        ).options!.issuer!;
        const logOutUrl = new URL(
          `${issuerUrl}/protocol/openid-connect/logout`
        );
        logOutUrl.searchParams.set("id_token_hint", token.id_token!);
        await fetch(logOutUrl);

        const url = "/auth/user/logout";
        if (session?.user?.name) {
          post({
            url: url,
            body: { name: session.user?.name },
          }).then(
            (_) => console.log("Logout success"),
            (r) => console.log("Logout fail: ", r)
          );
        } else if (token.name) {
          post({
            url: url,
            body: { name: token.name },
          }).then(
            (_) => console.log("Logout success"),
            (r) => console.log("Logout fail: ", r)
          );
        }
      }
    },
  },
};

export default NextAuth(authOptions);
