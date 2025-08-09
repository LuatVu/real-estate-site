import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log("Protected route accessed:", req.nextUrl.pathname);
  },  
);

export const config = { 
  matcher: [
    "/profile/:path*", // Protect /profile and all sub-routes
    // Add more protected routes here if needed
    // "/dashboard/:path*",
    // "/admin/:path*"
  ] 
};