import NextAuth from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import type { JWT } from 'next-auth/jwt'
import type { User, Account, Session, Awaitable } from 'next-auth/core/types'
import {authorizedRequest, post} from '@/libs/api/base'

interface JWTData {
    token: JWT
    user?: User
    account?: Account
}

interface SessionData {
    session: Session
    token: JWT
    user?: User
}

interface LogoutMessage {
    session: Session,
    token: JWT,
}

export default NextAuth({
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOACK_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOACK_CLIENT_SECRET || "",
            authorization: process.env.KEYCLOACK_AUTHORIZATION,
            issuer: process.env.KEYCLOACK_ISSUER
        }),
    ],
    callbacks: {
        jwt: (data: JWTData): Awaitable<JWT> => {
            if(data.user) {
                const url = '/auth/user/login'
                authorizedRequest(data.account?.access_token, {url}, post)
            } else {
                console.log("No user data present. Behavior will be undefined.")
            }
            return data.token
        },
        session: (data: SessionData): Awaitable<Session> => {
            return data.session
        },
    },
    events: {
        signOut: (message: LogoutMessage): Awaitable<void> => {
            const url = '/auth/user/logout'
            if (message.session?.user?.name) {
                post({
                    url: url,
                    body: {name: message.session.user?.name},
                })
                    .then(_ => console.log("Logout success"), r => console.log("Logout fail: ", r))
            } else if(message.token.name) {
                post({
                    url: url,
                    body: {name: message.token.name},
                })
                    .then(_ => console.log("Logout success"), r => console.log("Logout fail: ", r))
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    // debug: true
})
