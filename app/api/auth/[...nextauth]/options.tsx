import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
    secret: process.env.AUTH_SECRET,
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
            async authorize(credentials, req) {
                const res = await fetch(`${process.env.SPRING_API}/api/auth/sign-in`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: credentials?.email, phoneNumber: credentials?.phoneNumber, password: credentials?.password })
                })
                const data = await res.json();
                console.log(data);
                if (res.ok && data) {
                    const user = data.response;
                    return {
                        id: user.id,
                        username: user.username,
                        token: user.token,
                        email: user.email,
                        permissions: user.permissions
                    }
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account?.access_token;
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token, user}) {         
             if(token){
                session.user = {
                    ...session.user,
                    name: token.name
                }                
             }
            return session;
        },
        async redirect({ url, baseUrl }) {            
            if (url.startsWith("/")) return `${baseUrl}${url}`           
            else if (new URL(url).origin === baseUrl) return url
            return url
        }
    },
    pages: {
        // signIn: '/sign-in'
    }
} 