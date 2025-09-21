import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed    
    if (req.nextUrl.pathname.startsWith("/api/") 
      && req.nextauth.token) {
      const requestHeaders = new Headers(req.headers);
      if (req.nextauth.token?.provider === "google") {
        requestHeaders.set('authorization', `Bearer google-${req.nextauth.token.idToken}`);        
      } else if (req.nextauth.token?.provider === "facebook") {
        requestHeaders.set('authorization', `Bearer facebook-${req.nextauth.token.accessToken}`);        
      } else if (req.nextauth.token?.provider === "credentials") {
        requestHeaders.set('authorization', `Bearer ${req.nextauth.token.accessToken}`);        
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    return NextResponse.next();
  }
  , {
    callbacks: {
      authorized: ({ token, req }) => {
        const publicApiRoutes = [
          "/api/public"
        ]
        if (publicApiRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return true; // Allow access to public API routes without authentication
        }
        if (token) {
          return true; // Allow access if token exists
        }
        return false;
      },
    }
  }
);

export const config = {
  matcher: [
    "/profile/:path*", // Protect /profile and all sub-routes
    "/api/users/:path*", // Protect all API routes    
    "/api/((?!auth|public).)*", // Protect all API routes except auth and public
    "/api/province/:path*",
    "/api/posts/upload/:path*",
    "/api/media/draft/:path*",
    "/api/media/upload/:path*",
    "/api/manage/:path*",
    "/api/manage/posts/:path*",
    "/api/manage/post-status/:path*",    
  ]
};