import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            accessToken: string;
            tokenType: string;
            permissions: string[];
        }
    }
    
    interface User {
        id: string;
        username: string;
        email: string;
        accessToken: string;
        tokenType: string;
        permissions: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        accessToken: string;
        tokenType: string;
        permissions: string[];
    }
}

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
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
                    body: JSON.stringify({ 
                        email: credentials?.email, 
                        phoneNumber: credentials?.phoneNumber, 
                        password: credentials?.password 
                    })
                })
                const data = await res.json();
                console.log(data);
                
                if (res.ok && data && data.status === "200 OK") {
                    const user = data.response;
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        accessToken: user.token,
                        tokenType: user.type,
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
            if (account && user) {
                token.accessToken = user.accessToken;
                token.tokenType = user.tokenType;
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.permissions = user.permissions;
            }
            return token;
        },
        async session({ session, token }) {         
             if(token){
                session.user = {
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    accessToken: token.accessToken,
                    tokenType: token.tokenType,
                    permissions: token.permissions
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