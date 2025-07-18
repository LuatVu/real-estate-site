# Google OAuth Setup Guide

## Overview
This project now supports Google OAuth sign-in alongside the existing credentials-based authentication.

## Google OAuth Configuration

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the API & Services section
5. Create OAuth 2.0 Client IDs
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

### 2. Environment Variables
The following environment variables are already configured in `.env.local`:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Replace these with your actual Google OAuth credentials from the Google Cloud Console.

### 3. Features Implemented

#### Authentication Provider
- Added Google OAuth provider to NextAuth configuration
- Supports both Google OAuth and credentials sign-in
- Handles user data mapping for both authentication methods

#### User Data Handling
- **Google Users**: 
  - Username is derived from Google name or email
  - Default empty permissions array
  - Access token from Google OAuth
- **Credentials Users**: 
  - Full user data from your Spring backend API
  - Custom permissions and user roles

#### Sign-in UI
- Updated both mobile and desktop sign-in pages
- Added functional Google sign-in buttons
- Maintained existing UI design and styling

### 4. Usage

Users can now sign in using:
1. **Email/Phone + Password**: Existing credentials authentication
2. **Google Account**: One-click Google OAuth sign-in

Both methods will create a session with the same structure, making user management consistent across authentication methods.

### 5. Session Data Structure

```typescript
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
```

### 6. Next Steps

If you want to sync Google users with your Spring backend:
1. Create an API endpoint to handle Google user registration
2. Modify the JWT callback to call your backend when a Google user signs in
3. Store Google users in your database with appropriate permissions

## Testing

To test Google OAuth:
1. Start your development server: `npm run dev`
2. Navigate to `/sign-in`
3. Click "Tiếp tục với Google" button
4. Complete the Google OAuth flow
5. You should be redirected back to your app with an active session
