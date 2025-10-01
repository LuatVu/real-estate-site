import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: {
    template: '%s | Nhà đẹp quá - Bất động sản',
    default: 'Nhà đẹp quá - Bất động sản, mua bán nhà đất',
  },
  description: "Trang web bất động sản hàng đầu Việt Nam. Tìm kiếm, mua bán nhà đất, căn hộ, biệt thự với hàng ngàn tin đăng chất lượng, uy tín và cập nhật liên tục.",
  keywords: [
    'bất động sản',
    'nhà đất',
    'căn hộ',
    'biệt thự',
    'mua bán nhà',
    'cho thuê nhà',
    'real estate',
    'property',
    'Vietnam real estate'
  ],
  authors: [{ name: 'Nhà đẹp quá Team' }],
  creator: 'Nhà đẹp quá',
  publisher: 'Nhà đẹp quá',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'Nhà đẹp quá - Bất động sản',
    title: 'Nhà đẹp quá - Bất động sản, mua bán nhà đất',
    description: 'Trang web bất động sản hàng đầu Việt Nam. Tìm kiếm, mua bán nhà đất, căn hộ, biệt thự với hàng ngàn tin đăng chất lượng.',
    images: [
      {
        url: '/temp/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nhà đẹp quá - Bất động sản',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nhà đẹp quá - Bất động sản',
    description: 'Trang web bất động sản hàng đầu Việt Nam',
    images: ['/temp/og-image.jpg'],
    creator: '@nhadepqua',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
  category: 'real estate',
  classification: 'real estate website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/your-main-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nhà đẹp quá" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nhà đẹp quá",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
              "logo": `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/icons/nhadepqua_logo.svg`,
              "description": "Trang web bất động sản hàng đầu Việt Nam",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "VN"
              },
              "sameAs": [
                "https://facebook.com/nhadepqua",
                "https://twitter.com/nhadepqua",
                "https://instagram.com/nhadepqua"
              ]
            })
          }}
        />
      </head>
      <AuthProvider>
        <body className="antialiased">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
