import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { options as authOptions } from "../../api/auth/[...nextauth]/options";
import LandingPageClient from "./landing-page-client";
import { ErrorBoundary } from "../../posts/error-boundary";

// Generate static params for popular landing pages (optional - improves performance)
export async function generateStaticParams() {
  try {
    // You can fetch popular landing pages for static generation if needed
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/public/landing-page/${id}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      return {
        title: 'Landing Page | Real Estate Site',
        description: 'View real estate landing page'
      };
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {      
      return {
        title: 'Landing Page | Real Estate Site',
        description: 'View real estate landing page'
      };
    }
    
    const result = await response.json();
    const landingPage = result.response;
    
    if (!landingPage) {
      return {
        title: 'Landing Page Not Found | Real Estate Site',
        description: 'The requested landing page could not be found'
      };
    }
    
    const title = `${landingPage.title} | Real Estate Site`;
    const description = landingPage.address ? 
      `${landingPage.title} - ${landingPage.address}. Explore detailed information about this real estate development.` : 
      `${landingPage.title}. Explore detailed information about this real estate development.`;
    
    // Extract first image from sections for social sharing
    const firstImageSection = landingPage.sections?.find((section: any) => 
      (section.type === 'image' || section.type === 'text-image') && section.content?.imageUrl
    );
    const imageUrl = firstImageSection?.content?.imageUrl || '/temp/placeholder-property.jpg';
    
    return {
      title,
      description,
      keywords: [
        'real estate',
        'property development',
        'bất động sản',
        landingPage.title,
        landingPage.address,
        'dự án',
        'căn hộ',
        'landing page'
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        images: [imageUrl],
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/landing-page/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/landing-page/${id}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Landing Page | Real Estate Site',
      description: 'View real estate landing page'
    };
  }
}

// Server-side data fetching
async function getLandingPageData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/public/landing-page/${id}`,
      { 
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {      
      return null;
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {      
      return null;
    }
    
    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return null;
  }
}

// Generate structured data for SEO
function generateStructuredData(landingPage: any, pageId: string) {
  if (!landingPage) return [];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Extract images from sections
  const images = landingPage.sections
    ?.filter((section: any) => (section.type === 'image' || section.type === 'text-image') && section.content?.imageUrl)
    ?.map((section: any) => section.content.imageUrl) || [];
  
  // Real Estate Listing structured data
  const realEstateListing = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": landingPage.title,
    "description": landingPage.address || landingPage.title,
    "url": `${baseUrl}/landing-page/${pageId}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": landingPage.address,
      "addressCountry": "VN"
    },
    "image": images,
    "datePosted": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "Real Estate Site",
      "url": baseUrl
    }
  };

  // Breadcrumb structured data
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": baseUrl
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Dự án",
        "item": `${baseUrl}/projects`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": landingPage.title,
        "item": `${baseUrl}/landing-page/${pageId}`
      }
    ]
  };

  // WebPage structured data
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": landingPage.title,
    "description": landingPage.address || landingPage.title,
    "url": `${baseUrl}/landing-page/${pageId}`,
    "mainEntity": {
      "@id": `${baseUrl}/landing-page/${pageId}#realestate`
    },
    "breadcrumb": {
      "@id": `${baseUrl}/landing-page/${pageId}#breadcrumb`
    }
  };

  return [realEstateListing, breadcrumbList, webPage];
}

export default async function LandingPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const [session, landingPage] = await Promise.all([
      getServerSession(authOptions),
      getLandingPageData(id)
    ]);
    
    if (!landingPage) {
      return (
        <ErrorBoundary>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Landing Page Not Found</h1>
              <p className="text-gray-600">The requested landing page could not be found.</p>
            </div>
          </div>
        </ErrorBoundary>
      );
    }
    
    const structuredDataArray = generateStructuredData(landingPage, id);
    
    return (
      <ErrorBoundary>
        {/* Structured Data for SEO */}
        {structuredDataArray.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data)
            }}
          />
        ))}
        
        {/* Main Content - no Suspense needed since server component already awaits data */}
        <LandingPageClient landingPage={landingPage} session={session} />
      </ErrorBoundary>
    );
  } catch (error) {    
    return (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Landing Page</h1>
            <p className="text-gray-600">There was an error loading the landing page details.</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
