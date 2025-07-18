# Network Troubleshooting for Google OAuth

## Error: getaddrinfo ENOTFOUND accounts.google.com

This error indicates that your system cannot resolve or connect to Google's OAuth servers. Here are the troubleshooting steps:

## 1. Network Connectivity Check

### Test DNS Resolution
```powershell
# Test if you can resolve Google's OAuth domain
nslookup accounts.google.com

# Try with different DNS servers
nslookup accounts.google.com 8.8.8.8
nslookup accounts.google.com 1.1.1.1
```

### Test Network Connectivity
```powershell
# Test basic connectivity
ping google.com
ping 8.8.8.8

# Test HTTPS connectivity
curl -I https://accounts.google.com
```

## 2. Common Solutions

### Solution 1: Change DNS Settings
1. Open Network Settings
2. Change DNS to Google DNS: `8.8.8.8` and `8.8.4.4`
3. Or use Cloudflare DNS: `1.1.1.1` and `1.0.0.1`
4. Restart your network adapter

### Solution 2: Check Firewall/Antivirus
1. Temporarily disable Windows Firewall
2. Temporarily disable antivirus
3. Check if corporate firewall is blocking OAuth requests

### Solution 3: VPN/Proxy Issues
1. If using VPN, try disabling it
2. If behind corporate proxy, configure proxy settings
3. Check with your network administrator

### Solution 4: Flush DNS Cache
```powershell
ipconfig /flushdns
ipconfig /release
ipconfig /renew
```

## 3. Development Workarounds

### Option A: Use Development Mode
Update your `.env.local`:
```env
# Temporarily disable Google OAuth for development
NEXTAUTH_URL=http://localhost:3000
# Comment out Google credentials temporarily
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

### Option B: Use Local Testing
For local development, you can temporarily disable Google OAuth and focus on credentials authentication.

## 4. Production Considerations

- Ensure your production server has proper DNS resolution
- Configure proper firewall rules for OAuth callbacks
- Test from different network environments
- Consider using a different OAuth provider as backup

## 5. Error Handling Implemented

The application now includes:
- Network error detection and user-friendly messages
- Loading states for OAuth requests
- Graceful fallback to credentials authentication
- Retry mechanisms with timeout handling

## 6. Next Steps

1. Try the DNS and network solutions above
2. Test the updated error handling in the app
3. If network issues persist, consider using credentials authentication only
4. Contact your network administrator if in a corporate environment
