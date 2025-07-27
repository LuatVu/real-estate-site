import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from "next-auth/providers/facebook";

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            accessToken: string;
            idToken?: string; // Optional, if using ID tokens
            tokenType: string;
            permissions: string[];
        }
        provider?: string; // Optional, to track the provider used for sign-in
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
        idToken: string; // Optional, if using ID tokens
        accessTokenExpires?: number; // Optional, if you want to track token expiration
        tokenType: string;
        permissions: string[];
        provider?: string; // Optional, to track the provider used for sign-in
    }
}

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            httpOptions: {
                timeout: 10000, // 10 seconds timeout
            }
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: "email,public_profile" // Request additional permissions
                }
            },
            userinfo: {
                params: {
                    fields: "id,name,email,picture,first_name,last_name" // Request specific fields
                }
            },
            httpOptions: {
                timeout: 10000, // 10 seconds timeout
            }
        }),
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
        async jwt({ token, account, user, profile }) {
            if (account && user) {
                if (account.provider === "google") {
                    // Handle Google OAuth sign-in
                    token.accessToken = account.access_token || "";
                    token.idToken = account.id_token || "";                    
                    token.tokenType = "Bearer google-";
                    token.id = user.id;
                    token.username = user.name || user.email?.split('@')[0] || "";
                    token.email = user.email || "";
                    token.permissions = []; // Default permissions for Google users
                    token.provider = account.provider; // Store provider information
                    console.log("Google sign-in successful:", token);
                    console.log("User profile:", profile);
                    console.log("Account details:", account);
                    console.log("User details:", user);

                } else if (account.provider === "facebook") {
                    // Handle Facebook OAuth sign-in
                    token.accessToken = account.access_token || "";
                    token.tokenType = "Bearer facebook-";
                    token.id = user.id;
                    token.username = user.name || profile?.name || user.email?.split('@')[0] || "";
                    token.email = user.email || "";
                    token.permissions = []; // Default permissions for Facebook users
                    token.provider = account.provider; // Store provider information
                } else if (account.provider === "credentials") {
                    // Handle credentials sign-in
                    token.accessToken = user.accessToken;
                    token.tokenType = user.tokenType;
                    token.id = user.id;
                    token.username = user.username;
                    token.email = user.email;
                    token.permissions = user.permissions;
                    token.provider = account.provider; // Store provider information
                }
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
                    idToken: token.idToken || "", // Optional, if using ID tokens
                    tokenType: token.tokenType,
                    permissions: token.permissions
                };
                session.provider = token.provider; // Add provider information to session
             }
            return session;
        },
        async redirect({ url, baseUrl }) {            
            if (url.startsWith("/")) return `${baseUrl}${url}`           
            else if (new URL(url).origin === baseUrl) return url
            return url
        },
        async signIn({ user, account, profile, email, credentials }) {
            if(account?.provider == "google"){
                // Handle Google sign-in                
                await fetch(`${process.env.SPRING_API}/api/users/check-and-create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer google-${account.id_token}`
                    },
                    body: JSON.stringify({                        
                        username: user.name,
                        email: user.email,
                        authProvider: account.provider,
                        googleId: user.id
                    }),
                });
            }else if(account?.provider == "facebook"){
                // Handle Facebook sign-in  
                await fetch(`${process.env.SPRING_API}/api/users/check-and-create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer facebook-${account.id_token}`
                    },
                    body: JSON.stringify({
                        username: user.name,
                        email: user.email,
                        authProvider: account.provider,
                        facebookId: user.id
                    }),
                });
            }
            return true
        },
    },
    pages: {
        // signIn: '/sign-in'
    }
} 