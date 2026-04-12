import type { NextConfig } from "next";

// Parse API URL from environment variable
const parseApiUrl = () => {
  const apiUrl = process.env.SPRING_API || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.slice(0, -1), // remove trailing ':'
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? '443' : '80'),
    };
  } catch {
    // Fallback values if URL parsing fails
    return {
      protocol: "http",
      hostname: "localhost", 
      port: "8080"
    };
  }
};

const apiConfig = parseApiUrl();

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: apiConfig.protocol as "http" | "https",
        hostname: apiConfig.hostname,
        port: apiConfig.port,
        pathname: "/api/public/image/**"
      },
      {
        protocol: apiConfig.protocol as "http" | "https",
        hostname: apiConfig.hostname,
        port: apiConfig.port,
        pathname: "/api/public/landing-images/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",     
        pathname: "/**"   
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,    
  }
};

export default nextConfig;
