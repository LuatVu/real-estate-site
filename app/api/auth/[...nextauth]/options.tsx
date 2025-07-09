import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email", type: "text"
                },
                phoneNumber: {
                    label: "phoneNumber", type: "text"
                },
                password: {
                    label: "password", type: "password"
                }
            },
            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/sign-in`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: credentials?.email, phoneNumber: credentials?.phoneNumber, password: credentials?.password })
                })
                const data = await res.json();
                if (res.ok && data) {
                    return data.response;
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {

            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    }
} 