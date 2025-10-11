import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { options as authOptions } from "../../api/auth/[...nextauth]/options";
import PostClient from "./post-client";

// Generate static params for popular posts (optional - improves performance)
export async function generateStaticParams() {
  try {
    // Fetch the most recent or popular posts for static generation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/posts?page=0&size=10&sort=createdAt,desc`,
      { cache: 'force-cache' }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    const posts = result.response?.content || [];
    
    return posts.slice(0, 10).map((post: any) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const {id} = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: 'Property Details | Real Estate Site',
        description: 'View detailed property information'
      };
    }
    
    const result = await response.json();
    const post = result.response;
    
    if (!post) {
      return {
        title: 'Property Not Found | Real Estate Site',
        description: 'The requested property could not be found'
      };
    }
    
    const title = `${post.title} - ${post.address} | Real Estate Site`;
    const description = post.description ? 
      `${post.description.substring(0, 160)}...` : 
      `Property for sale: ${post.bedrooms} bedrooms, ${post.acreage}m², ${post.address}`;
    
    const imageUrl = post.images?.[0] ? 
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${post.images[0].fileUrl}` : 
      '/temp/placeholder-property.jpg';
    
    return {
      title,
      description,
      keywords: [
        'real estate',
        'property',
        'bất động sản',
        post.address,
        `${post.bedrooms} bedrooms`,
        `${post.acreage}m²`,
        post.legal,
        post.furniture
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        images: [imageUrl],
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${id}`,
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
      title: 'Property Details | Real Estate Site',
      description: 'View detailed property information'
    };
  }
}

// Server-side data fetching
async function getPostData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/posts/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    
    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Generate structured data for SEO
function generateStructuredData(post: any, postId: string) {
  if (!post) return [];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const imageUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  
  // Real Estate Listing structured data
  const realEstateListing = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": post.title,
    "description": post.description,
    "url": `${baseUrl}/post/${postId}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": post.address,
      "addressCountry": "VN"
    },
    "price": {
      "@type": "MonetaryAmount",
      "value": post.price,
      "currency": "VND"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": post.acreage,
      "unitCode": "MTK"
    },
    "numberOfBedrooms": post.bedrooms,
    "numberOfBathroomsTotal": post.bathrooms,
    "numberOfRooms": post.floors,
    "image": post.images?.map((img: any) => 
      `${imageUrl}/api/public/image/${img.fileUrl}`
    ) || [],
    "datePosted": post.createdAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.createdAt || new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "Real Estate Site",
      "url": baseUrl
    },
    "offers": {
      "@type": "Offer",
      "price": post.price,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
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
        "name": "Bất động sản",
        "item": `${baseUrl}/posts`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${baseUrl}/post/${postId}`
      }
    ]
  };

  // WebPage structured data
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": post.title,
    "description": post.description,
    "url": `${baseUrl}/post/${postId}`,
    "mainEntity": {
      "@id": `${baseUrl}/post/${postId}#realestate`
    },
    "breadcrumb": {
      "@id": `${baseUrl}/post/${postId}#breadcrumb`
    }
  };
  
  return [realEstateListing, breadcrumbList, webPage];
}

export default async function Posts({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const {id} = await params;
  const post = await getPostData(id);
  
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-600">The requested property could not be found.</p>
        </div>
      </div>
    );
  }
  
  const structuredDataArray = generateStructuredData(post, id);
  
  return (
    <>
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
      
      {/* Main Content */}
      <PostClient post={post} session={session} />
    </>
  );
}



